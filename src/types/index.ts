export type NotificationFilters = {
  notification_type?: string;
  limit?: number;
};

export type Notification = {
  ID: string;
  Type: 'Placement' | 'Result' | 'Event' | string;
  Message: string;
  Timestamp: string;
  viewed?: boolean;
  priorityScore?: number;
};
