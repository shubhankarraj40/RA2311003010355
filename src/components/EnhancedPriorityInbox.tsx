'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Badge,
  Paper,
  Fade,
  Slide,
  LinearProgress,
} from '@mui/material';
import {
  Star as StarIcon,
  Refresh as RefreshIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationContextClean';

export function EnhancedPriorityInbox() {
  const { 
    priorityNotifications, 
    loading, 
    error, 
    fetchPriorityNotifications, 
    markAllAsViewed, 
    refresh, 
    getUnviewedCount 
  } = useNotifications();

  const [topN, setTopN] = useState(10);
  const unviewedPriorityCount = priorityNotifications.filter(n => !n.viewed).length;

  const handleTopNChange = (value: number) => {
    setTopN(value);
    fetchPriorityNotifications(value);
  };

  const getPriorityStats = () => {
    const stats = {
      Placement: priorityNotifications.filter(n => n.Type === 'Placement').length,
      Result: priorityNotifications.filter(n => n.Type === 'Result').length,
      Event: priorityNotifications.filter(n => n.Type === 'Event').length,
    };
    return stats;
  };

  const stats = getPriorityStats();

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Fade in timeout={500}>
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                ⭐ Priority Inbox
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your most important notifications based on type and recency
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Badge badgeContent={unviewedPriorityCount} color="error">
                <Chip
                  label={`${unviewedPriorityCount} New Priority`}
                  color={unviewedPriorityCount > 0 ? 'warning' : 'success'}
                  variant="outlined"
                />
              </Badge>
              
              {unviewedPriorityCount > 0 && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={markAllAsViewed}
                  startIcon={<MarkEmailReadIcon />}
                  disabled={loading}
                >
                  Mark All Read
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Settings and Stats */}
      <Slide in timeout={600} direction="down">
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SettingsIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Priority Settings
              </Typography>
            </Box>
            
            <Tooltip title="Refresh priority notifications">
              <IconButton onClick={refresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Show top
              </Typography>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  value={topN}
                  onChange={(e) => handleTopNChange(Number(e.target.value))}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body2" color="text.secondary">
                notifications
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
              Priority: Placement (3) > Result (2) > Event (1)
            </Typography>
          </Box>

          {/* Priority Stats */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon sx={{ fontSize: 16 }} />
              Priority Distribution
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {Object.entries(stats).map(([type, count]) => (
                <Chip
                  key={type}
                  label={`${getTypeIcon(type)} ${type}: ${count}`}
                  color={getTypeColor(type) as any}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 'bold' }}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      </Slide>

      {/* Loading State */}
      {loading && priorityNotifications.length === 0 ? (
        <Box sx={{ p: 3 }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={refresh}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      ) : priorityNotifications.length === 0 ? (
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No priority notifications found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This could be due to API connectivity issues or no notifications being available.
            </Typography>
          </Box>
        </Fade>
      ) : (
        <Box>
          {/* Priority Notifications */}
          {priorityNotifications.map((notification, index) => (
            <Slide in timeout={300 + index * 100} direction="up" key={notification.ID}>
              <Card
                sx={{
                  mb: 2,
                  bgcolor: index === 0 ? 'primary.50' : 'background.paper',
                  border: index === 0 ? '2px solid' : '1px solid',
                  borderColor: index === 0 ? 'primary.main' : 'grey.300',
                  opacity: notification.viewed ? 0.8 : 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                {index === 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      left: -8,
                      bgcolor: 'gold',
                      color: 'black',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      zIndex: 1,
                    }}
                  >
                    <StarIcon sx={{ fontSize: 12 }} />
                    HIGHEST PRIORITY
                  </Box>
                )}

                <CardContent sx={{ pb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1, mr: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={`${getTypeIcon(notification.Type)} ${notification.Type}`}
                          color={getTypeColor(notification.Type) as any}
                          size="small"
                          sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}
                        />
                        <Chip
                          label="PRIORITY"
                          color="primary"
                          size="small"
                          sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                        />
                        {notification.priorityScore && (
                          <Chip
                            label={`Score: ${notification.priorityScore.toFixed(3)}`}
                            variant="outlined"
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                        {!notification.viewed && (
                          <Chip
                            label="NEW"
                            color="secondary"
                            size="small"
                            sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: notification.viewed ? 'normal' : 'bold',
                          mb: 1,
                          lineHeight: 1.3,
                          color: notification.viewed ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {notification.Message}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <TimelineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(notification.Timestamp)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Tooltip title={notification.viewed ? 'Mark as unread' : 'Mark as read'}>
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: notification.viewed ? 'action.disabled' : 'primary.main',
                            color: notification.viewed ? 'text.secondary' : 'white',
                            '&:hover': {
                              bgcolor: notification.viewed ? 'action.active' : 'primary.dark',
                            },
                          }}
                        >
                          {notification.viewed ? <MarkEmailReadIcon /> : <MarkEmailReadIcon />}
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
            </Slide>
          ))}

          {/* Summary */}
          <Fade in timeout={1000}>
            <Paper sx={{ p: 3, mt: 4, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon />
                Priority Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Priority Notifications: {priorityNotifications.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unviewed: {unviewedPriorityCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Updated: Just now
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Box>
      )}
    </Box>
  );
}

// Helper functions
function getTypeIcon(type: string): string {
  switch (type) {
    case 'Placement': return '🎯';
    case 'Result': return '📊';
    case 'Event': return '🎉';
    default: return '📬';
  }
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'Placement': return 'success';
    case 'Result': return 'warning';
    case 'Event': return 'info';
    default: return 'default';
  }
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
}
