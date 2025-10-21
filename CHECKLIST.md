# TinyTalks Setup Checklist

Use this checklist to ensure everything is configured correctly.

## 📋 Initial Setup

### 1. Dependencies
- [ ] Node.js 18+ installed
- [ ] `npm install` completed successfully
- [ ] No installation errors

### 2. Firebase Project
- [ ] Firebase account created
- [ ] New project created (name: TinyTalks or similar)
- [ ] Firestore Database enabled (production mode)
- [ ] Authentication enabled (Email/Password)
- [ ] Storage enabled
- [ ] Firebase config copied from project settings

### 3. Environment Variables
- [ ] `.env.local` file created (copy from `.env.local.example`)
- [ ] All Firebase credentials added:
  - [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
  - [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- [ ] Google Analytics ID added (optional): `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### 4. Firebase Security Rules

#### Firestore Rules
- [ ] Opened Firebase Console → Firestore → Rules
- [ ] Pasted rules from `SETUP.md`
- [ ] Published rules
- [ ] No errors in Firebase Console

#### Storage Rules
- [ ] Opened Firebase Console → Storage → Rules
- [ ] Pasted rules from `SETUP.md`
- [ ] Published rules
- [ ] No errors in Firebase Console

### 5. Admin User
- [ ] Created admin user in Firebase Authentication
- [ ] Email and password recorded securely
- [ ] User shows in Authentication → Users tab

## 🎨 Content Customization

### Images
- [ ] `public/images/teacher-hero.jpg` added (1200x800px)
- [ ] `public/images/teacher-about.jpg` added (800x1200px)
- [ ] Images optimized for web (< 500KB each)

### Text Content
- [ ] Hero section text updated (`components/public/Hero.tsx`)
- [ ] About section bio updated (`components/public/About.tsx`)
- [ ] Pricing plans customized (`components/public/Pricing.tsx`)
- [ ] Contact information updated (`components/public/Contact.tsx`)
- [ ] Footer links updated (`components/public/Footer.tsx`)

### Reviews
- [ ] Reviews updated with real testimonials (`components/public/Reviews.tsx`)
- [ ] Names and content verified
- [ ] Ratings set appropriately

## 🧪 Testing

### Local Development
- [ ] `npm run dev` starts without errors
- [ ] Site accessible at http://localhost:3000
- [ ] No console errors in browser
- [ ] All sections visible on homepage

### Public Website
- [ ] Hero section displays correctly
- [ ] About section shows teacher info
- [ ] Pricing cards render properly
- [ ] Reviews display
- [ ] Blog preview section visible (may be empty initially)
- [ ] Contact form renders
- [ ] Footer displays

### Contact Form
- [ ] Fill out contact form
- [ ] Submit form
- [ ] Success message appears
- [ ] Message visible in Firebase Console → Firestore → contact_messages

### Admin Panel
- [ ] Navigate to http://localhost:3000/admin/login
- [ ] Login with admin credentials
- [ ] Redirects to dashboard
- [ ] Dashboard shows stats
- [ ] No authentication errors

### Blog Management
- [ ] Navigate to Admin → Blog Posts
- [ ] Click "New Post"
- [ ] Create test post with:
  - [ ] Title
  - [ ] Excerpt
  - [ ] Content (use editor toolbar)
  - [ ] Featured image
  - [ ] Publish checkbox
- [ ] Save post
- [ ] Post appears in blog list
- [ ] Post visible in Firebase Console → Firestore → blog_posts
- [ ] Published post shows on homepage (blog preview section)

### Blog Editor Features
- [ ] Bold text works
- [ ] Italic text works
- [ ] Headings work (H2, H3)
- [ ] Bullet lists work
- [ ] Image upload works
- [ ] Links work

### Messages Inbox
- [ ] Navigate to Admin → Messages
- [ ] Test message from contact form visible
- [ ] Click message to view details
- [ ] Mark as read/unread works
- [ ] Delete message works

### Mobile Responsiveness
- [ ] Test on mobile device or browser dev tools
- [ ] All sections stack properly
- [ ] Navigation works on mobile
- [ ] Forms usable on mobile
- [ ] Admin panel responsive

## 🚀 Pre-Deployment

### Build
- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Build output shows all pages

### Content Verification
- [ ] All text reviewed for typos
- [ ] Contact information correct
- [ ] Prices accurate
- [ ] Social media links correct
- [ ] Email addresses correct

### SEO
- [ ] Page title set in `app/layout.tsx`
- [ ] Meta description set
- [ ] Images have alt text
- [ ] Links are descriptive

### Google Analytics (Optional)
- [ ] GA4 property created
- [ ] Tracking ID added to `.env.local`
- [ ] Tracking verified in GA dashboard

## 📦 Deployment

### Vercel Setup
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported from GitHub

### Environment Variables (Vercel)
- [ ] All environment variables added in Vercel project settings
- [ ] Variables match `.env.local`
- [ ] Saved successfully

### Deployment
- [ ] Triggered deployment
- [ ] Build completed successfully
- [ ] No build errors in Vercel logs
- [ ] Production URL received

### Post-Deployment Testing
- [ ] Visit production URL
- [ ] Test all pages
- [ ] Test contact form
- [ ] Test admin login
- [ ] Create test blog post
- [ ] Verify Firebase integration works
- [ ] Check mobile responsiveness
- [ ] Test in different browsers

### Domain Setup (Optional)
- [ ] Custom domain purchased
- [ ] Domain added in Vercel
- [ ] DNS configured
- [ ] HTTPS certificate active
- [ ] Domain added to Firebase authorized domains

## 🎯 Post-Launch

### Content
- [ ] Create 3-5 initial blog posts
- [ ] Add real student testimonials
- [ ] Update images with professional photos

### Marketing
- [ ] Share on social media
- [ ] Add to email signature
- [ ] Create business cards with URL
- [ ] Add to online profiles

### Monitoring
- [ ] Check Google Analytics weekly
- [ ] Review contact form submissions
- [ ] Monitor Firebase usage
- [ ] Check Vercel analytics

### Maintenance
- [ ] Respond to contact messages promptly
- [ ] Publish blog posts regularly
- [ ] Update pricing as needed
- [ ] Keep dependencies updated monthly

## ✅ Final Verification

- [ ] Site loads fast (< 3 seconds)
- [ ] No broken links
- [ ] Images load properly
- [ ] Forms submit successfully
- [ ] Admin panel functional
- [ ] Mobile-friendly
- [ ] SEO tags present
- [ ] Analytics tracking
- [ ] Contact info correct
- [ ] Ready for production! 🎉

## 🆘 If Something's Wrong

### Site Won't Build
- Check for syntax errors
- Verify all dependencies installed
- Review build logs for specific errors

### Firebase Not Working
- Verify environment variables
- Check Firebase Console for errors
- Review security rules
- Ensure Firebase project is active

### Admin Login Fails
- Verify admin user exists in Firebase
- Check credentials
- Review browser console for errors
- Ensure environment variables correct

### Images Not Showing
- Verify image files in `public/images/`
- Check file names match code
- Ensure images are < 2MB
- Check file formats (JPG/PNG)

## 📚 Documentation Reference

- **README.md** - Full documentation
- **SETUP.md** - Detailed setup guide
- **QUICKSTART.md** - Quick start (5 min)
- **DEPLOYMENT.md** - Deployment guide
- **PROJECT_SUMMARY.md** - Project overview

---

**Good luck with your English course website! 📚✨**

