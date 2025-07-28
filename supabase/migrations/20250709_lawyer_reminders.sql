-- Migration: Create lawyer_reminders table
create table if not exists lawyer_reminders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  client_name text,
  client_email text,
  client_phone text,
  reminder_date date not null,
  reminder_time text not null,
  priority text default 'medium',
  status text default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
); 