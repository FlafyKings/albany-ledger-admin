# Calendar API Schema Documentation - Updated

## Key Changes Summary

### ✅ **Event Type ID Integration**
- **Events now use `event_type_id`** instead of `event_type` string
- **Foreign key relationship** between events and event_types tables
- **Event type validation** ensures valid event type IDs when provided
- **Event type is now OPTIONAL** - events can be created without event_type_id

### ✅ **Enhanced Event Responses**
- **All event listings now include event type details** (name, display_name, color_hex) when available
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
  "event_type_id": "string (optional, valid event type ID)",
  "location": "string (optional, max 255 chars)"
}
```

#### Example Request (with event type)
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

#### Example Request (without event type)
```json
{
  "title": "General Meeting",
  "description": "Regular meeting without specific type",
  "start_date": "2024-04-15T14:00:00Z",
  "end_date": "2024-04-15T16:00:00Z",
  "all_day": false,
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

## ICS Export Functionality

### Export Calendar - ICS Implementation
**GET** `/api/calendar/export`

Export calendar data in ICS (iCalendar) format. **Fully implemented and ready for use.**

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `format` | string | No | Export format (`ics`, `csv`, `pdf`, default: `ics`) |
| `start_date` | string (ISO 8601) | No | Export from this date |
| `end_date` | string (ISO 8601) | No | Export until this date |
| `event_type_ids` | array | No | Filter by event type IDs (can specify multiple) |
| `calendar_name` | string | No | Custom calendar name for export (default: "Albany Ledger Calendar") |

#### Response for ICS Format
- **Content-Type**: `text/calendar; charset=utf-8`
- **Content-Disposition**: `attachment; filename="{calendar_name}.ics"`
- **Body**: Complete ICS file content ready for import into calendar applications

#### Example Requests

##### Export All Events as ICS
```bash
GET /api/calendar/export?format=ics
Authorization: Bearer <jwt_token>
```

##### Export Specific Date Range
```bash
GET /api/calendar/export?format=ics&start_date=2024-03-01&end_date=2024-03-31
Authorization: Bearer <jwt_token>
```

##### Export Specific Event Types
```bash
GET /api/calendar/export?format=ics&event_type_ids=commission-type&event_type_ids=county-type
Authorization: Bearer <jwt_token>
```

##### Custom Calendar Name
```bash
GET /api/calendar/export?format=ics&calendar_name=My%20Custom%20Calendar
Authorization: Bearer <jwt_token>
```

### Public ICS Export
**GET** `/api/public/calendar/export`

Public endpoint for calendar export (no authentication required). Same parameters as above.

#### Example Public Export
```bash
GET /api/public/calendar/export?format=ics&start_date=2024-03-01&end_date=2024-03-31
```

### ICS File Features

#### Generated ICS Files Include:
- ✅ **Standard iCalendar format** (RFC 5545 compliant)
- ✅ **Event details**: Title, description, location, dates
- ✅ **Event type information** in description
- ✅ **All-day event support** with proper DATE format
- ✅ **Timed events** with proper DATETIME format
- ✅ **Unique event IDs** for each event
- ✅ **Creation and modification timestamps**
- ✅ **Proper timezone handling** (UTC)
- ✅ **Line folding** for long text content
- ✅ **Special character escaping**

#### Calendar Application Compatibility:
- ✅ **Google Calendar** - Import via .ics file
- ✅ **Microsoft Outlook** - Import via .ics file
- ✅ **Apple Calendar** - Import via .ics file
- ✅ **Thunderbird** - Import via .ics file
- ✅ **Any RFC 5545 compliant calendar application**

## Migration Notes

- **Database**: Events table now uses `event_type_id` with foreign key to `event_types.id`
- **API**: All endpoints now expect/return `event_type_id` instead of `event_type` string
- **Validation**: Event type validation now checks against actual event type IDs
- **Responses**: All event responses include full event type details for UI rendering
- **ICS Export**: Fully implemented with proper iCalendar format and calendar app compatibility
