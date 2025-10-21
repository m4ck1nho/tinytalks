<!-- 86c08d1f-5427-4390-8324-aba583936100 edd5cc5b-4b4b-4709-ab92-374029108b27 -->
# TinyTalks English Course Website

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Analytics**: Google Analytics 4
- **Rich Text Editor**: React Quill or TipTap
- **Deployment**: Vercel (optimal for Next.js)

## Project Structure

```
tinytalks/
├── src/
│   ├── app/
│   │   ├── page.tsx (public homepage)
│   │   ├── admin/
│   │   │   ├── layout.tsx (admin wrapper with auth)
│   │   │   ├── dashboard/page.tsx (analytics)
│   │   │   ├── blog/page.tsx (blog management)
│   │   │   └── messages/page.tsx (contact messages)
│   │   └── api/ (Next.js API routes if needed)
│   ├── components/
│   │   ├── public/ (hero, about, pricing, reviews, blog preview, contact, footer)
│   │   └── admin/ (dashboard components, blog editor, message list)
│   ├── lib/
│   │   ├── firebase.ts (Firebase config)
│   │   └── analytics.ts (GA4 setup)
│   └── types/ (TypeScript interfaces)
├── public/ (images, assets)
└── firebase config files
```

## Implementation Steps

### 1. Project Setup

- Initialize Next.js project with TypeScript and Tailwind CSS
- Install dependencies: firebase, react-firebase-hooks, react-quill (or @tiptap/react)
- Configure Tailwind with custom colors matching TinyTalks brand
- Set up Firebase project (Firestore, Authentication, Storage)

### 2. Public Website (Homepage)

Build sections in order:

**Hero Section**

- Large banner with course headline (B1 English achievement focus)
- Professional photo of your girlfriend
- Call-to-action button
- Brief course description

**About Section**

- Photo and bio of instructor
- TinyTalks methodology and approach
- Teaching credentials/experience
- Adapted for adult beginner learners (not kids)

**Pricing Table**

- Flexible pricing options (group/private lessons)
- Clear pricing structure
- Feature comparison
- Sign-up CTAs

**Reviews Section**

- Testimonial cards
- Student success stories
- Star ratings or similar visual feedback

**Latest Blog Articles**

- Grid of 3-6 recent blog posts
- Fetch from Firestore
- Image thumbnails, title, excerpt, date
- "Read more" links

**Contact Section**

- Contact information (email, phone, social media)
- Contact form (name, email, message)
- Form submissions saved to Firestore
- Success/error notifications

**Footer**

- Quick links
- Social media icons
- Copyright info

### 3. Firebase Configuration

- Set up Firestore collections:
  - `blog_posts` (title, content, excerpt, image, date, published)
  - `contact_messages` (name, email, message, date, read)
  - `reviews` (name, content, rating, date)
  - `site_analytics` (page views tracking - basic)
- Configure Firebase Authentication (email/password for admin)
- Set up Firebase Storage for blog images
- Configure security rules

### 4. Admin Panel

**Authentication**

- Admin login page at `/admin/login`
- Protected routes using Firebase Auth
- Redirect logic for authenticated/unauthenticated users

**Dashboard Page** (`/admin/dashboard`)

- Embed Google Analytics 4 dashboard or use GA4 API
- Display key metrics: page views, users, popular pages
- Quick stats: unread messages count, published posts count

**Blog Management** (`/admin/blog`)

- List all blog posts (published/draft status)
- Create new post with rich text editor (React Quill or TipTap)
- Edit existing posts
- Delete posts
- Upload images to Firebase Storage
- SEO fields (meta description, slug)

**Messages Inbox** (`/admin/messages`)

- List all contact form submissions
- Mark as read/unread
- Delete messages
- Display sender info and message content
- Date sorting

**Admin Navigation**

- Sidebar or top nav with links to all admin sections
- Logout button

### 5. Google Analytics Integration

- Set up GA4 property
- Install `gtag.js` or use `react-ga4` package
- Track page views automatically
- Embed analytics in admin dashboard

### 6. Styling & Responsiveness

- Mobile-first responsive design
- Consistent color scheme (adapt from reference site)
- Smooth animations and transitions
- Form validation and user feedback
- Loading states

### 7. Configuration & Deployment

- Environment variables for Firebase config and GA tracking ID
- Set up `.env.local` template
- Deploy to Vercel
- Configure custom domain (if applicable)

## Key Files to Create

**Configuration**

- `src/lib/firebase.ts` - Firebase initialization
- `src/lib/analytics.ts` - GA4 setup
- `.env.local.example` - Environment variables template

**Public Components**

- `src/components/public/Hero.tsx`
- `src/components/public/About.tsx`
- `src/components/public/Pricing.tsx`
- `src/components/public/Reviews.tsx`
- `src/components/public/BlogPreview.tsx`
- `src/components/public/Contact.tsx`
- `src/components/public/Footer.tsx`

**Admin Components**

- `src/components/admin/BlogEditor.tsx`
- `src/components/admin/MessageList.tsx`
- `src/components/admin/AnalyticsDashboard.tsx`

**Pages**

- `src/app/page.tsx` - Public homepage
- `src/app/admin/login/page.tsx` - Admin login
- `src/app/admin/dashboard/page.tsx`
- `src/app/admin/blog/page.tsx`
- `src/app/admin/messages/page.tsx`

## Notes

- Content will be adapted from reference site but rewritten for adult beginner learners (not children)
- Design aesthetic matches reference but with professional adult-focused imagery and copy
- Admin email should be configured in Firebase for initial access
- Blog posts support rich formatting, images, and code blocks if needed

### To-dos

- [ ] Initialize Next.js project with TypeScript, Tailwind CSS, and install all dependencies (Firebase, analytics, rich text editor)
- [ ] Set up Firebase project, create Firestore collections, configure authentication, storage, and security rules
- [ ] Configure Google Analytics 4 and integrate tracking into the Next.js app
- [ ] Create Hero section component with course info and instructor photo
- [ ] Create About section with instructor bio and TinyTalks info
- [ ] Create Pricing table component with course options
- [ ] Create Reviews section component
- [ ] Create blog preview section that fetches latest posts from Firestore
- [ ] Create contact section with form that saves submissions to Firestore
- [ ] Create footer component with links and info
- [ ] Create admin login page and protected route logic using Firebase Auth
- [ ] Create admin dashboard with Google Analytics integration and key stats
- [ ] Create blog management interface with rich text editor for creating/editing posts
- [ ] Create messages inbox to view and manage contact form submissions
- [ ] Ensure all components are fully responsive and styled consistently
- [ ] Configure environment variables, create deployment config, and deploy to Vercel