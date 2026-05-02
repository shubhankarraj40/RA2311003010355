'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Button,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Inbox as InboxIcon,
  List as ListIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { useNotifications } from '../contexts/NotificationContextClean';

const drawerWidth = 240;

interface EnhancedLayoutProps {
  children: React.ReactNode;
  title: string;
  currentPage: string;
}

export function EnhancedLayout({ children, title, currentPage }: EnhancedLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { getUnviewedCount, refresh } = useNotifications();

  const unviewedCount = getUnviewedCount();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRefresh = async () => {
    await refresh();
  };

  const menuItems = [
    {
      text: 'Priority Inbox',
      icon: <InboxIcon />,
      href: '/priority',
      active: pathname === '/priority',
      description: 'Top priority notifications',
    },
    {
      text: 'All Notifications',
      icon: <ListIcon />,
      href: '/',
      active: pathname === '/',
      description: 'View all notifications',
    },
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" noWrap component="div">
          🎓 Campus Hub
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            onClick={() => router.push(item.href)}
            selected={item.active}
            sx={{
              mx: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              secondary={item.description}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
                color: item.active ? 'rgba(255,255,255,0.8)' : 'text.secondary'
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Quick Stats
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            📬 {unviewedCount} unviewed
          </Typography>
          <Typography variant="caption" color="text.secondary">
            🔄 Last updated: Just now
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'primary.main',
          boxShadow: 2,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handleRefresh}
              startIcon={<RefreshIcon />}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': { borderColor: 'white' }
              }}
            >
              Refresh
            </Button>

            <Badge badgeContent={unviewedCount} color="error">
              <IconButton color="inherit">
                <NotificationsIcon />
              </IconButton>
            </Badge>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
