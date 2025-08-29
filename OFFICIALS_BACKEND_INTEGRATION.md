{
  "info": {
    "name": "Albany Ledger Mobile API Tests",
    "description": "Complete API collection for testing Albany Ledger mobile app endpoints including officials, articles, breaking news, and newsletter functionality.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/health",
          "host": ["{{base_url}}"],
          "path": ["health"]
        },
        "description": "Health check endpoint to verify server status"
      }
    },
    {
      "name": "Articles",
      "item": [
        {
          "name": "Get Published Articles",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/articles/published?limit=20&offset=0",
              "host": ["{{base_url}}"],
              "path": ["api", "articles", "published"],
              "query": [
                {"key": "limit", "value": "20", "description": "Number of articles to return"},
                {"key": "offset", "value": "0", "description": "Pagination offset"}
              ]
            },
            "description": "Get published articles with pagination"
          }
        },
        {
          "name": "Get Featured Articles",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/articles/featured?limit=5",
              "host": ["{{base_url}}"],
              "path": ["api", "articles", "featured"],
              "query": [
                {"key": "limit", "value": "5", "description": "Number of featured articles to return"}
              ]
            },
            "description": "Get featured articles"
          }
        },
        {
          "name": "Get Article by Slug",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/articles/slug/{{article_slug}}",
              "host": ["{{base_url}}"],
              "path": ["api", "articles", "slug", "{{article_slug}}"]
            },
            "description": "Get article by its slug"
          }
        }
      ]
    },
    {
      "name": "Breaking News",
      "item": [
        {
          "name": "Get Active Breaking News",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/breaking-news/active",
              "host": ["{{base_url}}"],
              "path": ["api", "breaking-news", "active"]
            },
            "description": "Get active breaking news alerts"
          }
        }
      ]
    },
    {
      "name": "Public Officials",
      "item": [
        {
          "name": "Get Public Officials",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/public/officials",
              "host": ["{{base_url}}"],
              "path": ["api", "public", "officials"]
            },
            "description": "Get all active public officials (no auth required)"
          }
        },
        {
          "name": "Get Public Official by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/public/officials/{{official_id}}",
              "host": ["{{base_url}}"],
              "path": ["api", "public", "officials", "{{official_id}}"]
            },
            "description": "Get specific public official by ID (no auth required)"
          }
        },
        {
          "name": "Get Public Committees",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/public/committees",
              "host": ["{{base_url}}"],
              "path": ["api", "public", "committees"]
            },
            "description": "Get all public committees (no auth required)"
          }
        }
      ]
    },
    {
      "name": "Authenticated Officials (Admin)",
      "item": [
        {
          "name": "Get All Officials",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{supabase_jwt}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/officials?search=&role=&status=&limit=20&offset=0",
              "host": ["{{base_url}}"],
              "path": ["api", "officials"],
              "query": [
                {"key": "search", "value": "", "description": "Search term for official name"},
                {"key": "role", "value": "", "description": "Filter by role"},
                {"key": "status", "value": "", "description": "Filter by status"},
                {"key": "limit", "value": "20", "description": "Number of officials to return"},
                {"key": "offset", "value": "0", "description": "Pagination offset"}
              ]
            },
            "description": "Get all officials with optional filtering (requires auth)"
          }
        },
        {
          "name": "Get Official by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{supabase_jwt}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/officials/{{official_id}}",
              "host": ["{{base_url}}"],
              "path": ["api", "officials", "{{official_id}}"]
            },
            "description": "Get specific official by ID (requires auth)"
          }
        },
        {
          "name": "Create Official",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{supabase_jwt}}",
                "type": "text"
              },
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test Official\",\n  \"roleTitle\": \"Test Role\",\n  \"termStart\": \"2024-01-01\",\n  \"termEnd\": \"2027-12-31\",\n  \"email\": \"test@albany.gov\",\n  \"phone\": \"(518) 555-0127\",\n  \"biography\": \"Test biography\",\n  \"district\": \"Test District\",\n  \"party\": \"Test Party\",\n  \"officeAddress\": \"Test Address\",\n  \"officeHours\": \"Mon-Fri 9AM-5PM\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/officials",
              "host": ["{{base_url}}"],
              "path": ["api", "officials"]
            },
            "description": "Create new official (requires auth)"
          }
        },
        {
          "name": "Update Official",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{supabase_jwt}}",
                "type": "text"
              },
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Updated Official Name\",\n  \"roleTitle\": \"Updated Role\",\n  \"email\": \"updated@albany.gov\",\n  \"phone\": \"(518) 555-0128\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/officials/{{official_id}}",
              "host": ["{{base_url}}"],
              "path": ["api", "officials", "{{official_id}}"]
            },
            "description": "Update existing official (requires auth)"
          }
        },
        {
          "name": "Delete Official",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{supabase_jwt}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/officials/{{official_id}}",
              "host": ["{{base_url}}"],
              "path": ["api", "officials", "{{official_id}}"]
            },
            "description": "Delete official (requires auth)"
          }
        }
      ]
    },
    {
      "name": "Committees (Admin)",
      "item": [
        {
          "name": "Get All Committees",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{supabase_jwt}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/committees",
              "host": ["{{base_url}}"],
              "path": ["api", "committees"]
            },
            "description": "Get all committees (requires auth)"
          }
        },
        {
          "name": "Get Committee by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{supabase_jwt}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/committees/{{committee_id}}",
              "host": ["{{base_url}}"],
              "path": ["api", "committees", "{{committee_id}}"]
            },
            "description": "Get specific committee by ID (requires auth)"
          }
        },
        {
          "name": "Create Committee",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{supabase_jwt}}",
                "type": "text"
              },
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test Committee\",\n  \"description\": \"Test committee description\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/committees",
              "host": ["{{base_url}}"],
              "path": ["api", "committees"]
            },
            "description": "Create new committee (requires auth)"
          }
        },
        {
          "name": "Update Committee",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{supabase_jwt}}",
                "type": "text"
              },
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Updated Committee Name\",\n  \"description\": \"Updated committee description\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/committees/{{committee_id}}",
              "host": ["{{base_url}}"],
              "path": ["api", "committees", "{{committee_id}}"]
            },
            "description": "Update existing committee (requires auth)"
          }
        },
        {
          "name": "Delete Committee",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{supabase_jwt}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/committees/{{committee_id}}",
              "host": ["{{base_url}}"],
              "path": ["api", "committees", "{{committee_id}}"]
            },
            "description": "Delete committee (requires auth)"
          }
        }
      ]
    },
    {
      "name": "Newsletter",
      "item": [
        {
          "name": "Subscribe to Newsletter",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"consent\": true,\n  \"name\": \"Test User\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/newsletter/subscribe",
              "host": ["{{base_url}}"],
              "path": ["newsletter", "subscribe"]
            },
            "description": "Subscribe to newsletter with email confirmation"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://albany-ledger-ac0ae29a7839.herokuapp.com",
      "description": "Server base URL"
    },
    {
      "key": "supabase_jwt",
      "value": "",
      "description": "JWT token from Supabase auth (for admin endpoints)"
    },
    {
      "key": "official_id",
      "value": "1",
      "description": "Official ID for testing"
    },
    {
      "key": "committee_id",
      "value": "1",
      "description": "Committee ID for testing"
    },
    {
      "key": "article_slug",
      "value": "test-article",
      "description": "Article slug for testing"
    }
  ]
}
