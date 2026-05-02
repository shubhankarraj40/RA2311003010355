'use client';

import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { NotificationCard } from './NotificationCard';
import { useNotifications } from '../contexts/NotificationContext';

export function PriorityInbox() {
  const { priorityNotifications, loading, error } = useNotifications();

  if (loading && priorityNotifications.length === 0) {
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

  if (priorityNotifications.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No priority notifications available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {priorityNotifications.map((notification) => (
        <NotificationCard key={notification.ID} notification={notification} isPriority={true} />
      ))}
    </Box>
  );
}
