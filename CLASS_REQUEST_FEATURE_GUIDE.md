# Class Request Feature Guide

## Overview
A comprehensive class request system has been implemented that allows students to request classes and teachers to manage them efficiently.

## Features Implemented

### 1. **Database Schema**
- **File**: `supabase-class-requests.sql`
- Created `class_requests` table with:
  - Student information (id, name, email)
  - Preferred date and time
  - Topic and message fields
  - Status tracking (pending, approved, rejected)
  - Admin notes
  - Row Level Security (RLS) policies for students and admins

### 2. **Type Definitions**
- **File**: `types/index.ts`
- Added `ClassRequest` interface
- Added `User` interface for user management

### 3. **Database Helper Functions**
- **File**: `lib/supabase.ts`
- `getClassRequests()` - Fetch all class requests
- `createClassRequest()` - Create a new request
- `updateClassRequest()` - Update request status/notes
- `deleteClassRequest()` - Delete a request
- `subscribeToClassRequests()` - Real-time updates
- `getAllUsers()` - Get all registered students

### 4. **Teacher Dashboard (ScheduleManager)**
- **File**: `components/admin/ScheduleManager.tsx`

#### Features:
1. **Student Selector**
   - Checkbox to select from registered students
   - Dropdown showing all students with their names and emails
   - Auto-fills name and email when student is selected
   - Can still manually enter new student info

2. **Class Request Management**
   - Displays pending class requests in yellow notification box
   - Shows student info, preferred date/time, topic, and message
   - **Approve** button - Pre-fills form with request data
   - **Reject** button - Marks request as rejected
   - Shows request submission timestamp

### 5. **Student Dashboard**
- **File**: `app/dashboard/page.tsx`

#### Features:
1. **Request Class Button**
   - Navy blue button next to "Upcoming Classes" heading
   - Opens request form modal

2. **Request Form Modal**
   - Preferred Date (optional)
   - Preferred Time (optional)
   - Topic (optional)
   - Message textarea (optional)
   - Submit and Cancel buttons

3. **My Class Requests Section**
   - Shows all student's requests
   - Color-coded by status:
     - **Yellow**: Pending
     - **Green**: Approved
     - **Red**: Rejected
   - Displays:
     - Preferred date/time
     - Topic
     - Message
     - Status badge
     - Teacher's notes (if any)
     - Submission timestamp

### 6. **Translations**
- **Files**: `locales/en.json`, `locales/ru.json`
- Full bilingual support (English/Russian) for:
  - "Request a Class" button
  - Request form labels and placeholders
  - Status labels (Pending, Approved, Rejected)
  - Success/error messages
  - All UI text

## How It Works

### For Students:
1. Student clicks "Request a Class" button in dashboard
2. Fills out the request form (all fields optional)
3. Submits request
4. Request appears in "My Class Requests" section with "Pending" status
5. Student can see when teacher approves/rejects with optional notes

### For Teacher:
1. New requests appear in yellow notification box in Schedule tab
2. Teacher can see all request details
3. Click "Approve" to:
   - Open the "Schedule New Class" form
   - Form pre-filled with student info and request details
   - Teacher can adjust and schedule the class
4. Click "Reject" to decline the request
5. Can add notes when updating request status

### Registered Student Selection:
1. When creating a new class, teacher sees checkbox
2. Check "Select from registered students"
3. Dropdown appears with all students who have had classes before
4. Selecting a student auto-fills name and email
5. Can uncheck to manually enter new student info

## Database Setup

Run the SQL file to create the table:
```bash
# Connect to your Supabase project and run:
supabase-class-requests.sql
```

This creates:
- `class_requests` table
- Indexes for performance
- RLS policies for security
- Triggers for timestamp updates

## Security
- Students can only create and view their own requests
- Admins can view, update, and delete all requests
- All operations protected by Row Level Security (RLS)

## Real-Time Updates
- Both teacher and student dashboards automatically update when:
  - New request is submitted
  - Request status changes
  - Request is deleted

## Translation Keys

### English/Russian Support:
- `classRequest.button` - "Request a Class" / "Запросить занятие"
- `classRequest.title` - "My Class Requests" / "Мои запросы на занятия"
- `classRequest.status.pending` - "Pending" / "Ожидает"
- `classRequest.status.approved` - "Approved" / "Одобрено"
- `classRequest.status.rejected` - "Rejected" / "Отклонено"
- Plus 15+ more translation keys for all UI elements

## Next Steps

1. **Run the SQL file** in your Supabase dashboard
2. **Test the feature**:
   - As student: Request a class
   - As admin: Approve/reject request
3. **Customize** as needed:
   - Add more fields to the request form
   - Add email notifications
   - Customize approval workflow

## Files Modified
- `supabase-class-requests.sql` (NEW)
- `types/index.ts`
- `lib/supabase.ts`
- `components/admin/ScheduleManager.tsx`
- `app/dashboard/page.tsx`
- `locales/en.json`
- `locales/ru.json`

## Notes
- All fields in request form are optional to make it easy for students
- Teacher can see student's preferred timing but isn't required to follow it
- Request system works alongside direct class scheduling
- Students with no previous classes won't appear in the registered students dropdown until they have at least one scheduled class

