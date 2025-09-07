# Calendar API Schema Documentation - Updated

## Key Changes Summary

### ✅ **Event Type ID Integration**
- **Events now use `event_type_id`** instead of `event_type` string
- **Foreign key relationship** between events and event_types tables
- **Event type validation** ensures valid event type IDs

### ✅ **Enhanced Event Responses**
- **All event listings now include event type details** (name, display_name, color_hex)
- **Calendar views include event type information** for UI rendering
- **Statistics use event type names** from the relationship

## Updated API Endpoints

### List Events - Enhanced Response
**GET** `/api/events`

#### New Response Schema
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
      "event_type_id": "string",
      "location": "string | null",
      "created_at": "string (ISO 8601)",
      "updated_at": "string (ISO 8601)",
      "created_by": "string | null",
      "updated_by": "string | null",
      "event_types": {
        "id": "string",
        "name": "string",
        "display_name": "string",
        "color_hex": "string",
        "created_at": "string (ISO 8601)"
      }
    }
  ],
  "total": "integer",
  "limit": "integer",
  "offset": "integer"
}
```

#### Updated Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `event_type_id` | string | No | Filter by event type ID (replaces event_type) |

### Create Event - Updated Request
**POST** `/api/events`

#### New Request Schema
```json
{
  "title": "string (required, max 255 chars)",
  "description": "string (optional)",
  "start_date": "string (required, ISO 8601)",
  "end_date": "string (optional, ISO 8601)",
  "all_day": "boolean (optional, default: false)",
  "event_type_id": "string (required, valid event type ID)",
  "location": "string (optional, max 255 chars)"
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
  "event_type_id": "commission-type",
  "location": "City Hall, Conference Room A"
}
```

### Update Event - Updated Request
**PUT** `/api/events/{event_id}`

#### New Request Schema
```json
{
  "title": "string (optional, max 255 chars)",
  "description": "string (optional)",
  "start_date": "string (optional, ISO 8601)",
  "end_date": "string (optional, ISO 8601)",
  "all_day": "boolean (optional)",
  "event_type_id": "string (optional, valid event type ID)",
  "location": "string (optional, max 255 chars)"
}
```

### Calendar Events - Enhanced Response
**GET** `/api/calendar/events`

#### New Response Schema
```json
{
  "events": [
    {
      "id": "string",
      "title": "string",
      "start_date": "string (ISO 8601)",
      "end_date": "string (ISO 8601) | null",
      "all_day": "boolean",
      "event_type_id": "string",
      "event_types": {
        "id": "string",
        "name": "string",
        "display_name": "string",
        "color_hex": "string"
      }
    }
  ]
}
```

## Event Type IDs Reference

### Available Event Types
| ID | Name | Display Name | Color |
|----|------|--------------|-------|
| `commission-type` | commission | Commission Meetings | #3B82F6 |
| `county-type` | county | County Events | #10B981 |
| `school-board-type` | school-board | School Board Meetings | #F59E0B |
| `election-type` | election | Election Events | #EF4444 |

## Example Usage

### Get Events with Event Type Details
```bash
GET /api/events?event_type_id=commission-type&limit=5
Authorization: Bearer <jwt_token>
```

### Create Event with Event Type ID
```bash
POST /api/events
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "City Council Meeting",
  "start_date": "2024-04-15T19:00:00Z",
  "end_date": "2024-04-15T21:00:00Z",
  "event_type_id": "commission-type",
  "location": "City Hall"
}
```

### Update Event Type
```bash
PUT /api/events/event-1
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "event_type_id": "county-type"
}
```

## Benefits of the Changes

1. **Better Data Integrity**: Foreign key relationships ensure valid event types
2. **Enhanced Frontend Support**: Event type details (colors, display names) included in responses
3. **Improved Performance**: Single query returns all needed data
4. **Consistent API Design**: All endpoints use event_type_id consistently
5. **Future-Proof**: Easy to add new event type properties without API changes

## Migration Notes

- **Database**: Events table now uses `event_type_id` with foreign key to `event_types.id`
- **API**: All endpoints now expect/return `event_type_id` instead of `event_type` string
- **Validation**: Event type validation now checks against actual event type IDs
- **Responses**: All event responses include full event type details for UI rendering
