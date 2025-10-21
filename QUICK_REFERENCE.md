# Quick Reference Card

## 🚀 Common Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Building
npm run build        # Build for production
npm start            # Run production build locally

# Linting
npm run lint         # Check code quality
```

## 📁 Important Files

### Configuration
- `.env.local` - Environment variables (Firebase, Analytics)
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `next.config.ts` - Next.js config

### Content to Customize
- `components/public/Hero.tsx` - Hero section text
- `components/public/About.tsx` - Teacher bio
- `components/public/Pricing.tsx` - Pricing plans
- `components/public/Reviews.tsx` - Testimonials
- `components/public/Contact.tsx` - Contact info
- `components/public/Footer.tsx` - Footer links

### Firebase
- `lib/firebase.ts` - Firebase configuration
- `lib/analytics.ts` - Google Analytics setup

## 🔗 Important URLs

### Local Development
- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`
- Admin dashboard: `http://localhost:3000/admin/dashboard`
- Blog management: `http://localhost:3000/admin/blog`
- Messages inbox: `http://localhost:3000/admin/messages`

### External Services
- Firebase Console: https://console.firebase.google.com
- Vercel Dashboard: https://vercel.com/dashboard
- Google Analytics: https://analytics.google.com

## 🔥 Firebase Collections

### blog_posts
```typescript
{
  title: string
  content: string (HTML)
  excerpt: string
  image: string (URL)
  slug: string
  metaDescription: string
  published: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### contact_messages
```typescript
{
  name: string
  email: string
  message: string
  read: boolean
  createdAt: Timestamp
}
```

## 🎨 Customization Quick Tips

### Change Colors
Edit `app/globals.css` - Look for color values like:
- `#2563eb` (blue)
- `#7c3aed` (purple)
- `#10b981` (green)

### Update Pricing
Edit `components/public/Pricing.tsx`:
```typescript
const plans = [
  {
    name: 'Plan Name',
    price: '1,000',
    currency: '₽',
    // ...
  }
]
```

### Add Social Links
Edit `components/public/Footer.tsx` and `components/public/Contact.tsx`

### Update Stats
Edit `components/public/Hero.tsx` - Line ~47

## 🔧 Troubleshooting

### "Firebase not configured"
→ Check `.env.local` has all Firebase variables

### "Cannot find module"
→ Run `npm install`

### Build fails
→ Run `rm -rf .next node_modules && npm install && npm run build`

### Images not showing
→ Ensure files in `public/images/` directory

### Admin login fails
→ Verify admin user exists in Firebase Console → Authentication

## 📊 Firestore Security Rules

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
  }
}
```

## 🗄️ Storage Security Rules

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

## 📦 Deploy to Vercel

```bash
# Method 1: GitHub
git push origin main
# Then import in Vercel dashboard

# Method 2: CLI
vercel --prod
```

## 🔐 Environment Variables Template

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## 💡 Quick Tips

1. **Test contact form** - Messages save to Firestore
2. **Blog posts** - Publish to show on homepage
3. **Images** - Upload via blog editor or add to Storage
4. **Responsive** - Test on mobile from start
5. **Analytics** - Add GA4 ID to track visitors

## 🆘 Need Help?

1. Check `README.md` for full documentation
2. See `SETUP.md` for step-by-step setup
3. Review `CHECKLIST.md` for verification
4. Check browser console for errors
5. Review Firebase Console logs

## 📝 Content Checklist

Before launch:
- [ ] Add teacher photos
- [ ] Update bio text
- [ ] Set correct prices
- [ ] Update contact info
- [ ] Add real testimonials
- [ ] Create 2-3 blog posts
- [ ] Test all forms
- [ ] Verify Firebase works

---

**Keep this file handy for quick reference! 📌**

