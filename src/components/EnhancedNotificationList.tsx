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
  TextField,
  InputAdornment,
  Fade,
  Slide,
  IconButton,
  Tooltip,
  Badge,
  Pagination,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationContextClean';

export function EnhancedNotificationList() {
  const { 
    notifications, 
    loading, 
    error, 
    filters, 
    setFilters, 
    markAllAsViewed, 
    refresh, 
    getUnviewedCount,
    totalCount,
    currentPage,
    setPage 
  } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const unviewedCount = getUnviewedCount();

  const handleFilterChange = (field: string, value: any) => {
    setFilters({
      ...filters,
      [field]: value || undefined,
    });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter(notification =>
    notification.Message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.Type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Header Section */}
      <Fade in timeout={500}>
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                📬 All Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage and view all your campus notifications in one place
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Badge badgeContent={unviewedCount} color="error">
                <Chip
                  label={`${unviewedCount} Unviewed`}
                  color={unviewedCount > 0 ? 'warning' : 'success'}
                  variant="outlined"
                />
              </Badge>
              
              {unviewedCount > 0 && (
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

      {/* Search and Filters */}
      <Slide in timeout={600} direction="down">
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ minWidth: 250, flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action.active" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filters.notification_type || ''}
                label="Filter by Type"
                onChange={(e) => handleFilterChange('notification_type', e.target.value)}
                startAdornment={<FilterIcon sx={{ mr: 1, fontSize: 20 }} />}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Placement">🎯 Placement</MenuItem>
                <MenuItem value="Result">📊 Result</MenuItem>
                <MenuItem value="Event">🎉 Event</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Per Page</InputLabel>
              <Select
                value={filters.limit || 20}
                label="Per Page"
                onChange={(e) => handleFilterChange('limit', e.target.value)}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>

            <Tooltip title="Refresh notifications">
              <IconButton onClick={refresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredNotifications.length} of {totalCount} notifications
            </Typography>
            
            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                disabled={loading}
                size="small"
              />
            )}
          </Box>
        </Paper>
      </Slide>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} action={
          <Button color="inherit" size="small" onClick={refresh}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && notifications.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredNotifications.length === 0 ? (
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? 'No notifications match your search' : 'No notifications found'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Try adjusting your filters or check back later'}
            </Typography>
            {searchTerm && (
              <Button variant="outlined" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            )}
          </Box>
        </Fade>
      ) : (
        <Box>
          {/* Notification Cards */}
          {filteredNotifications.map((notification, index) => (
            <Slide in timeout={300 + index * 100} direction="up" key={notification.ID}>
              <Card
                sx={{
                  mb: 2,
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
                        {!notification.viewed && (
                          <Chip
                            label="NEW"
                            color="primary"
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
                        <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
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
            </Slide>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                disabled={loading}
                showFirstButton
                showLastButton
              />
            </Box>
          )}
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
