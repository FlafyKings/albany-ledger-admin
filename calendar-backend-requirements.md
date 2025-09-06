# Calendar System - Backend & Database Requirements

## Overview
This document outlines the backend and database requirements for implementing a calendar system that supports event management, filtering, and export functionality.

## Database Schema Requirements

### 1. Events Table
```sql
CREATE TABLE events (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  all_day BOOLEAN DEFAULT false,
  event_type VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);
```

**Event Types:**
- `commission` - Commission meetings
- `county` - County events
- `school-board` - School board meetings
- `election` - Election events

### 2. Event Attendees (Optional - for future expansion)
```sql
CREATE TABLE event_attendees (
  id VARCHAR(255) PRIMARY KEY,
  event_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

**Attendee Status:**
- `pending` - Invitation sent, no response
- `accepted` - User confirmed attendance
- `declined` - User declined invitation

### 3. Event Types Configuration (Optional - for dynamic management)
```sql
CREATE TABLE event_types (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  color_hex VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints Requirements

### 1. Events CRUD Operations

#### GET /api/events
**Purpose:** Retrieve events with filtering and pagination
**Query Parameters:**
- `start_date` (ISO 8601) - Filter events from this date
- `end_date` (ISO 8601) - Filter events until this date
- `event_type` (string) - Filter by specific event type
- `limit` (integer) - Number of events per page (default: 50)
- `offset` (integer) - Number of events to skip (default: 0)

**Response:**
```json
{
  "events": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "start_date": "ISO 8601 timestamp",
      "end_date": "ISO 8601 timestamp",
      "all_day": "boolean",
      "event_type": "string",
      "location": "string",
      "created_at": "ISO 8601 timestamp",
      "updated_at": "ISO 8601 timestamp"
    }
  ],
  "total": "integer",
  "limit": "integer",
  "offset": "integer"
}
```

#### GET /api/events/{id}
**Purpose:** Retrieve a specific event
**Response:** Single event object (same structure as above)

#### POST /api/events
**Purpose:** Create a new event
**Authentication:** Required (Admin only)
**Request Body:**
```json
{
  "title": "string (required, max 255 chars)",
  "description": "string (optional)",
  "start_date": "ISO 8601 timestamp (required)",
  "end_date": "ISO 8601 timestamp (optional)",
  "all_day": "boolean (default: false)",
  "event_type": "string (required, must be valid type)",
  "location": "string (optional, max 255 chars)"
}
```

#### PUT /api/events/{id}
**Purpose:** Update an existing event
**Authentication:** Required (Admin only)
**Request Body:** Same as POST (all fields optional for updates)

#### DELETE /api/events/{id}
**Purpose:** Delete an event
**Authentication:** Required (Admin only)

### 2. Calendar-Specific Endpoints

#### GET /api/calendar/events
**Purpose:** Retrieve events optimized for calendar display
**Query Parameters:**
- `month` (integer) - Month (1-12)
- `year` (integer) - Year
- `view` (string) - Calendar view type (`month` or `week`)

**Response:**
```json
{
  "events": [
    {
      "id": "string",
      "title": "string",
      "start_date": "ISO 8601 timestamp",
      "end_date": "ISO 8601 timestamp",
      "all_day": "boolean",
      "event_type": "string"
    }
  ]
}
```

#### GET /api/calendar/export
**Purpose:** Export calendar data in various formats
**Query Parameters:**
- `format` (string) - Export format (`ics`, `csv`, `pdf`)
- `start_date` (ISO 8601) - Export from this date
- `end_date` (ISO 8601) - Export until this date
- `event_types` (array) - Filter by event types

**Response:** File download with appropriate MIME type

### 3. Event Types Management

#### GET /api/event-types
**Purpose:** Retrieve available event types
**Response:**
```json
[
  {
    "name": "string",
    "display_name": "string",
    "color_hex": "string"
  }
]
```

#### POST /api/event-types
**Purpose:** Create new event type (Admin only)
**Request Body:**
```json
{
  "name": "string (required, unique)",
  "display_name": "string (required)",
  "color_hex": "string (required, valid hex color)"
}
```

## Data Validation Requirements

### 1. Event Validation Rules
- **title**: Required, 1-255 characters
- **start_date**: Required, valid ISO 8601 timestamp
- **end_date**: Optional, must be after start_date if provided
- **event_type**: Required, must be from predefined list
- **all_day**: Boolean, defaults to false
- **location**: Optional, max 255 characters
- **description**: Optional, no length limit

### 2. Business Logic Rules
- End date must be after start date
- All-day events should have end_date set to end of start_date day
- Event types must be from predefined list
- Only authenticated admin users can create/edit/delete events
- All users can view events

## Performance Requirements

### 1. Database Indexes
Create indexes on frequently queried columns:
- `start_date` - For date range queries
- `event_type` - For filtering by type
- `start_date, event_type` - Composite index for calendar queries
- `created_by` - For user-specific queries

### 2. Caching Strategy
- Cache event types (rarely change, 1 hour TTL)
- Cache monthly calendar data (5 minute TTL)
- Cache user permissions (15 minute TTL)

## Security Requirements

### 1. Authentication & Authorization
- All endpoints require valid authentication token
- Admin-only endpoints must verify admin role
- Implement rate limiting on all endpoints
- Validate and sanitize all input data

### 2. Data Protection
- Implement proper access controls
- Log all administrative actions
- Validate file uploads for export functionality
- Prevent SQL injection and XSS attacks

## Integration Requirements

### 1. Calendar Export Formats

#### ICS (iCalendar) Format
- Generate standard ICS files for external calendar applications
- Include all event details (title, description, location, times)
- Support for recurring events (future enhancement)

#### CSV Format
- Export events as comma-separated values
- Include all event fields
- Properly escape special characters

#### PDF Format
- Generate printable calendar views
- Support monthly and weekly layouts
- Include event details and color coding

### 2. Notification System (Future Enhancement)
- Email notifications for new events
- Reminder system for upcoming events
- Integration with existing notification infrastructure

### 3. External Calendar Integration (Future Enhancement)
- Google Calendar sync
- Outlook Calendar sync
- Two-way synchronization capabilities

## Error Handling

### 1. Standard Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

### 2. Common Error Codes
- `VALIDATION_ERROR` - Invalid input data
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `RATE_LIMITED` - Too many requests
- `SERVER_ERROR` - Internal server error

## Monitoring & Analytics

### 1. Performance Metrics
- API response times
- Database query performance
- Calendar load times
- Export generation times

### 2. Usage Analytics
- Most viewed event types
- Popular time slots
- User engagement metrics
- Export format preferences

## Scalability Considerations

### 1. Database Optimization
- Implement proper indexing strategy
- Consider partitioning for large datasets
- Use connection pooling
- Implement read replicas for heavy read workloads

### 2. API Optimization
- Implement pagination for large result sets
- Use compression for API responses
- Implement proper HTTP caching headers
- Consider GraphQL for complex queries (future)

### 3. File Storage
- Use cloud storage for exported files
- Implement file cleanup policies
- Consider CDN for static assets

## Testing Requirements

### 1. Unit Tests
- Test all validation logic
- Test business rule enforcement
- Test error handling scenarios

### 2. Integration Tests
- Test API endpoints with various inputs
- Test database operations
- Test export functionality

### 3. Performance Tests
- Load testing for calendar queries
- Stress testing for concurrent users
- Export generation performance testing
