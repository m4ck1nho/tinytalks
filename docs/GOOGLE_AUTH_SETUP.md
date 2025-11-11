# Google Authentication Setup Guide

## ✅ What's Been Done

I've set up Google authentication for your TinyTalks admin panel. Here's what was added:

1. **Auth Callback Route** - `app/auth/callback/route.ts`
2. **Google Sign-In Button** - Added to login page
3. **signInWithGoogle Method** - Added to `lib/supabase.ts`
4. **Updated Login UI** - Orange/Navy color scheme

## 🔗 Redirect URLs to Add in Supabase

Go to your **Supabase Dashboard** → **Authentication** → **URL Configuration** and add these redirect URLs:

### Development URLs:
```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
http://localhost:3002/auth/callback
http://localhost:3003/auth/callback
```

### Production URL:
```
https://your-production-domain.com/auth/callback
```
(Replace with your actual Vercel deployment URL)

## 📋 Supabase Configuration Steps

### 1. Enable Google Provider
1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click to enable it
4. You'll need Google OAuth credentials

### 2. Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add **Authorized redirect URIs:**
   ```
   https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   (Replace `YOUR_SUPABASE_PROJECT_REF` with your actual Supabase project reference)

7. Copy the **Client ID** and **Client Secret**

### 3. Add Credentials to Supabase
1. Back in Supabase → **Authentication** → **Providers** → **Google**
2. Paste your **Client ID**
3. Paste your **Client Secret**
4. Click **Save**

### 4. Add Redirect URLs in Supabase
1. Go to **Authentication** → **URL Configuration**
2. In **Redirect URLs** section, add all the URLs listed above
3. Click **Save**

## 🧪 Testing the Setup

1. Visit your admin login page: `http://localhost:3003/admin/login`
2. You should see:
   - Traditional email/password form
   - "or" divider
   - **"Sign in with Google"** button with Google logo
3. Click the Google button
4. You'll be redirected to Google to sign in
5. After signing in, you'll be redirected back to `/admin/dashboard`

## 🎨 UI Updates

The login page now features:
- Orange (#f97316) primary button
- Navy Blue (#0c4a6e) accents
- Google Sign-In button with official Google logo
- Clean "or" divider between authentication methods

## 🔐 Security Notes

- Google authentication uses OAuth 2.0
- Supabase handles all token management
- Users authenticated via Google will be created in your Supabase `auth.users` table
- You can manage authenticated users in Supabase Dashboard → **Authentication** → **Users**

## 🐛 Troubleshooting

### "Invalid redirect URL" error:
- Make sure all redirect URLs are added in Supabase URL Configuration
- Check that the URL exactly matches (including http/https)

### Google authentication not working:
- Verify Google OAuth credentials are correct in Supabase
- Check that the authorized redirect URI in Google Cloud Console matches your Supabase callback URL

### User redirected but not authenticated:
- Check browser console for errors
- Verify the callback route (`app/auth/callback/route.ts`) is working
- Make sure environment variables are set correctly

## 📝 Files Modified/Created

1. **app/auth/callback/route.ts** - NEW - Handles OAuth callback
2. **app/admin/login/page.tsx** - UPDATED - Added Google Sign-In button
3. **lib/supabase.ts** - UPDATED - Added `signInWithGoogle()` method

---

**Ready to use!** 🚀

Once you add the redirect URLs in Supabase and configure Google OAuth credentials, your Google authentication will be fully functional.

