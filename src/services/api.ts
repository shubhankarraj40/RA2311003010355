import axios from 'axios';
import { Notification, ApiResponse, User, AuthResponse, NotificationFilters } from '@/types';
import { mockNotifications, mockApiResponse } from './mockData';

const API_BASE_URL = 'http://20.244.56.144/evaluation-service';
const ACCESS_CODE = 'QkbpxH';

class ApiService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    // Initialize axios defaults
    axios.defaults.baseURL = API_BASE_URL;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.timeout = 10000; // 10 second timeout
  }

  async register(userData: Partial<User>): Promise<User> {
    try {
      const timestamp = Date.now();
      const registrationData = {
        email: `frontend${timestamp}@university.edu`,
        name: userData.name || 'Frontend User',
        mobileNo: `9${timestamp.toString().slice(-9)}`,
        githubUsername: `frontenduser${timestamp}`,
        rollNo: userData.rollNo || `FRONT${timestamp}`,
        accessCode: ACCESS_CODE,
      };

      const response = await axios.post<User>('/register', registrationData);
      this.user = response.data;
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async authenticate(): Promise<AuthResponse> {
    try {
      if (!this.user) {
        throw new Error('User not registered. Please register first.');
      }

      const authData = {
        email: this.user.email,
        name: this.user.name,
        rollNo: this.user.rollNo,
        accessCode: ACCESS_CODE,
        clientID: this.user.clientID,
        clientSecret: this.user.clientSecret,
      };

      const response = await axios.post<AuthResponse>('/auth', authData);
      this.token = response.data.access_token;
      
      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      
      return response.data;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  async getNotifications(filters?: NotificationFilters): Promise<ApiResponse> {
    try {
      if (!this.token) {
        throw new Error('Not authenticated. Please authenticate first.');
      }

      const params = new URLSearchParams();
      if (filters?.notification_type) {
        params.append('notification_type', filters.notification_type);
      }
      if (filters?.limit) {
        params.append('limit', filters.limit.toString());
      }
      if (filters?.page) {
        params.append('page', filters.page.toString());
      }

      const url = `/notifications${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await axios.get<ApiResponse>(url);
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  }

  async getPriorityNotifications(topN: number = 10): Promise<Notification[]> {
    try {
      // Get all notifications first
      const allNotifications = await this.getNotifications();
      
      // Calculate priority scores
      const notificationsWithScore = allNotifications.notifications.map(notification => ({
        ...notification,
        priorityScore: this.calculatePriorityScore(notification),
      }));

      // Sort by priority score (descending) and take top N
      const priorityNotifications = notificationsWithScore
        .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
        .slice(0, topN);

      return priorityNotifications;
    } catch (error) {
      console.error('Failed to fetch priority notifications:', error);
      throw error;
    }
  }

  private calculatePriorityScore(notification: Notification): number {
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
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }
}

export const apiService = new ApiService();
