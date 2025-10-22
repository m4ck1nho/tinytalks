# Setup Class Requests Feature

## ⚠️ Error: "Error fetching class requests"

This error occurs because the `class_requests` table doesn't exist yet in your database.

## 🔧 How to Fix

### Step 1: Go to Supabase Dashboard
1. Open your browser and go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your **tinytalks** project

### Step 2: Open SQL Editor
1. In the left sidebar, click on **"SQL Editor"**
2. Click **"New Query"**

### Step 3: Run the SQL
1. Open the file `supabase-class-requests.sql` in this project
2. **Copy ALL the content** from that file
3. **Paste it** into the SQL Editor in Supabase
4. Click the **"Run"** button (or press Ctrl+Enter)

### Step 4: Verify Success
You should see a message like:
```
Success. No rows returned
```

This means the table and all security policies were created successfully!

### Step 5: Refresh Your App
1. Go back to your app
2. Refresh the page (F5)
3. The error should be gone! ✅

## 📋 What This Creates

The SQL file creates:
- ✅ `class_requests` table
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Automatic timestamp updates

## 🎯 Quick Check

After running the SQL, you can verify it worked:

1. In Supabase, go to **Table Editor**
2. Look for the `class_requests` table in the list
3. You should see these columns:
   - id
   - student_id
   - student_name
   - student_email
   - preferred_date
   - preferred_time
   - topic
   - message
   - status
   - admin_notes
   - created_at
   - updated_at

## 🚀 Next Steps

Once the table is created:
1. ✅ Students can request classes
2. ✅ Teacher can see requests in the Schedule tab
3. ✅ Teacher can approve/reject requests
4. ✅ Students can see request status in their dashboard

---

## Need Help?

If you still see errors after running the SQL:
1. Make sure you're connected to the correct Supabase project
2. Check that you copied the ENTIRE SQL file (all 92 lines)
3. Look for any error messages in the SQL Editor
4. Make sure your Supabase project is active and not paused

