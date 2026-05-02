'use client';

import React from 'react';
import { Box, Typography, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import { NotificationCard } from './NotificationCard';
import { useNotifications } from '../contexts/NotificationContext';
import { initializeLogger } from 'notification-logging-middleware';

const logger = initializeLogger({
  apiUrl: '/api/logs',
  enableConsole: true
});

export function NotificationList() {
  const { notifications, loading, error, filters, setFilters } = useNotifications();

  const handleTypeChange = async (event: any) => {
    const type = event.target.value;
    await logger.info('frontend', 'interaction', `Filter changed to type: ${type}`);
    setFilters({ ...filters, notification_type: type === 'All' ? undefined : type });
  };

  const handleLimitChange = async (event: any) => {
    const limit = event.target.value;
    await logger.info('frontend', 'interaction', `Limit changed to: ${limit}`);
    setFilters({ ...filters, limit });
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.notification_type || 'All'}
            label="Type"
            onChange={handleTypeChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Limit</InputLabel>
          <Select
            value={filters.limit || 50}
            label="Limit"
            onChange={handleLimitChange}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {loading && notifications.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && notifications.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No notifications available.
          </Typography>
        </Box>
      )}

      {notifications.map((notification) => (
        <NotificationCard key={notification.ID} notification={notification} />
      ))}
    </Box>
  );
}
