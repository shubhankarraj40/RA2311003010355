import { Notification } from '../types';

export const mockNotifications: Notification[] = [
  {
    ID: '1',
    Type: 'Placement',
    Message: 'Congratulations! You have been selected for the Software Engineer role at Google.',
    Timestamp: new Date().toISOString(),
    viewed: false,
  },
  {
    ID: '2',
    Type: 'Event',
    Message: 'Reminder: The Annual Tech Hackathon starts in exactly 24 hours in the main auditorium.',
    Timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    viewed: true,
  },
  {
    ID: '3',
    Type: 'Result',
    Message: 'Your End Semester Examination results have been published on the portal.',
    Timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    viewed: false,
  }
];

export const mockApiResponse = {};
