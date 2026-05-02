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
  | { type: 'SET_PAGE'; payload: number };

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
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_NOTIFICATIONS':
      return { 
        ...state, 
        notifications: action.payload.notifications, 
        totalCount: action.payload.totalCount,
        loading: false,
        error: null 
      };
    case 'SET_PRIORITY_NOTIFICATIONS':
      return { ...state, priorityNotifications: action.payload, loading: false };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload, currentPage: 1 };
    case 'MARK_AS_VIEWED':
      const newViewedSet = new Set(state.viewedNotifications);
      newViewedSet.add(action.payload);
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
      return {
        ...state,
        viewedNotifications: new Set(allIds),
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

  const fetchNotifications = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Use mock data directly
      let filteredNotifications = mockNotifications;
      
      // Apply filters
      if (state.filters.notification_type) {
        filteredNotifications = filteredNotifications.filter(n => n.Type === state.filters.notification_type);
      }
      
      if (state.filters.limit) {
        filteredNotifications = filteredNotifications.slice(0, state.filters.limit);
      }
      
      const notificationsWithViewedStatus = filteredNotifications.map(notif => ({
        ...notif,
        viewed: state.viewedNotifications.has(notif.ID),
      }));

      dispatch({
        type: 'SET_NOTIFICATIONS',
        payload: {
          notifications: notificationsWithViewedStatus,
          totalCount: mockNotifications.length,
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch notifications' });
    }
  };

  const fetchPriorityNotifications = async (topN: number = 10) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Calculate priority scores for mock data
      const notificationsWithScore = mockNotifications.map(notification => ({
        ...notification,
        priorityScore: calculatePriorityScore(notification),
      }));

      // Sort by priority score (descending) and take top N
      const priorityNotifications = notificationsWithScore
        .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
        .slice(0, topN);
      
      const priorityWithViewedStatus = priorityNotifications.map(notif => ({
        ...notif,
        viewed: state.viewedNotifications.has(notif.ID),
      }));

      dispatch({ type: 'SET_PRIORITY_NOTIFICATIONS', payload: priorityWithViewedStatus });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch priority notifications' });
    }
  };

  const calculatePriorityScore = (notification: Notification): number => {
    // Priority weights
    const weights = {
      Placement: 3,
      Result: 2,
      Event: 1,
    };

    const weight = weights[notification.Type] || 1;
    
    // Parse timestamp and calculate recency factor
    const notificationTime = new Date(notification.Timestamp).getTime();
    const currentTime = Date.now();
    const hoursAgo = (currentTime - notificationTime) / (1000 * 60 * 60);
    
    // Recency decay factor (higher for more recent notifications)
    const recencyFactor = Math.max(0.1, 1 - (hoursAgo / 168)); // Decay over a week
    
    return weight * recencyFactor;
  };

  const markAsViewed = (id: string) => {
    dispatch({ type: 'MARK_AS_VIEWED', payload: id });
  };

  const markAllAsViewed = () => {
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
    const allNotifications = [...state.notifications, ...state.priorityNotifications];
    return allNotifications.filter(notif => !notif.viewed).length;
  };

  useEffect(() => {
    // Always fetch notifications since we're using mock data
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
