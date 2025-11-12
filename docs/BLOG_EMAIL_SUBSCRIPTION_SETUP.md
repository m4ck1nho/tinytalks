# Blog Email Subscription Feature

## 📧 Overview

This feature allows visitors to subscribe to email notifications when new blog posts are published.

## ✅ What's Included

1. **Database Table**: `blog_email_subscriptions` - Stores subscriber emails
2. **Subscription Form**: Component with multiple variants (default, inline, compact)
3. **API Routes**: 
   - `/api/blog/subscribe` - Handle email subscriptions
   - `/api/blog/notify-subscribers` - Notify subscribers when posts are published
4. **Integration**: Forms added to blog listing and individual post pages
5. **Auto-notification**: Subscribers are notified when new posts are published

## 🚀 Setup Instructions

### Step 1: Create Database Table

1. Go to your Supabase project dashboard
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Copy and paste the entire contents of `docs/blog-email-subscriptions.sql`
5. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)

This creates:
- ✅ `blog_email_subscriptions` table
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Permissions for public subscription and admin management

### Step 2: Verify Installation

After running the SQL script, verify the table was created:

```sql
SELECT * FROM blog_email_subscriptions LIMIT 1;
```

You should see the table structure without errors.

## 📍 Where Subscription Forms Appear

1. **Blog Listing Page** (`/blog`):
   - Full subscription form at the bottom (when not searching)

2. **Individual Blog Post** (`/blog/[slug]`):
   - Compact subscription form after the article content
   - Appears before the CTA section

## 🎨 Form Variants

The `BlogSubscribeForm` component supports three variants:

- **`default`**: Full form with icon, title, description, name and email fields
- **`compact`**: Smaller form with just email field and button
- **`inline`**: Horizontal layout for sidebars or headers

## 📧 Email Notification Setup

Resend is already integrated! Just configure your API key:

### Step 1: Install Dependencies

```bash
npm install
```

This will install the `resend` package (already added to `package.json`).

### Step 2: Configure Resend API Key

1. Sign up at [resend.com](https://resend.com) (if you haven't already)
2. Get your API key from the dashboard
3. Add to `.env.local`:

```env
RESEND_API_KEY=re_LcCV7Xwm_AByJvXTEW8N2KUNCNi84PeiK
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**Note**: Replace `onboarding@resend.dev` with your verified domain email once you set up a custom domain in Resend.

### Step 3: Verify Domain (Optional but Recommended)

For production, you should:
1. Add your domain in Resend dashboard
2. Verify DNS records
3. Update `RESEND_FROM_EMAIL` to use your domain (e.g., `blog@tinytalks.com`)

The email system is ready to use! When you publish a new blog post, subscribers will automatically receive beautifully formatted emails.

### Option 2: SendGrid

Similar setup with SendGrid SDK.

### Option 3: Supabase Edge Functions

Use Supabase Edge Functions with an email service provider.

## 🔧 How It Works

### For Visitors:

1. Visitor enters email (and optional name) in subscription form
2. Form submits to `/api/blog/subscribe`
3. Email is saved to `blog_email_subscriptions` table
4. Success message is shown

### For Admin (When Publishing):

1. Admin creates/updates a blog post and marks it as "Published"
2. System automatically calls `/api/blog/notify-subscribers`
3. All active subscribers are retrieved
4. Email notifications are sent (when email service is configured)
5. Admin sees confirmation message

## 📊 Managing Subscribers

You can view and manage subscribers in Supabase:

```sql
-- View all subscribers
SELECT * FROM blog_email_subscriptions ORDER BY created_at DESC;

-- View only active subscribers
SELECT * FROM blog_email_subscriptions WHERE subscribed = true;

-- Unsubscribe an email
UPDATE blog_email_subscriptions 
SET subscribed = false 
WHERE email = 'user@example.com';
```

## 🌐 Translations

The subscription form supports both English and Russian:

- **English**: `locales/en.json` → `blog.subscribe.*`
- **Russian**: `locales/ru.json` → `blog.subscribe.*`

## 🔒 Privacy & Security

- Email addresses are stored securely in Supabase
- RLS policies ensure proper access control
- Users can unsubscribe at any time
- No spam - only new blog post notifications

## 🐛 Troubleshooting

### Form not submitting:
- Check browser console for errors
- Verify API route is accessible: `/api/blog/subscribe`
- Check Supabase connection

### Notifications not sending:
- Verify email service is configured
- Check API route logs: `/api/blog/notify-subscribers`
- Ensure subscribers exist in database

### Database errors:
- Verify table was created: `SELECT * FROM blog_email_subscriptions;`
- Check RLS policies are enabled
- Verify Supabase credentials in `.env.local`

## 📝 Next Steps

1. ✅ Run the SQL migration
2. ✅ Test subscription form on blog pages
3. ⏳ Configure email service (Resend/SendGrid)
4. ⏳ Test email notifications
5. ⏳ Customize email templates

## 🎯 Features

- ✅ Email subscription form
- ✅ Duplicate email handling
- ✅ Success/error messages
- ✅ Multi-language support
- ✅ Auto-notification on publish
- ✅ Subscriber management
- ⏳ Actual email sending (needs configuration)

