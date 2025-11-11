# Supabase Setup Instructions

## Step-by-Step Guide to Set Up the New Booking System

### 1. Open Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New Query"** to create a new SQL query

### 2. Run the Migration Script

Copy and paste the **entire contents** of `docs/teacher-availability-schema.sql` into the SQL Editor, then click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`).

This script will:
- ✅ Create the `teacher_availability` table
- ✅ Add new columns to `class_requests` table:
  - `lessons_per_week`
  - `total_lessons`
  - `first_class_free`
  - `preferred_schedules`
  - `weekly_schedule`
  - `payment_preference`
- ✅ Create the `class_packages` table
- ✅ Set up Row Level Security (RLS) policies
- ✅ Create necessary indexes

### 3. Verify the Migration

After running the script, verify that everything was created successfully:

#### Check Tables
Run this query to see all tables:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('teacher_availability', 'class_packages', 'class_requests');
```

#### Check Columns
Run this query to verify new columns were added to `class_requests`:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'class_requests' 
AND column_name IN ('lessons_per_week', 'total_lessons', 'first_class_free', 'weekly_schedule', 'payment_preference');
```

#### Check Policies
Run this query to verify RLS policies:
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('teacher_availability', 'class_packages');
```

### 4. Set Up Teacher Availability (Optional but Recommended)

After the migration, you should set up your weekly availability schedule:

1. Go to your Admin Dashboard in the app
2. Navigate to the **"Availability"** tab
3. Add your available time slots for each day of the week
4. Make sure to set times between **8 AM and 8 PM** (the system enforces this)

### 5. Test the System

1. **As a Student:**
   - Create a new class request
   - Select days of week and times
   - Choose payment preference
   - Submit the request

2. **As a Teacher (Admin):**
   - Go to Admin Dashboard → Classes tab
   - View the pending request
   - Click "Approve" - the system should automatically generate all classes
   - Verify that classes were created with the correct schedule

### 6. Troubleshooting

#### If you get an error about existing constraints:
If the constraint `check_min_lessons` already exists, you can drop it first:
```sql
ALTER TABLE class_requests DROP CONSTRAINT IF EXISTS check_min_lessons;
```
Then run the migration script again.

#### If you get an error about existing columns:
The script uses `ADD COLUMN IF NOT EXISTS`, so it should be safe to run multiple times. However, if you need to remove columns first:
```sql
ALTER TABLE class_requests 
  DROP COLUMN IF EXISTS lessons_per_week,
  DROP COLUMN IF EXISTS total_lessons,
  DROP COLUMN IF EXISTS first_class_free,
  DROP COLUMN IF EXISTS preferred_schedules,
  DROP COLUMN IF EXISTS weekly_schedule,
  DROP COLUMN IF EXISTS payment_preference;
```

#### If policies already exist:
The script will fail if policies with the same names already exist. You can drop them first:
```sql
DROP POLICY IF EXISTS "Admins can view availability" ON teacher_availability;
DROP POLICY IF EXISTS "Admins can insert availability" ON teacher_availability;
DROP POLICY IF EXISTS "Admins can update availability" ON teacher_availability;
DROP POLICY IF EXISTS "Admins can delete availability" ON teacher_availability;
DROP POLICY IF EXISTS "Students can view availability" ON teacher_availability;
DROP POLICY IF EXISTS "Students can view own packages" ON class_packages;
DROP POLICY IF EXISTS "Admins can view all packages" ON class_packages;
DROP POLICY IF EXISTS "Admins can manage packages" ON class_packages;
```

### 7. Important Notes

- ⚠️ **Backup First**: Always backup your database before running migrations in production
- ✅ **Safe to Re-run**: The script uses `IF NOT EXISTS` clauses, so it's safe to run multiple times
- 🔒 **RLS Enabled**: Row Level Security is enabled on all new tables for data protection
- 📊 **Indexes Created**: Indexes are created for better query performance

### 8. What Gets Created

#### New Table: `teacher_availability`
Stores your weekly availability schedule (which days and times you're available).

#### New Table: `class_packages`
Tracks student packages (total lessons, completed lessons, payment status).

#### Updated Table: `class_requests`
Now includes:
- Weekly schedule pattern
- Payment preferences
- Total lessons and lessons per week

### 9. Next Steps

After running the migration:
1. ✅ Set up your availability in the Admin Dashboard
2. ✅ Test creating a class request as a student
3. ✅ Test approving and auto-generating classes as admin
4. ✅ Verify that classes are scheduled correctly

---

## Quick Reference

**File to Run:** `docs/teacher-availability-schema.sql`

**Location in Supabase:** SQL Editor → New Query → Paste & Run

**Expected Result:** All tables, columns, and policies created successfully

**Verification:** Run the check queries above to confirm everything is set up correctly

