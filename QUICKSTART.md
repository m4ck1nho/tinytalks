# Quick Start Guide

Get TinyTalks running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Firebase account (free tier is fine)

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Firebase

### Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project" → Name it "TinyTalks"
3. Create project

### Enable Services
1. **Firestore**: Click "Firestore Database" → "Create database" → Production mode
2. **Authentication**: Click "Authentication" → "Get started" → Enable "Email/Password"
3. **Storage**: Click "Storage" → "Get started"

### Get Config
1. Project Settings (gear icon) → Scroll to "Your apps"
2. Click web icon `</>` → Register app
3. Copy the config values

### Create Admin
1. Authentication → Users → "Add user"
2. Enter admin email/password

## 3. Configure Environment

Create `.env.local` file in project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace values with your Firebase config from step 2.

## 4. Update Security Rules

### Firestore Rules
Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blog_posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /contact_messages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules
Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 5. Add Images (Optional)

Add these to `public/images/`:
- `teacher-hero.jpg` (1200x800px)
- `teacher-about.jpg` (800x1200px)

Or use placeholder URLs temporarily.

## 6. Run!

```bash
npm run dev
```

Open:
- **Public site**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin/login

Login with the admin credentials you created in Firebase.

## 7. Customize

Edit these files:
- `components/public/Hero.tsx` - Hero text
- `components/public/About.tsx` - About/bio
- `components/public/Pricing.tsx` - Pricing
- `components/public/Contact.tsx` - Contact info

## That's it! 🎉

Your TinyTalks website is now running!

## Next Steps

- Create blog posts in admin panel
- Test contact form
- Customize content
- Deploy to Vercel (see README.md)

## Need Help?

See `SETUP.md` for detailed instructions.

