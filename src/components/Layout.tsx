'use client';

import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Badge, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { usePathname } from 'next/navigation';

export function Layout({ children, title, currentPage }: { children: React.ReactNode, title: string, currentPage: string }) {
  const pathname = usePathname();

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
            Afford Medical
          </Typography>
          <Button 
            color="inherit" 
            component={Link} 
            href="/"
            sx={{ fontWeight: pathname === '/' ? 'bold' : 'normal', color: pathname === '/' ? 'primary.main' : 'text.primary' }}
          >
            All Notifications
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            href="/priority"
            sx={{ fontWeight: pathname === '/priority' ? 'bold' : 'normal', color: pathname === '/priority' ? 'primary.main' : 'text.primary', ml: 2 }}
          >
            Priority Inbox
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          {children}
        </Box>
      </Container>
    </>
  );
}
