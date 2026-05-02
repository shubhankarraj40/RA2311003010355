# Campus Notifications Frontend - Stage 2

A responsive React/Next.js application for managing campus notifications with priority inbox functionality.

## Features

### Priority Inbox
- **Top-N Notifications**: Displays the most important notifications based on type and recency
- **Configurable Limit**: Users can choose to show top 5, 10, 15, 20, or 25 notifications
- **Priority Scoring**: Placement (3) > Result (2) > Event (1) with recency decay
- **Visual Indicators**: Clear priority badges and highest priority highlighting

### All Notifications
- **Complete List**: View all campus notifications
- **Advanced Filtering**: Filter by notification type (Event, Result, Placement)
- **Pagination**: Navigate through large numbers of notifications
- **Limit Control**: Choose how many notifications to display per page

### User Experience
- **Material UI**: Modern, responsive interface using Material Design
- **View Status Tracking**: Distinguish between new and viewed notifications
- **Real-time Updates**: Refresh functionality for latest notifications
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Dark/Light Theme**: Clean, professional design

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Next.js 14**: Modern React framework with App Router
- **API Integration**: Seamless integration with evaluation service API
- **Error Handling**: Robust error handling and loading states
- **Performance**: Optimized rendering and state management

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```
   NEXT_PUBLIC_API_URL=http://20.207.122.201/evaluation-service
   NEXT_PUBLIC_ACCESS_CODE=QkbpxH
   ```

3. **Run the application**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Application Structure

### Pages
- **Home Page** (`/`): All notifications with filtering and pagination
- **Priority Inbox** (`/priority`): Top-N most important notifications

### Components
- **Layout**: Navigation, header, and responsive sidebar
- **NotificationCard**: Individual notification display with view status
- **NotificationList**: Complete notification list with filters
- **PriorityInbox**: Priority notification display with scoring

### Services & Context
- **API Service**: Authentication and data fetching
- **Notification Context**: Global state management
- **Type Definitions**: Full TypeScript type safety

## API Integration

### Authentication
- Automatic user registration and authentication
- JWT token management
- Secure API communication

### Notification Endpoints
- **GET /notifications**: Fetch all notifications with query parameters
  - `limit`: Number of notifications per page
  - `page`: Page number for pagination
  - `notification_type`: Filter by type (Event, Result, Placement)

### Priority Algorithm
```typescript
priority_score = type_weight * recency_factor
```

- **Type Weights**: Placement (3) > Result (2) > Event (1)
- **Recency Factor**: Exponential decay over time
- **Real-time Scoring**: Calculated on-the-fly for accurate priorities

## User Interface

### Desktop View
- **Sidebar Navigation**: Easy access to priority inbox and all notifications
- **Wide Layout**: Optimized for larger screens
- **Rich Interactions**: Hover effects, transitions, and micro-animations

### Mobile View
- **Responsive Design**: Adapts to mobile screens
- **Touch-friendly**: Optimized for touch interactions
- **Collapsible Navigation**: Hamburger menu for mobile devices

### Key Features
- **Visual Priority Indicators**: Color-coded notification types
- **View Status**: Clear distinction between new and viewed notifications
- **Priority Badges**: Visual indicators for priority notifications
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages

## Priority Inbox Details

### Scoring System
- **Placement Notifications**: Highest priority (weight 3)
- **Result Notifications**: Medium priority (weight 2)
- **Event Notifications**: Lowest priority (weight 1)
- **Recency Factor**: More recent notifications get higher scores

### Visual Features
- **Priority Badges**: Clear "PRIORITY" indicators
- **Score Display**: Shows priority scores for transparency
- **Highest Priority**: Special highlighting for top notification
- **Type Distribution**: Visual breakdown of notification types

### User Controls
- **Top-N Selection**: Choose 5, 10, 15, 20, or 25 notifications
- **Refresh**: Manual refresh for latest updates
- **Mark All Read**: Bulk action for viewed notifications

## Technical Implementation

### State Management
- **React Context**: Global notification state
- **useReducer**: Complex state management with actions
- **Local Storage**: Persistent view status tracking

### Performance Optimizations
- **Memoization**: Optimized re-renders
- **Lazy Loading**: Efficient data fetching
- **Debounced Updates**: Smooth user interactions

### Error Handling
- **API Errors**: Graceful error handling with retry logic
- **Network Issues**: Offline detection and recovery
- **User Feedback**: Clear error messages and loading states

## Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Quality
- **TypeScript**: Full type coverage
- **ESLint**: Code quality and consistency
- **Material UI**: Consistent design system
- **Responsive Design**: Mobile-first approach

## Production Considerations

### Performance
- **Bundle Optimization**: Optimized for production
- **Caching**: API response caching
- **Lazy Loading**: Component and route code splitting

### Security
- **API Security**: Secure token management
- **Environment Variables**: Sensitive data protection
- **CORS Configuration**: Proper cross-origin setup

### Accessibility
- **WCAG Compliance**: Accessibility features
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Compatible with screen readers

## Browser Support

- **Chrome**: Latest version
- **Firefox**: Latest version
- **Safari**: Latest version
- **Edge**: Latest version
- **Mobile**: iOS Safari, Chrome Mobile

## Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration
- **Push Notifications**: Browser notifications
- **Advanced Filtering**: Date range, keyword search
- **User Preferences**: Custom notification settings

### Technical Improvements
- **PWA Support**: Progressive Web App features
- **Offline Support**: Service worker implementation
- **Performance Monitoring**: Analytics and performance tracking
- **A/B Testing**: Feature experimentation framework

## Support

For issues and questions:
1. Check the console for error messages
2. Verify API connectivity
3. Ensure environment variables are correctly set
4. Review browser compatibility

---

**Technology Stack**: Next.js 14, React 18, TypeScript, Material UI, Axios  
**Target URL**: http://localhost:3000  
**API Integration**: Evaluation Service with real-time data

Screenshot
<img width="1918" height="908" alt="Screenshot 2026-05-02 121828" src="https://github.com/user-attachments/assets/971dbf49-f141-4379-a700-0b7856a97b2c" />
<img width="1919" height="899" alt="image" src="https://github.com/user-attachments/assets/3e71545f-ba3c-4e55-a3d9-9a89e5c956cf" />


