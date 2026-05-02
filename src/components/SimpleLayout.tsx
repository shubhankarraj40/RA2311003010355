'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  currentPage: string;
}

export function SimpleLayout({ children, title, currentPage }: LayoutProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
            🎓 {title}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
