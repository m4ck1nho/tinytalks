# Testing Email Subscription Feature

## ✅ Quick Verification Checklist

### 1. Database Setup
- [ ] Run `docs/blog-email-subscriptions.sql` in Supabase SQL Editor
- [ ] Verify table exists: `SELECT * FROM blog_email_subscriptions LIMIT 1;`

### 2. Environment Variables
- [ ] `RESEND_API_KEY` is set in `.env.local`
- [ ] `RESEND_FROM_EMAIL` is set (default: `onboarding@resend.dev`)
- [ ] Restart your dev server after adding env variables

### 3. Dependencies
- [ ] Run `npm install` to install `resend` package
- [ ] Check `node_modules/resend` exists

### 4. Test Subscription Form
- [ ] Visit `/blog` page
- [ ] Scroll to bottom, see subscription form
- [ ] Enter your email and subscribe
- [ ] See success message
- [ ] Check Supabase: `SELECT * FROM blog_email_subscriptions;`

### 5. Test Email Notification
- [ ] Go to `/admin/blog`
- [ ] Create a new blog post
- [ ] Check "Publish immediately"
- [ ] Save the post
- [ ] Check browser console for: `📧 Email notification results: X sent, Y failed`
- [ ] Check your email inbox for the notification

## 🧪 Manual Test Steps

### Test 1: Subscribe to Blog
1. Visit `http://localhost:3000/blog`
2. Scroll to the subscription form at the bottom
3. Enter your email (e.g., `gkdnzkrks@gmail.com`)
4. Optionally enter your name
5. Click "Subscribe"
6. You should see: "Successfully subscribed!"

### Test 2: Verify in Database
Run in Supabase SQL Editor:
```sql
SELECT email, name, subscribed, created_at 
FROM blog_email_subscriptions 
ORDER BY created_at DESC;
```

You should see your email in the list.

### Test 3: Publish a Blog Post
1. Go to `http://localhost:3000/admin/blog`
2. Click "New Post"
3. Fill in:
   - Title: "Test Post for Email Notification"
   - Excerpt: "This is a test to verify email notifications work"
   - Content: "Some test content here..."
   - Check "Publish immediately"
4. Click "Save"
5. Check the browser console (F12) for logs:
   - Should see: `📧 Subscribers notified: 1 emails sent`
   - Or: `📧 Email notification results: 1 sent, 0 failed`

### Test 4: Check Your Email
1. Check your inbox (the email you subscribed with)
2. You should receive an email with:
   - Subject: "New Blog Post: Test Post for Email Notification"
   - TinyTalks branding (orange/blue gradient header)
   - Blog post title and excerpt
   - "Read Full Article" button
   - Links to blog and main site

## 🐛 Troubleshooting

### Issue: "Email service not configured"
**Solution**: 
- Make sure `RESEND_API_KEY` is in `.env.local`
- Restart your dev server: `npm run dev`

### Issue: "No active subscribers to notify"
**Solution**: 
- Make sure you subscribed first (Test 1)
- Check database: `SELECT * FROM blog_email_subscriptions WHERE subscribed = true;`

### Issue: Emails not sending
**Solution**:
- Check Resend dashboard for errors
- Verify API key is correct
- Check browser console for error messages
- Make sure `RESEND_FROM_EMAIL` is set (can use `onboarding@resend.dev` for testing)

### Issue: Form not submitting
**Solution**:
- Check browser console for errors
- Verify `/api/blog/subscribe` route exists
- Check Supabase connection

## 📧 Email Preview

The email you receive will look like:

```
┌─────────────────────────────────────┐
│  [TinyTalks - Orange/Blue Gradient] │
│  TinyTalks                          │
├─────────────────────────────────────┤
│  Hello [Your Name],                 │
│                                     │
│  New Blog Post: [Post Title]        │
│                                     │
│  [Post Excerpt]                     │
│                                     │
│  [Read Full Article →] (button)     │
│                                     │
│  ─────────────────────────────      │
│  You're receiving this because...   │
│  Visit our blog | Visit TinyTalks   │
└─────────────────────────────────────┘
```

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Subscription form shows success message
- ✅ Email appears in `blog_email_subscriptions` table
- ✅ Console shows: `📧 Email notification results: X sent, 0 failed`
- ✅ You receive a formatted email in your inbox
- ✅ Email has correct styling and links work

## 🚀 Next Steps

Once testing is successful:
1. Add more subscribers (test with different emails)
2. Publish a real blog post
3. Verify all subscribers receive emails
4. Consider setting up a custom domain in Resend for production


