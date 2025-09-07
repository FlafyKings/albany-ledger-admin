# Calendar API Schema Documentation

## Overview
This document provides comprehensive API schema documentation for the Calendar system endpoints. All endpoints follow RESTful conventions and return JSON responses.

## Base URL
```
/api
```

## Authentication
- **Admin Endpoints**: Require JWT token in `Authorization: Bearer <token>` header
- **Public Endpoints**: No authentication required
- **User Context**: Authenticated endpoints automatically track `created_by` and `updated_by` fields

---

## Events API

### List Events
**GET** `/api/events`

Retrieve events with optional filtering and pagination.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start_date` | string (ISO 8601) | No | Filter events from this date |
| `end_date` | string (ISO 8601) | No | Filter events until this date |
| `event_type` | string | No | Filter by event type (`commission`, `county`, `school-board`, `election`) |
| `limit` | integer | No | Number of events per page (default: 50) |
| `offset` | integer | No | Number of events to skip (default: 0) |

#### Response Schema
```json
{
  "events": [
    {
      "id": "string",
      "title": "string",
      "description": "string | null",
      "start_date": "string (ISO 8601)",
      "end_date": "string (ISO 8601) | null",
      "all_day": "boolean",
      "event_type": "string",
      "location": "string | null",
      "created_at": "string (ISO 8601)",
      "updated_at": "string (ISO 8601)",
      "created_by": "string | null",
      "updated_by": "string | null"
    }
  ],
  "total": "integer",
  "limit": "integer",
  "offset": "integer"
}
```

#### Example Request
```bash
GET /api/events?start_date=2024-03-01&end_date=2024-03-31&event_type=commission&limit=10
Authorization: Bearer <jwt_token>
```

#### Example Response
```json
{
  "events": [
    {
      "id": "event-1",
      "title": "City Council Meeting",
      "description": "Monthly city council meeting to discuss budget and city planning",
      "start_date": "2024-03-15T19:00:00Z",
      "end_date": "2024-03-15T21:00:00Z",
      "all_day": false,
      "event_type": "commission",
      "location": "City Hall, Council Chambers",
      "created_at": "2024-03-01T10:00:00Z",
      "updated_at": "2024-03-01T10:00:00Z",
      "created_by": "user-123",
      "updated_by": "user-123"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

---

### Get Event
**GET** `/api/events/{event_id}`

Retrieve a specific event by ID.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_id` | string | Yes | Unique event identifier |

#### Response Schema
```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "start_date": "string (ISO 8601)",
  "end_date": "string (ISO 8601) | null",
  "all_day": "boolean",
  "event_type": "string",
  "location": "string | null",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)",
  "created_by": "string | null",
  "updated_by": "string | null"
}
```

#### Error Responses
- `404 Not Found`: Event not found
- `401 Unauthorized`: Invalid or missing JWT token

---

### Create Event
**POST** `/api/events`

Create a new event.

#### Request Schema
```json
{
  "title": "string (required, max 255 chars)",
  "description": "string (optional)",
  "start_date": "string (required, ISO 8601)",
  "end_date": "string (optional, ISO 8601)",
  "all_day": "boolean (optional, default: false)",
  "event_type": "string (required, one of: commission, county, school-board, election)",
  "location": "string (optional, max 255 chars)"
}
```

#### Response Schema
```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "start_date": "string (ISO 8601)",
  "end_date": "string (ISO 8601) | null",
  "all_day": "boolean",
  "event_type": "string",
  "location": "string | null",
  "created_at": "string (ISO 8601)",
  "updated_at": "string (ISO 8601)",
  "created_by": "string",
  "updated_by": "string"
}
```

#### Example Request
```json
{
  "title": "Budget Committee Meeting",
  "description": "Monthly budget review and planning session",
  "start_date": "2024-04-15T14:00:00Z",
  "end_date": "2024-04-15T16:00:00Z",
  "all_day": false,
  "event_type": "commission",
  "location": "City Hall, Conference Room A"
}
```

#### Error Responses
- `400 Bad Request`: Missing required fields or validation errors
- `401 Unauthorized`: Invalid or missing JWT token

#### Validation Rules
- `title`: Required, 1-255 characters
- `start_date`: Required, valid ISO 8601 timestamp
- `end_date`: Optional, must be after start_date if provided
- `event_type`: Required, must be one of: `commission`, `county`, `school-board`, `election`
- `all_day`: Boolean, defaults to false
- `location`: Optional, max 255 characters
- `description`: Optional, no length limit

---

### Update Event
**PUT** `/api/events/{event_id}`

Update an existing event.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_id` | string | Yes | Unique event identifier |

#### Request Schema
```json
{
  "title": "string (optional, max 255 chars)",
  "description": "string (optional)",
  "start_date": "string (optional, ISO 8601)",
  "end_date": "string (optional, ISO 8601)",
  "all_day": "boolean (optional)",
  "event_type": "string (optional, one of: commission, county, school-board, election)",
  "location": "string (optional, max 255 chars)"
}
```

#### Response Schema
Same as Create Event response.

#### Error Responses
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Event not found

---

### Delete Event
**DELETE** `/api/events/{event_id}`

Delete an event.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_id` | string | Yes | Unique event identifier |

#### Response Schema
```json
{
  "message": "Event deleted successfully"
}
```

#### Error Responses
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Event not found

---

## Calendar-Specific Endpoints

### Get Calendar Events
**GET** `/api/calendar/events`

Retrieve events optimized for calendar display.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `month` | integer | Yes | Month (1-12) |
| `year` | integer | Yes | Year |
| `view` | string | No | Calendar view type (`month` or `week`, default: `month`) |

#### Response Schema
```json
{
  "events": [
    {
      "id": "string",
      "title": "string",
      "start_date": "string (ISO 8601)",
      "end_date": "string (ISO 8601) | null",
      "all_day": "boolean",
      "event_type": "string"
    }
  ]
}
```

#### Example Request
```bash
GET /api/calendar/events?month=3&year=2024&view=month
Authorization: Bearer <jwt_token>
```

#### Error Responses
- `400 Bad Request`: Invalid month/year parameters
- `401 Unauthorized`: Invalid or missing JWT token

---

### Export Calendar
**GET** `/api/calendar/export`

Export calendar data in various formats (placeholder implementation).

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `format` | string | No | Export format (`ics`, `csv`, `pdf`, default: `ics`) |
| `start_date` | string (ISO 8601) | No | Export from this date |
| `end_date` | string (ISO 8601) | No | Export until this date |
| `event_types` | array | No | Filter by event types |

#### Response Schema
```json
{
  "message": "Export functionality for {format} format will be implemented",
  "format": "string",
  "start_date": "string | null",
  "end_date": "string | null",
  "event_types": "array"
}
```

---

## Event Types API

### List Event Types
**GET** `/api/event-types`

Retrieve all available event types.

#### Response Schema
```json
[
  {
    "id": "string",
    "name": "string",
    "display_name": "string",
    "color_hex": "string",
    "created_at": "string (ISO 8601)"
  }
]
```

#### Example Response
```json
[
  {
    "id": "commission-type",
    "name": "commission",
    "display_name": "Commission Meetings",
    "color_hex": "#3B82F6",
    "created_at": "2024-03-01T10:00:00Z"
  },
  {
    "id": "county-type",
    "name": "county",
    "display_name": "County Events",
    "color_hex": "#10B981",
    "created_at": "2024-03-01T10:00:00Z"
  }
]
```

---

### Get Event Type
**GET** `/api/event-types/{type_id}`

Retrieve a specific event type.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type_id` | string | Yes | Unique event type identifier |

#### Response Schema
```json
{
  "id": "string",
  "name": "string",
  "display_name": "string",
  "color_hex": "string",
  "created_at": "string (ISO 8601)"
}
```

---

### Create Event Type
**POST** `/api/event-types`

Create a new event type.

#### Request Schema
```json
{
  "name": "string (required, unique, max 50 chars)",
  "display_name": "string (required, max 100 chars)",
  "color_hex": "string (required, valid hex color like #FF0000)"
}
```

#### Response Schema
Same as Get Event Type response.

#### Validation Rules
- `name`: Required, unique, max 50 characters
- `display_name`: Required, max 100 characters
- `color_hex`: Required, valid hex color format (#RRGGBB)

---

### Update Event Type
**PUT** `/api/event-types/{type_id}`

Update an existing event type.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type_id` | string | Yes | Unique event type identifier |

#### Request Schema
```json
{
  "name": "string (optional, max 50 chars)",
  "display_name": "string (optional, max 100 chars)",
  "color_hex": "string (optional, valid hex color)"
}
```

---

### Delete Event Type
**DELETE** `/api/event-types/{type_id}`

Delete an event type.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type_id` | string | Yes | Unique event type identifier |

#### Response Schema
```json
{
  "message": "Event type deleted successfully"
}
```

---

## Public Endpoints

### Public Events
**GET** `/api/public/events`

Public endpoint for events (no authentication required).

#### Query Parameters
Same as List Events endpoint.

#### Response Schema
Same as List Events response.

---

### Public Calendar Events
**GET** `/api/public/calendar/events`

Public endpoint for calendar events (no authentication required).

#### Query Parameters
Same as Get Calendar Events endpoint.

#### Response Schema
Same as Get Calendar Events response.

---

### Public Event Types
**GET** `/api/public/event-types`

Public endpoint for event types (no authentication required).

#### Response Schema
Same as List Event Types response.

---

## Statistics API

### Calendar Statistics
**GET** `/api/calendar/stats`

Get calendar statistics and analytics.

#### Response Schema
```json
{
  "total_events": "integer",
  "events_by_type": {
    "commission": "integer",
    "county": "integer",
    "school-board": "integer",
    "election": "integer"
  },
  "upcoming_events": "integer",
  "events_this_month": "integer"
}
```

#### Example Response
```json
{
  "total_events": 25,
  "events_by_type": {
    "commission": 10,
    "county": 8,
    "school-board": 4,
    "election": 3
  },
  "upcoming_events": 5,
  "events_this_month": 12
}
```

---

## Event Attendees API (Future Enhancement)

### List Event Attendees
**GET** `/api/events/{event_id}/attendees`

List attendees for a specific event.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_id` | string | Yes | Unique event identifier |

#### Response Schema
```json
[
  {
    "id": "string",
    "event_id": "string",
    "user_id": "string",
    "status": "string (pending, accepted, declined)",
    "created_at": "string (ISO 8601)"
  }
]
```

---

### Add Event Attendee
**POST** `/api/events/{event_id}/attendees`

Add attendee to event.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_id` | string | Yes | Unique event identifier |

#### Request Schema
```json
{
  "user_id": "string (required)",
  "status": "string (optional, default: pending, one of: pending, accepted, declined)"
}
```

---

### Update Attendee Status
**PUT** `/api/attendees/{attendee_id}/status`

Update attendee status.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `attendee_id` | string | Yes | Unique attendee identifier |

#### Request Schema
```json
{
  "status": "string (required, one of: pending, accepted, declined)"
}
```

---

### Remove Event Attendee
**DELETE** `/api/attendees/{attendee_id}`

Remove attendee from event.

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `attendee_id` | string | Yes | Unique attendee identifier |

#### Response Schema
```json
{
  "message": "Attendee removed successfully"
}
```

---

## Error Response Schema

All endpoints return consistent error responses:

```json
{
  "error": "string (error message)"
}
```

### Common HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data or validation errors
- `401 Unauthorized`: Authentication required or invalid token
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Example Error Responses

#### Validation Error
```json
{
  "error": "Missing required field: title"
}
```

#### Not Found Error
```json
{
  "error": "Event not found"
}
```

#### Authentication Error
```json
{
  "error": "No valid authorization header"
}
```

---

## Data Types

### Event Types
- `commission`: Commission meetings
- `county`: County events
- `school-board`: School board meetings
- `election`: Election events

### Attendee Status
- `pending`: Invitation sent, no response
- `accepted`: User confirmed attendance
- `declined`: User declined invitation

### Date Formats
All dates are in ISO 8601 format with timezone information:
- `2024-03-15T19:00:00Z` (UTC)
- `2024-03-15T19:00:00+00:00` (UTC with explicit timezone)

---

## Rate Limiting
All endpoints are subject to rate limiting. Contact the API administrator for rate limit information.

## Versioning
Current API version: v1

## Support
For API support and questions, contact the development team.
