# Admin User Setup Guide

This guide explains how to set up admin users for your TinyTalks application. Unlike regular students, admin users cannot self-register and must be created manually in Supabase.

## Role-Based Access Control

Your TinyTalks application has two types of users:

1. **Students** - Regular users who sign up through `/auth`
   - Can access their dashboard at `/dashboard`
   - All public sign-ups default to student role
   - Can use email/password or Google authentication

2. **Admin** - The teacher/owner
   - Can access admin panel at `/admin/dashboard`
   - Cannot self-register (must be manually created)
   - Can only use email/password authentication (Google auth disabled for security)
   - Has access to blog management, messages, and analytics

## Creating an Admin User

### Method 1: Through Supabase Dashboard (Recommended)

1. **Go to your Supabase project**
   - Open [Supabase Dashboard](https://app.supabase.com)
   - Select your TinyTalks project

2. **Navigate to Authentication**
   - Click **Authentication** in the left sidebar
   - Click **Users** tab

3. **Create a new user**
   - Click **Add User** button
   - Choose **Create new user**
   - Fill in:
     - **Email**: Your admin email (e.g., `admin@tinytalks.com`)
     - **Password**: Create a strong password
     - **Auto Confirm User**: Check this box ✅

4. **Set the admin role**
   - After creating the user, click on the newly created user in the list
   - Scroll down to **User Metadata** section
   - Click **Edit** (pencil icon)
   - Add this JSON:
     ```json
     {
       "role": "admin"
     }
     ```
   - Click **Save**

5. **Test the admin login**
   - Go to your site's admin login: `https://your-domain.com/admin/login`
   - Sign in with the email and password you created
   - You should be redirected to `/admin/dashboard`

### Method 2: Through SQL Editor

1. **Go to SQL Editor in Supabase**
   - Click **SQL Editor** in the left sidebar

2. **Create admin user with SQL**
   ```sql
   -- First, create the user account
   -- Replace with your email and password
   INSERT INTO auth.users (
     instance_id,
     id,
     aud,
     role,
     email,
     encrypted_password,
     email_confirmed_at,
     raw_user_meta_data,
     created_at,
     updated_at,
     confirmation_token,
     recovery_token
   )
   VALUES (
     '00000000-0000-0000-0000-000000000000',
     gen_random_uuid(),
     'authenticated',
     'authenticated',
     'admin@tinytalks.com', -- Change this
     crypt('YourStrongPassword123!', gen_salt('bf')), -- Change this
     NOW(),
     '{"role": "admin"}'::jsonb,
     NOW(),
     NOW(),
     '',
     ''
   );
   ```

3. **Run the SQL**
   - Click **Run** or press `Ctrl+Enter`
   - You should see a success message

### Method 3: Promote an Existing User to Admin

If you already have a student account and want to make it an admin:

1. **Find the user in Supabase Dashboard**
   - Go to **Authentication** → **Users**
   - Find the user you want to promote

2. **Update user metadata**
   - Click on the user
   - Scroll to **User Metadata**
   - Click **Edit**
   - Change or add the `role` field:
     ```json
     {
       "full_name": "Your Name",
       "role": "admin"
     }
     ```
   - Click **Save**

3. **Test the access**
   - Log out if currently logged in
   - Go to `/admin/login`
   - Sign in with the user's credentials
   - You should now have admin access

## Security Features

### Admin Panel Protection

The admin panel has multiple layers of protection:

1. **Route Protection** (`app/admin/layout.tsx`)
   - Checks if user is authenticated
   - Verifies user has `admin` role
   - Redirects non-admin users to student dashboard
   - Redirects unauthenticated users to admin login

2. **Login Verification** (`app/admin/login/page.tsx`)
   - After successful login, checks user role
   - If not admin, logs user out immediately
   - Shows "Access denied" error

3. **No Self-Registration**
   - No sign-up form on admin login page
   - Google authentication disabled for admin login
   - Only email/password authentication allowed

### Student Account Creation

All public sign-ups automatically create student accounts:

- Sign-up at `/auth` always sets `role: 'student'`
- Google sign-in always sets `role: 'student'`
- Students cannot access `/admin/*` routes
- Students are redirected to `/dashboard`

## Testing Your Setup

### Test Admin Access

1. **Login as admin:**
   - Go to `http://localhost:3000/admin/login`
   - Enter admin credentials
   - Should redirect to `/admin/dashboard`
   - Should see: Blog Posts, Messages, Analytics

2. **Try accessing student dashboard:**
   - While logged in as admin, go to `/dashboard`
   - Should automatically redirect back to `/admin/dashboard`

### Test Student Access

1. **Create a student account:**
   - Go to `http://localhost:3000/auth`
   - Sign up with email or Google
   - Should redirect to `/dashboard`

2. **Try accessing admin panel:**
   - While logged in as student, go to `/admin/login`
   - Or try to access `/admin/dashboard`
   - Should redirect to `/dashboard` (student dashboard)

3. **Try admin login:**
   - Log out from student account
   - Go to `/admin/login`
   - Try to sign in with student credentials
   - Should show "Access denied" error

## Troubleshooting

### Admin can't log in

1. **Check user metadata in Supabase:**
   - Go to Authentication → Users
   - Click on the admin user
   - Verify User Metadata contains: `{"role": "admin"}`

2. **Check email confirmation:**
   - In the user list, check if email is confirmed
   - If not, click on user and click "Send confirmation email"
   - Or manually set `email_confirmed_at` to current timestamp

### Student accessing admin panel

If a student can access the admin panel:

1. **Check their metadata:**
   - They might accidentally have `role: 'admin'`
   - Update it to `role: 'student'`

2. **Clear browser cache:**
   - The user should log out and log back in
   - Clear browser cache/cookies

### User gets redirected to wrong dashboard

1. **Check role in metadata:**
   - Verify the role is exactly `"admin"` or `"student"` (lowercase)

2. **Try clearing session:**
   - Log out completely
   - Clear browser cookies
   - Log back in

## Important Notes

⚠️ **Security Best Practices:**

- **Never** share admin credentials
- Use a strong, unique password for admin accounts
- Consider using a password manager
- Don't commit admin credentials to Git
- For production, consider enabling 2FA in Supabase

⚠️ **Role Management:**

- Only set `role: 'admin'` for the actual site owner/teacher
- All student accounts should have `role: 'student'`
- If a user has no role metadata, the system defaults to 'student'

⚠️ **Making Changes:**

- After updating user metadata, the user must log out and log back in
- Changes to roles take effect on next authentication

## Quick Reference

### Admin User Metadata Format
```json
{
  "full_name": "Teacher Name",
  "role": "admin"
}
```

### Student User Metadata Format
```json
{
  "full_name": "Student Name",
  "role": "student"
}
```

### Admin Login URL
- Local: `http://localhost:3000/admin/login`
- Production: `https://your-domain.com/admin/login`

### Student Auth URL
- Local: `http://localhost:3000/auth`
- Production: `https://your-domain.com/auth`

---

For additional help, check the Supabase documentation on [User Management](https://supabase.com/docs/guides/auth/managing-user-data).

