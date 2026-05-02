'use client';

import React from 'react';
import { Card, CardContent, Typography, Chip, Box, CircularProgress, Alert } from '@mui/material';
import { useNotifications } from '../contexts/NotificationContextClean';

export function SimpleNotificationList() {
  const { notifications, loading, error } = useNotifications();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (notifications.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No notifications found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        All Notifications
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Showing {notifications.length} notifications
      </Typography>

      {notifications.map((notification) => (
        <Card key={notification.ID} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Chip
                label={notification.Type}
                color={notification.Type === 'Placement' ? 'success' : notification.Type === 'Result' ? 'warning' : 'info'}
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
              <Typography variant="caption" color="text.secondary">
                {new Date(notification.Timestamp).toLocaleString()}
              </Typography>
            </Box>
            
            <Typography variant="h6" sx={{ fontWeight: notification.viewed ? 'normal' : 'bold', mb: 1 }}>
              {notification.Message}
            </Typography>
            
            {!notification.viewed && (
              <Chip label="New" color="primary" size="small" sx={{ mt: 1 }} />
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
