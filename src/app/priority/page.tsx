'use client';

import { EnhancedLayout } from '../../components/EnhancedLayout';
import { EnhancedPriorityInbox } from '../../components/EnhancedPriorityInbox';

export default function PriorityNotificationsPage() {
  return (
    <EnhancedLayout title="Priority Inbox" currentPage="priority">
      <EnhancedPriorityInbox />
    </EnhancedLayout>
  );
}
