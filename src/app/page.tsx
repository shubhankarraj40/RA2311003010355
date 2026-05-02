'use client';

import { EnhancedLayout } from '../components/EnhancedLayout';
import { EnhancedNotificationList } from '../components/EnhancedNotificationList';

export default function Home() {
  return (
    <EnhancedLayout title="All Notifications" currentPage="all">
      <EnhancedNotificationList />
    </EnhancedLayout>
  );
}
