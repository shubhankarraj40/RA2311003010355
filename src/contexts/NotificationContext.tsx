'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Notification, NotificationFilters } from '../types';
import { mockNotifications, mockApiResponse } from '../services/mockData';

interface NotificationState {
  notifications: Notification[];
  priorityNotifications: Notification[];
  loading: boolean;
  error: string | null;
  filters: NotificationFilters;
  viewedNotifications: Set<string>;
  totalCount: number;
  currentPage: number;
}

type NotificationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTIFICATIONS'; payload: { notifications: Notification[]; totalCount: number } }
  | { type: 'SET_PRIORITY_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_FILTERS'; payload: NotificationFilters }
  | { type: 'MARK_AS_VIEWED'; payload: string }
  | { type: 'MARK_ALL_AS_VIEWED' }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'INIT_VIEWED'; payload: Set<string> };

const initialState: NotificationState = {
  notifications: [],
  priorityNotifications: [],
  loading: false,
  error: null,
  filters: {},
  viewedNotifications: new Set(),
  totalCount: 0,
  currentPage: 1,
};

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'INIT_VIEWED':
      return { ...state, viewedNotifications: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_NOTIFICATIONS':
      return { 
        ...state, 
        notifications: action.payload.notifications.map(n => ({ ...n, viewed: state.viewedNotifications.has(n.ID) })), 
        totalCount: action.payload.totalCount,
        loading: false,
        error: null 
      };
    case 'SET_PRIORITY_NOTIFICATIONS':
      return { 
        ...state, 
        priorityNotifications: action.payload.map(n => ({ ...n, viewed: state.viewedNotifications.has(n.ID) })), 
        loading: false 
      };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload, currentPage: 1 };
    case 'MARK_AS_VIEWED':
      const newViewedSet = new Set(state.viewedNotifications);
      newViewedSet.add(action.payload);
      // Persist to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(newViewedSet)));
      }
      return {
        ...state,
        viewedNotifications: newViewedSet,
        notifications: state.notifications.map(notif =>
          notif.ID === action.payload ? { ...notif, viewed: true } : notif
        ),
        priorityNotifications: state.priorityNotifications.map(notif =>
          notif.ID === action.payload ? { ...notif, viewed: true } : notif
        ),
      };
    case 'MARK_ALL_AS_VIEWED':
      const allIds = Array.from([...state.notifications, ...state.priorityNotifications]).map(n => n.ID);
      const allViewedSet = new Set(allIds);
      if (typeof window !== 'undefined') {
        localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(allViewedSet)));
      }
      return {
        ...state,
        viewedNotifications: allViewedSet,
        notifications: state.notifications.map(notif => ({ ...notif, viewed: true })),
        priorityNotifications: state.priorityNotifications.map(notif => ({ ...notif, viewed: true })),
      };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
}

interface NotificationContextType extends NotificationState {
  fetchNotifications: () => Promise<void>;
  fetchPriorityNotifications: (topN?: number) => Promise<void>;
  markAsViewed: (id: string) => void;
  markAllAsViewed: () => void;
  setFilters: (filters: NotificationFilters) => void;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;
  getUnviewedCount: () => number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Initialize viewed status from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('viewedNotifications');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          dispatch({ type: 'INIT_VIEWED', payload: new Set(parsed) });
        } catch (e) {
          console.error("Failed to parse viewed notifications from local storage");
        }
      }
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await logger.info('frontend', 'api', `Fetching notifications... filters: ${JSON.stringify(state.filters)}`);
      
      const params = new URLSearchParams();
      if (state.filters.limit) params.append('limit', state.filters.limit.toString());
      if (state.filters.notification_type) params.append('notification_type', state.filters.notification_type);
      if (state.currentPage > 1) params.append('page', state.currentPage.toString());
      
      const response = await axios.get(`/api/notifications?${params.toString()}`);
      const data = response.data.notifications || response.data || [];
      
      await logger.info('frontend', 'api', `Successfully fetched ${data.length} notifications`);
      
      dispatch({
        type: 'SET_NOTIFICATIONS',
        payload: {
          notifications: data,
          totalCount: data.length, // update if API returns total count
        },
      });
    } catch (error) {
      await logger.error('frontend', 'api', `Failed to fetch notifications: ${error}`);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch notifications' });
    }
  };

  const fetchPriorityNotifications = async (topN: number = 10) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await logger.info('frontend', 'api', `Fetching priority notifications... topN: ${topN}`);
      
      // Get all notifications to calculate priority since API doesn't have a priority endpoint
      const response = await axios.get('/api/notifications');
      const data: Notification[] = response.data.notifications || response.data || [];
      
      const calculatePriorityScore = (notification: Notification): number => {
        const weights: Record<string, number> = { Placement: 3, Result: 2, Event: 1 };
        const weight = weights[notification.Type] || 1;
        const notificationTime = new Date(notification.Timestamp).getTime();
        const hoursAgo = (Date.now() - notificationTime) / (1000 * 60 * 60);
        const recencyFactor = Math.max(0.1, 1 - (hoursAgo / 168)); 
        return weight * recencyFactor;
      };

      const notificationsWithScore = data.map(notification => ({
        ...notification,
        priorityScore: calculatePriorityScore(notification),
      }));

      const priorityNotifications = notificationsWithScore
        .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
        .slice(0, topN);
      
      await logger.info('frontend', 'api', `Successfully computed ${priorityNotifications.length} priority notifications`);
      
      dispatch({ type: 'SET_PRIORITY_NOTIFICATIONS', payload: priorityNotifications });
    } catch (error) {
      await logger.error('frontend', 'api', `Failed to fetch priority notifications: ${error}`);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch priority notifications' });
    }
  };

  const markAsViewed = async (id: string) => {
    await logger.info('frontend', 'interaction', `Marked notification ${id} as viewed`);
    dispatch({ type: 'MARK_AS_VIEWED', payload: id });
  };

  const markAllAsViewed = async () => {
    await logger.info('frontend', 'interaction', `Marked all notifications as viewed`);
    dispatch({ type: 'MARK_ALL_AS_VIEWED' });
  };

  const setFilters = (filters: NotificationFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setPage = (page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  const refresh = async () => {
    await Promise.all([
      fetchNotifications(),
      fetchPriorityNotifications(),
    ]);
  };

  const getUnviewedCount = () => {
    return state.notifications.filter(notif => !state.viewedNotifications.has(notif.ID)).length;
  };

  useEffect(() => {
    fetchNotifications();
    fetchPriorityNotifications();
  }, [state.filters, state.currentPage]);

  const value: NotificationContextType = {
    ...state,
    fetchNotifications,
    fetchPriorityNotifications,
    markAsViewed,
    markAllAsViewed,
    setFilters,
    setPage,
    refresh,
    getUnviewedCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
