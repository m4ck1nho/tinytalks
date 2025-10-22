# Teacher Dashboard Setup Guide

## Overview

The teacher dashboard provides comprehensive management tools for:
- **Schedule**: View and manage all classes with payment tracking
- **Homework**: Assign homework, review submissions, and provide feedback
- **Payments**: Track payment notifications from students

## Database Setup

### Step 1: Run the SQL Schema

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Open the file `teacher-dashboard-schema.sql` from your project
4. Click **Run** to create all necessary tables and policies

This will create:
- `classes` - Stores all scheduled classes
- `homework` - Stores homework assignments
- `payment_notifications` - Stores payment notifications from students

### Step 2: Verify Tables Were Created

Run this query to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('classes', 'homework', 'payment_notifications');
```

You should see all three tables listed.

## Features

### 1. Schedule Manager (`/admin/dashboard` - Schedule Tab)

**Teacher can:**
- ✅ Schedule new classes with student details
- ✅ Set class date, duration, topic, and payment amount
- ✅ Mark classes as scheduled/completed/cancelled
- ✅ View payment status for each class (unpaid/pending/paid)
- ✅ Edit or delete scheduled classes

**How to use:**
1. Click "Schedule New Class"
2. Fill in:
   - Student name and email
   - Date & time
   - Duration (in minutes)
   - Class type (Individual/Group/Trial)
   - Topic (optional)
   - Payment amount
   - Notes (optional)
3. Click "Schedule Class"

### 2. Homework Manager (`/admin/dashboard` - Homework Tab)

**Teacher can:**
- ✅ Assign homework to students
- ✅ View homework submissions
- ✅ Provide feedback and grades
- ✅ Track homework status (assigned/submitted/reviewed/completed)
- ✅ Edit or delete homework

**How to assign homework:**
1. Click "Assign Homework"
2. Fill in:
   - Student name and email
   - Homework title
   - Due date
   - Description/instructions
3. Click "Assign Homework"

**How to review submissions:**
1. When homework status shows "submitted"
2. Click "Add Feedback & Grade"
3. Enter grade and feedback
4. Click "Save Feedback"
5. Status automatically changes to "reviewed"

### 3. Payment Manager (`/admin/dashboard` - Payments Tab)

**Teacher can:**
- ✅ View all payment notifications from students
- ✅ Confirm payments (marks class as "paid")
- ✅ Reject payments with reason
- ✅ Track all classes and their payment status
- ✅ Filter payments by status (all/pending/confirmed/rejected)

**Payment workflow:**
1. Student pays through external method (bank transfer, cash, etc.)
2. Student submits payment notification through their dashboard
3. Teacher receives notification in "Pending" tab
4. Teacher can:
   - **Confirm**: Marks payment as received and class as "paid"
   - **Reject**: Sends rejection reason back to student

## Student Features

### Student Dashboard (`/dashboard`)

**Students can:**
- ✅ View upcoming classes
- ✅ See payment status for each class
- ✅ Submit payment notifications
- ✅ View assigned homework
- ✅ See teacher feedback on homework

**Payment notification process:**
1. Student sees class marked as "unpaid"
2. Student pays through their preferred method (outside the platform)
3. Student clicks "Notify Payment" button
4. Student fills in:
   - Amount paid
   - Payment method (Bank Transfer/Cash/PayPal/etc.)
   - Payment date
   - Reference/transaction number (optional)
   - Message to teacher (optional)
5. Teacher receives notification and can confirm or reject

## Data Models

### Class Structure
```typescript
{
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  class_date: string;
  duration_minutes: number;
  class_type: 'Individual' | 'Group' | 'Trial';
  topic: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'pending' | 'paid';
  payment_amount: number;
}
```

### Homework Structure
```typescript
{
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  title: string;
  description: string;
  due_date: string;
  status: 'assigned' | 'submitted' | 'reviewed' | 'completed';
  submission_text: string;
  teacher_feedback: string;
  grade: string;
}
```

### Payment Notification Structure
```typescript
{
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  class_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  reference_number: string;
  message: string;
  status: 'pending' | 'confirmed' | 'rejected';
  teacher_notes: string;
}
```

## Security & Permissions

### Row Level Security (RLS)

All tables have RLS policies that:

**Classes:**
- Students can view only their own classes
- Only admins can create, update, or delete classes

**Homework:**
- Students can view only their own homework
- Students can update their homework (for submissions)
- Only admins can create and delete homework

**Payment Notifications:**
- Students can create payment notifications
- Students can view only their own notifications
- Only admins can update (confirm/reject) notifications

## Testing the System

### 1. Create Admin User
Follow `ADMIN_SETUP_GUIDE.md` to create your admin account.

### 2. Create a Test Student
1. Go to `/auth`
2. Sign up with a test email
3. This creates a student account

### 3. Test Schedule Workflow
**As Teacher:**
1. Log in to `/admin/login`
2. Go to Schedule tab
3. Click "Schedule New Class"
4. Fill in student details (use test student's email)
5. Set a payment amount
6. Save

**As Student:**
1. Log in to `/dashboard`
2. See the scheduled class
3. Note the "Notify Payment" button

### 4. Test Payment Workflow
**As Student:**
1. Click "Notify Payment"
2. Fill in payment details
3. Submit

**As Teacher:**
1. Go to Payments tab
2. See pending payment notification
3. Click "Confirm"
4. Verify class status changed to "paid"

### 5. Test Homework Workflow
**As Teacher:**
1. Go to Homework tab
2. Click "Assign Homework"
3. Fill in details for test student
4. Save

**As Student:**
1. Check dashboard
2. See assigned homework

## Common Workflows

### Scheduling a Class
1. Teacher schedules class with payment amount
2. Student sees class in dashboard
3. Student pays externally
4. Student submits payment notification
5. Teacher confirms payment
6. Class marked as "paid"
7. After class, teacher marks as "completed"

### Homework Lifecycle
1. Teacher assigns homework
2. Student sees homework in dashboard
3. Student submits (future feature)
4. Teacher reviews and provides feedback
5. Status changes to "reviewed"

## Troubleshooting

### Students can't see their classes
- Verify `student_id` in classes table matches user ID in auth.users
- Check RLS policies are enabled

### Payment confirmation doesn't update class
- Ensure `class_id` in payment notification matches actual class ID
- Check admin has permission to update classes

### Can't create classes/homework
- Verify you're logged in as admin
- Check user_metadata has `role: 'admin'`

## Future Enhancements (Optional)

Consider adding:
- Email notifications when students submit payments
- Calendar view for schedule
- Bulk homework assignment
- Student homework submission interface
- Payment receipts
- Reporting and analytics

## Summary

Your teacher dashboard is now complete with:
- ✅ Full class scheduling system
- ✅ Homework management
- ✅ Manual payment tracking
- ✅ Student-to-teacher payment notifications
- ✅ Role-based access control
- ✅ Real-time updates

**Next Steps:**
1. Run the SQL schema in Supabase
2. Create your admin account
3. Test with a student account
4. Start scheduling classes!

For questions or issues, refer to the main README.md file.

