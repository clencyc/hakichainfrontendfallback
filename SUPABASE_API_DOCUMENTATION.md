# HakiChain Supabase API Documentation

## Overview

HakiChain uses Supabase as its primary backend, which automatically generates REST API endpoints based on the database schema. This document covers all available Supabase endpoints and how to interact with them.

## Base URL and Authentication

**Base URL**: `{VITE_SUPABASE_URL}/rest/v1/`

**Authentication**: All requests require authentication headers:
```http
Authorization: Bearer {VITE_SUPABASE_ANON_KEY}
apikey: {VITE_SUPABASE_ANON_KEY}
Content-Type: application/json
```

For authenticated user requests:
```http
Authorization: Bearer {user_jwt_token}
apikey: {VITE_SUPABASE_ANON_KEY}
Content-Type: application/json
```

## Database Schema

Based on the Supabase migrations, here are the main tables and their endpoints:

### 1. Users Table
Stores user information for lawyers, NGOs, and donors.

**Schema**:
```sql
users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('lawyer', 'ngo', 'donor')),
  avatar_url text,
  bio text,
  location text,
  lsk_number text,
  organization text,
  specializations text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

**Endpoints**:

#### Get All Users
```http
GET {VITE_SUPABASE_URL}/rest/v1/users
```

#### Get User by ID
```http
GET {VITE_SUPABASE_URL}/rest/v1/users?id=eq.{user_id}
```

#### Get Users by Role
```http
GET {VITE_SUPABASE_URL}/rest/v1/users?role=eq.lawyer
GET {VITE_SUPABASE_URL}/rest/v1/users?role=eq.ngo
GET {VITE_SUPABASE_URL}/rest/v1/users?role=eq.donor
```

#### Get Lawyers by Specialization
```http
GET {VITE_SUPABASE_URL}/rest/v1/users?role=eq.lawyer&specializations=cs.{["civil_rights"]}
```

#### Create User
```http
POST {VITE_SUPABASE_URL}/rest/v1/users
Content-Type: application/json

{
  "email": "lawyer@example.com",
  "name": "John Doe",
  "role": "lawyer",
  "bio": "Experienced civil rights lawyer",
  "location": "Nairobi, Kenya",
  "lsk_number": "LSK123456",
  "specializations": ["civil_rights", "human_rights"]
}
```

#### Update User
```http
PATCH {VITE_SUPABASE_URL}/rest/v1/users?id=eq.{user_id}
Content-Type: application/json

{
  "bio": "Updated bio",
  "location": "Updated location"
}
```

### 2. Bounties Table
Stores legal bounty information.

**Schema**:
```sql
bounties (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  ngo_id uuid REFERENCES users(id) NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount > 0),
  raised_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'completed', 'cancelled')),
  category text NOT NULL,
  location text NOT NULL,
  due_date timestamptz NOT NULL,
  tags text[],
  impact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

**Endpoints**:

#### Get All Bounties
```http
GET {VITE_SUPABASE_URL}/rest/v1/bounties?select=*,ngo:users(name,organization)
```

#### Get Bounty by ID
```http
GET {VITE_SUPABASE_URL}/rest/v1/bounties?id=eq.{bounty_id}&select=*,ngo:users(name,organization),milestones(*)
```

#### Get Bounties by Category
```http
GET {VITE_SUPABASE_URL}/rest/v1/bounties?category=eq.civil_rights
```

#### Get Bounties by Status
```http
GET {VITE_SUPABASE_URL}/rest/v1/bounties?status=eq.open
```

#### Get Bounties by NGO
```http
GET {VITE_SUPABASE_URL}/rest/v1/bounties?ngo_id=eq.{ngo_user_id}
```

#### Create Bounty (NGO only)
```http
POST {VITE_SUPABASE_URL}/rest/v1/bounties
Content-Type: application/json

{
  "title": "Legal Aid for Housing Rights",
  "description": "Help families facing illegal eviction",
  "ngo_id": "{ngo_user_id}",
  "total_amount": 5000,
  "category": "housing_rights",
  "location": "Nairobi, Kenya",
  "due_date": "2025-12-31T23:59:59Z",
  "tags": ["housing", "eviction", "family"],
  "impact": "Help 50 families retain their homes"
}
```

#### Update Bounty
```http
PATCH {VITE_SUPABASE_URL}/rest/v1/bounties?id=eq.{bounty_id}
Content-Type: application/json

{
  "status": "in-progress",
  "description": "Updated description"
}
```

### 3. Milestones Table
Stores milestone information for bounties.

**Schema**:
```sql
milestones (
  id uuid PRIMARY KEY,
  bounty_id uuid REFERENCES bounties(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  due_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-review', 'completed')),
  proof_required text NOT NULL,
  proof_submitted jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

**Endpoints**:

#### Get All Milestones
```http
GET {VITE_SUPABASE_URL}/rest/v1/milestones?select=*,bounty:bounties(title,ngo_id)
```

#### Get Milestones by Bounty
```http
GET {VITE_SUPABASE_URL}/rest/v1/milestones?bounty_id=eq.{bounty_id}
````

#### Get Milestone by ID
```http
GET {VITE_SUPABASE_URL}/rest/v1/milestones?id=eq.{milestone_id}
```

#### Create Milestone
```http
POST {VITE_SUPABASE_URL}/rest/v1/milestones
Content-Type: application/json

{
  "bounty_id": "{bounty_id}",
  "title": "Initial Legal Research",
  "description": "Research housing laws and precedents",
  "amount": 1000,
  "due_date": "2025-09-15T23:59:59Z",
  "proof_required": "Research report with legal citations"
}
```

#### Update Milestone (Submit Proof)
```http
PATCH {VITE_SUPABASE_URL}/rest/v1/milestones?id=eq.{milestone_id}
Content-Type: application/json

{
  "status": "in-review",
  "proof_submitted": {
    "document_url": "https://example.com/proof.pdf",
    "notes": "Completed research as requested",
    "submitted_at": "2025-08-11T10:00:00Z"
  }
}
```

### 4. Donations Table
Stores donation information.

**Schema**:
```sql
donations (
  id uuid PRIMARY KEY,
  bounty_id uuid REFERENCES bounties(id) NOT NULL,
  donor_id uuid REFERENCES users(id) NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  tx_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
)
```

**Endpoints**:

#### Get All Donations
```http
GET {VITE_SUPABASE_URL}/rest/v1/donations?select=*,bounty:bounties(title),donor:users(name)
```

#### Get Donations by Bounty
```http
GET {VITE_SUPABASE_URL}/rest/v1/donations?bounty_id=eq.{bounty_id}
```

#### Get Donations by Donor
```http
GET {VITE_SUPABASE_URL}/rest/v1/donations?donor_id=eq.{donor_user_id}
```

#### Create Donation
```http
POST {VITE_SUPABASE_URL}/rest/v1/donations
Content-Type: application/json

{
  "bounty_id": "{bounty_id}",
  "donor_id": "{donor_user_id}",
  "amount": 500,
  "tx_hash": "0x1234567890abcdef..."
}
```

### 5. Lawyer Reminders Table
Stores reminder information for lawyers.

**Schema**:
```sql
lawyer_reminders (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text,
  client_name text,
  client_email text,
  client_phone text,
  reminder_date date NOT NULL,
  reminder_time text NOT NULL,
  priority text DEFAULT 'medium',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
)
```

**Endpoints**:

#### Get All Reminders
```http
GET {VITE_SUPABASE_URL}/rest/v1/lawyer_reminders
```

#### Get Reminders by Date
```http
GET {VITE_SUPABASE_URL}/rest/v1/lawyer_reminders?reminder_date=eq.2025-08-11
```

#### Get Reminders by Status
```http
GET {VITE_SUPABASE_URL}/rest/v1/lawyer_reminders?status=eq.pending
```

#### Get Reminders by Priority
```http
GET {VITE_SUPABASE_URL}/rest/v1/lawyer_reminders?priority=eq.high
```

#### Create Reminder
```http
POST {VITE_SUPABASE_URL}/rest/v1/lawyer_reminders
Content-Type: application/json

{
  "title": "Court Hearing",
  "description": "Civil rights case hearing",
  "client_name": "Jane Doe",
  "client_email": "jane@example.com",
  "client_phone": "+254123456789",
  "reminder_date": "2025-08-15",
  "reminder_time": "10:00",
  "priority": "high"
}
```

#### Update Reminder
```http
PATCH {VITE_SUPABASE_URL}/rest/v1/lawyer_reminders?id=eq.{reminder_id}
Content-Type: application/json

{
  "status": "completed",
  "description": "Updated description"
}
```

#### Delete Reminder
```http
DELETE {VITE_SUPABASE_URL}/rest/v1/lawyer_reminders?id=eq.{reminder_id}
```

## Query Operators

Supabase supports various query operators:

### Exact Match
```http
GET /rest/v1/bounties?status=eq.open
```

### Greater Than
```http
GET /rest/v1/bounties?total_amount=gt.1000
```

### Less Than
```http
GET /rest/v1/bounties?total_amount=lt.5000
```

### Range
```http
GET /rest/v1/bounties?total_amount=gte.1000&total_amount=lte.5000
```

### Like (Pattern Matching)
```http
GET /rest/v1/bounties?title=like.*housing*
```

### In List
```http
GET /rest/v1/bounties?status=in.(open,in-progress)
```

### Array Contains
```http
GET /rest/v1/users?specializations=cs.{["civil_rights"]}
```

### Not Equal
```http
GET /rest/v1/bounties?status=neq.cancelled
```

## Ordering and Limiting

### Order By
```http
GET /rest/v1/bounties?order=created_at.desc
GET /rest/v1/bounties?order=total_amount.asc
```

### Limit and Offset
```http
GET /rest/v1/bounties?limit=10&offset=20
```

### Count
```http
GET /rest/v1/bounties?select=count()
```

## Joins and Related Data

### Select with Join
```http
GET /rest/v1/bounties?select=*,ngo:users(name,organization)
```

### Nested Relationships
```http
GET /rest/v1/bounties?select=*,ngo:users(name,organization),milestones(*),donations(amount,donor:users(name))
```

## Authentication Endpoints

### Sign Up
```http
POST {VITE_SUPABASE_URL}/auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Sign In
```http
POST {VITE_SUPABASE_URL}/auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Get User
```http
GET {VITE_SUPABASE_URL}/auth/v1/user
Authorization: Bearer {user_jwt_token}
```

### Sign Out
```http
POST {VITE_SUPABASE_URL}/auth/v1/logout
Authorization: Bearer {user_jwt_token}
```

## Real-time Subscriptions

Supabase supports real-time subscriptions using WebSockets:

```javascript
// Subscribe to bounty changes
const subscription = supabase
  .channel('bounties')
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'bounties' 
    }, 
    (payload) => {
      console.log('New bounty created:', payload.new);
    }
  )
  .subscribe();

// Subscribe to milestone updates
const milestoneSubscription = supabase
  .channel('milestones')
  .on('postgres_changes', 
    { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'milestones' 
    }, 
    (payload) => {
      console.log('Milestone updated:', payload.new);
    }
  )
  .subscribe();
```

## Row Level Security (RLS)

The database uses Row Level Security with the following policies:

### Users
- Users can read and update their own data
- Profile information is publicly readable

### Bounties
- Anyone can read bounties
- Only NGOs can create bounties
- NGOs can only update their own bounties

### Milestones
- Anyone can read milestones
- NGOs can create milestones for their bounties
- NGOs and lawyers can update milestones

### Donations
- Anyone can read donations
- Authenticated users can create donations for themselves

### Lawyer Reminders
- Lawyers can only access their own reminders

## Error Handling

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (invalid query or data)
- `401` - Unauthorized (invalid or missing auth token)
- `403` - Forbidden (RLS policy violation)
- `404` - Not Found
- `409` - Conflict (unique constraint violation)
- `422` - Unprocessable Entity (validation error)

Example error response:
```json
{
  "message": "duplicate key value violates unique constraint",
  "details": "Key (email)=(user@example.com) already exists.",
  "hint": null,
  "code": "23505"
}
```

## JavaScript SDK Usage

Using the Supabase JavaScript client:

```javascript
import { supabase } from './src/lib/supabase';

// Get all bounties with NGO information
const { data, error } = await supabase
  .from('bounties')
  .select(`
    *,
    ngo:users(name, organization),
    milestones(*),
    donations(amount, donor:users(name))
  `);

// Create a new bounty
const { data, error } = await supabase
  .from('bounties')
  .insert({
    title: 'Legal Aid Required',
    description: 'Help with eviction case',
    ngo_id: user.id,
    total_amount: 3000,
    category: 'housing_rights',
    location: 'Nairobi',
    due_date: '2025-12-31'
  });

// Update milestone with proof
const { data, error } = await supabase
  .from('milestones')
  .update({
    status: 'in-review',
    proof_submitted: {
      document_url: 'https://example.com/proof.pdf',
      notes: 'Research completed'
    }
  })
  .eq('id', milestoneId);

// Real-time subscription
const subscription = supabase
  .channel('bounties')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'bounties' }, 
    (payload) => console.log('Change received!', payload)
  )
  .subscribe();
```

## Environment Variables

Make sure these are set in your `.env` file:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project settings under "API" section.

## Testing with cURL

Example cURL commands for testing:

```bash
# Get all bounties
curl -X GET \
  "${VITE_SUPABASE_URL}/rest/v1/bounties" \
  -H "apikey: ${VITE_SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}"

# Create a reminder
curl -X POST \
  "${VITE_SUPABASE_URL}/rest/v1/lawyer_reminders" \
  -H "apikey: ${VITE_SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${USER_JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Court Hearing",
    "client_name": "John Doe",
    "reminder_date": "2025-08-15",
    "reminder_time": "10:00",
    "priority": "high"
  }'
```

This documentation covers all the main Supabase endpoints available in your HakiChain application based on the database schema defined in your migrations.
