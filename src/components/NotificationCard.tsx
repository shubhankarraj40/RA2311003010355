'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { Notification } from '@/types';
import { useNotifications } from '@/contexts/NotificationContext';

interface NotificationCardProps {
  notification: Notification;
  isPriority?: boolean;
}

const getNotificationColor = (type: Notification['Type']) => {
  switch (type) {
    case 'Placement':
      return 'success';
    case 'Result':
      return 'warning';
    case 'Event':
      return 'info';
    default:
      return 'default';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export function NotificationCard({ notification, isPriority = false }: NotificationCardProps) {
  const { markAsViewed } = useNotifications();

  const handleMarkAsViewed = () => {
    if (!notification.viewed) {
      markAsViewed(notification.ID);
    }
  };

  const cardColor = isPriority ? 'primary.light' : 'background.paper';
  const borderColor = isPriority ? 'primary.main' : 'grey.300';

  return (
    <Card
      sx={{
        mb: 2,
        bgcolor: cardColor,
        border: `1px solid ${borderColor}`,
        opacity: notification.viewed ? 0.7 : 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
        position: 'relative',
      }}
    >
      {isPriority && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'primary.main',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          PRIORITY
        </Box>
      )}

      <CardContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ flex: 1, mr: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
              <Chip
                label={notification.Type}
                color={getNotificationColor(notification.Type) as any}
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
              {notification.priorityScore && isPriority && (
                <Chip
                  label={`Score: ${notification.priorityScore.toFixed(3)}`}
                  variant="outlined"
                  size="small"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: notification.viewed ? 'normal' : 'bold',
                mb: 1,
                color: notification.viewed ? 'text.secondary' : 'text.primary',
              }}
            >
              {notification.Message}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {formatTimestamp(notification.Timestamp)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Tooltip title={notification.viewed ? 'Mark as unread' : 'Mark as read'}>
              <IconButton
                size="small"
                onClick={handleMarkAsViewed}
                sx={{
                  bgcolor: notification.viewed ? 'action.disabled' : 'action.active',
                  color: notification.viewed ? 'text.secondary' : 'white',
                }}
              >
                {notification.viewed ? <MarkEmailUnreadIcon /> : <MarkEmailReadIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {!notification.viewed && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 4,
              height: '100%',
              bgcolor: 'primary.main',
              borderRadius: '4px 0 0 4px',
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
