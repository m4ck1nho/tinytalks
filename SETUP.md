# TinyTalks Setup Guide

Step-by-step guide to get your TinyTalks website up and running.

## Step 1: Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "TinyTalks" (or your preferred name)
4. Disable Google Analytics for now (or enable if you want)
5. Click "Create project"

### Enable Firestore Database

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your preferred location (choose closest to your target audience)
5. Click "Enable"

### Enable Authentication

1. In Firebase Console, click "Authentication"
2. Click "Get started"
3. Click "Email/Password" provider
4. Enable "Email/Password"
5. Click "Save"

### Enable Storage

1. In Firebase Console, click "Storage"
2. Click "Get started"
3. Use default security rules (we'll update them later)
4. Click "Done"

### Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register app with nickname "TinyTalks Web"
5. Copy the `firebaseConfig` object values

### Create Admin User

1. In Firebase Console, go to "Authentication"
2. Click "Users" tab
3. Click "Add user"
4. Enter your admin email and password
5. Click "Add user"

## Step 2: Environment Variables

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your Firebase config values:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_from_firebase
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## Step 3: Firebase Security Rules

### Firestore Rules

1. Go to Firebase Console → Firestore Database → Rules
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Blog posts
    match /blog_posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Contact messages
    match /contact_messages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Reviews
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

### Storage Rules

1. Go to Firebase Console → Storage → Rules
2. Replace the rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /blog-images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /blog-featured/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

## Step 4: Google Analytics (Optional)

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get your Measurement ID (starts with G-)
4. Add it to `.env.local`:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

## Step 5: Add Images

1. Prepare two professional photos:
   - `teacher-hero.jpg` (1200x800px, landscape)
   - `teacher-about.jpg` (800x1200px, portrait)

2. Place them in `public/images/` directory

3. Or download free stock photos from:
   - [Unsplash](https://unsplash.com/)
   - [Pexels](https://pexels.com/)

## Step 6: Install Dependencies

```bash
npm install
```

## Step 7: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 8: Test Admin Panel

1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with your Firebase admin credentials
3. Explore the dashboard, create a test blog post, etc.

## Step 9: Customize Content

### Update Text Content

Edit these files to customize your website content:

- `components/public/Hero.tsx` - Hero section text
- `components/public/About.tsx` - About section bio
- `components/public/Pricing.tsx` - Pricing plans
- `components/public/Reviews.tsx` - Testimonials
- `components/public/Contact.tsx` - Contact information

### Update Pricing

Edit `components/public/Pricing.tsx`:
- Modify the `plans` array
- Change prices, features, descriptions

### Update Reviews

Edit `components/public/Reviews.tsx`:
- Modify the `reviews` array
- Add real testimonials from students

### Update Contact Info

Edit `components/public/Contact.tsx`:
- Change email, phone, social media links

## Step 10: Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Click "Import Project"
4. Select your GitHub repository
5. Add all environment variables from `.env.local`
6. Click "Deploy"

Your site will be live in minutes!

## Troubleshooting

### Firebase Connection Issues
- Check that all environment variables are correct
- Verify Firebase project is active
- Check browser console for specific errors

### Images Not Showing
- Verify images are in `public/images/` directory
- Check image filenames match exactly
- Ensure images are web-optimized (< 1MB)

### Admin Login Not Working
- Verify admin user exists in Firebase Authentication
- Check that email/password match
- Ensure Authentication is enabled in Firebase

### Build Errors
- Run `npm install` again
- Delete `node_modules` and `.next` folders
- Clear npm cache: `npm cache clean --force`

## Next Steps

1. ✅ Set up Firebase
2. ✅ Configure environment variables
3. ✅ Add images
4. ✅ Customize content
5. ✅ Test admin panel
6. ✅ Deploy to Vercel
7. 📧 Configure custom domain
8. 📊 Monitor analytics
9. 📝 Create blog content
10. 🚀 Launch and share!

## Support

If you need help:
1. Check the main README.md
2. Review Firebase documentation
3. Check Next.js documentation
4. Review error messages in browser console

---

Good luck with your English course website! 🎓

