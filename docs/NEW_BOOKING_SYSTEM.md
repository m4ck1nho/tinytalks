# New Booking System Documentation

## Overview

The booking system has been completely redesigned to implement a structured lesson package system with teacher availability management and automatic conflict prevention.

## Key Features

### 1. **Minimum Purchase Requirement**
- Students must purchase a minimum of **4 lessons**
- The **first lesson is free**
- System validates this requirement before allowing booking requests

### 2. **Booking Questions**
Before requesting a class, students must answer:
- **How many lessons per week?** (1-5 options)
- **How many lessons do you want to buy?** (Minimum 4, first one is free)

### 3. **Teacher Availability Management**
- Teachers can set their weekly availability schedule
- Availability is managed day-by-day with time slots
- System prevents double-booking automatically
- Students can only book available times

### 4. **Automatic Conflict Prevention**
- System checks teacher availability before allowing bookings
- Prevents scheduling conflicts with existing classes
- Validates time slots against teacher's weekly schedule
- Real-time availability checking

## Database Schema

### New Table: `teacher_availability`
```sql
CREATE TABLE teacher_availability (
  id UUID PRIMARY KEY,
  day_of_week INTEGER (0-6), -- 0 = Sunday, 6 = Saturday
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Updated Table: `class_requests`
New columns added:
- `lessons_per_week` INTEGER
- `total_lessons` INTEGER (minimum 4)
- `first_class_free` BOOLEAN (default: true)

## Algorithm

### Availability Checking Algorithm

The system uses a multi-step algorithm to check availability:

1. **Day of Week Check**: Verifies if teacher has availability set for the requested day
2. **Time Slot Check**: Validates if requested time falls within available hours
3. **Conflict Detection**: Checks for overlapping classes on the same day
4. **Double-Booking Prevention**: Prevents scheduling multiple classes at the same time

### Booking Flow

1. Student fills out booking form with:
   - Lessons per week
   - Total lessons (minimum 4)
   - Preferred date/time (optional)
   - Topic and message (optional)

2. System validates:
   - Minimum 4 lessons requirement
   - Availability if date/time provided

3. Teacher reviews request and sees:
   - Lessons per week
   - Total lessons
   - First lesson free indicator
   - Preferred schedule

4. When approving:
   - Calculates payment (first lesson free)
   - Prevents double-booking

## UI Components

### Student Dashboard
- Updated booking form with new questions
- Validation messages

### Teacher Dashboard
- Weekly schedule view
- Shows new booking fields in class requests

## Setup Instructions

1. **Run Database Migration**
   ```sql
   -- Run the SQL in docs/teacher-availability-schema.sql
   ```

2. **Test Booking Flow**
   - Student requests class with new questions
   - System validates minimum lessons
   - Teacher approves with automatic conflict checking

## Payment Calculation

When a class request is approved:
- Total lessons: `total_lessons` (from request)
- Paid lessons: `total_lessons - 1` (first lesson free)
- Payment amount: `paid_lessons * 2000` rubles (example rate)

## Error Messages

- "Minimum 4 lessons required. First lesson is free!"

## Future Enhancements

- Show available time slots when student selects a date
- Automatic scheduling suggestions based on lessons per week
- Recurring class creation for package bookings

