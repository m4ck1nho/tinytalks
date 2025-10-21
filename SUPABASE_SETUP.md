# Supabase Setup Guide for TinyTalks

Complete guide to set up Supabase for your TinyTalks website.

## 🎯 Why Supabase?

- **Simpler than Firebase** - PostgreSQL database with SQL queries
- **Better Developer Experience** - Intuitive dashboard and tools
- **Open Source** - Self-hostable if needed
- **All-in-one** - Database, Auth, and Storage in one place
- **Real-time** - Built-in real-time subscriptions
- **Free Tier** - Generous free plan to get started

## 📋 Quick Setup (10 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (recommended) or email
4. Click "New Project"
5. Fill in:
   - **Name**: `TinyTalks`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier
6. Click "Create new project"
7. Wait ~2 minutes for setup

### Step 2: Get Your Credentials

1. In your Supabase project dashboard
2. Click "Settings" (gear icon) → "API"
3. Find and copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

### Step 3: Update Environment Variables

Open `.env.local` in your project and replace with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-9557BPB41T
```

### Step 4: Create Database Tables

1. In Supabase dashboard, click "SQL Editor"
2. Click "New query"
3. Copy the entire contents of `supabase-setup.sql` file
4. Paste into the editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

This creates:
- ✅ `blog_posts` table
- ✅ `contact_messages` table
- ✅ `reviews` table
- ✅ Storage buckets for images
- ✅ Security policies (RLS)
- ✅ All necessary permissions

### Step 5: Create Admin User

1. In Supabase dashboard, click "Authentication"
2. Click "Users" tab
3. Click "Add user" → "Create new user"
4. Fill in:
   - **Email**: your admin email
   - **Password**: create a strong password
   - **Auto Confirm User**: ✅ Check this box
5. Click "Create user"

### Step 6: Test Your Setup

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000
3. Test the contact form - submit a message
4. Check Supabase dashboard → Table Editor → `contact_messages`
5. Your message should appear!

6. Go to http://localhost:3000/admin/login
7. Login with your admin credentials
8. You should see the dashboard!

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Environment variables updated in `.env.local`
- [ ] SQL setup script run successfully
- [ ] Admin user created
- [ ] Dev server restarted
- [ ] Contact form test successful
- [ ] Admin login successful
- [ ] Can create blog post in admin panel

## 📚 Database Structure

### blog_posts Table
```sql
- id (UUID, primary key)
- title (text, required)
- content (text, required)
- excerpt (text, required)
- image (text, optional)
- slug (text, required, unique)
- meta_description (text, optional)
- published (boolean, default: false)
- created_at (timestamp)
- updated_at (timestamp)
```

### contact_messages Table
```sql
- id (UUID, primary key)
- name (text, required)
- email (text, required)
- message (text, required)
- read (boolean, default: false)
- created_at (timestamp)
```

### reviews Table
```sql
- id (UUID, primary key)
- name (text, required)
- content (text, required)
- rating (integer, 1-5)
- created_at (timestamp)
```

## 🔐 Security (Row Level Security)

The setup automatically configures secure access:

### Public Access
- ✅ Anyone can read published blog posts
- ✅ Anyone can submit contact forms
- ✅ Anyone can read reviews

### Admin Only
- 🔒 Create/edit/delete blog posts
- 🔒 Read/manage contact messages
- 🔒 Manage reviews
- 🔒 Upload images

## 🖼️ Image Storage

Two storage buckets are created:

1. **blog-images** - Featured images for blog posts
2. **blog-content** - Images within blog post content

Both are:
- Publicly readable
- Admin-only writable
- Automatically accessible via CDN

## 🔧 Advanced Configuration

### View Your Data

1. Supabase Dashboard → Table Editor
2. Select table (blog_posts, contact_messages, etc.)
3. View, edit, or delete rows directly

### Query Your Data

1. Supabase Dashboard → SQL Editor
2. Write custom SQL queries
3. Example:
   ```sql
   SELECT * FROM blog_posts WHERE published = true;
   ```

### Real-time Subscriptions

The app automatically listens for changes:
- New blog posts appear instantly in admin
- New messages show up in real-time
- No page refresh needed!

### Backup Your Data

1. Supabase Dashboard → Database
2. Click "Backups"
3. Automatic daily backups on paid plans
4. Manual backup: click "Export" in Table Editor

## 🚀 Going to Production

### When deploying to Vercel:

1. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`

2. Your Supabase project works the same in production!
3. No additional configuration needed

### Custom Domain

1. Supabase Dashboard → Settings → API
2. Add your production domain to "Site URL"
3. Add domain to "Redirect URLs"

## 💡 Tips & Tricks

### 1. View Realtime Logs
- Dashboard → Logs → Select log type
- See all database queries, errors, auth events

### 2. Test Queries
- Use SQL Editor to test queries before coding
- Preview data structure

### 3. Monitor Usage
- Dashboard → Reports
- See API requests, database size, storage usage

### 4. Database Migrations
- Dashboard → Database → Migrations
- Track all schema changes

## 🆘 Troubleshooting

### "Failed to fetch" errors
- Check `.env.local` has correct URL and key
- Restart dev server after changing env vars
- Verify Supabase project is active (not paused)

### Can't login as admin
- Verify user exists in Authentication → Users
- Check "Auto Confirm User" was enabled
- Try password reset

### Images not uploading
- Check storage buckets exist
- Verify storage policies are correct
- Check browser console for errors

### Data not showing
- Check RLS policies are applied
- Verify tables were created correctly
- Look at Network tab in browser dev tools

## 📞 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Discord Community**: https://discord.supabase.com
- **Status Page**: https://status.supabase.com

## 🎉 You're All Set!

Your TinyTalks website is now powered by Supabase!

**Next Steps:**
1. Add teacher photos to `public/images/`
2. Customize content in components
3. Create your first blog post
4. Test all features
5. Deploy to Vercel!

---

**Much simpler than Firebase, right?** 😊

