# TinyTalks English Course Website

A modern, full-featured website for TinyTalks English course with an integrated admin panel for managing content, blog posts, and contact messages.

## Features

### Public Website
- **Hero Section**: Eye-catching introduction with course highlights
- **About Section**: Teacher introduction and methodology
- **Pricing Plans**: Three flexible course options (Group, Private, Intensive)
- **Student Reviews**: Testimonials and success stories
- **Blog Preview**: Latest articles and learning resources
- **Contact Form**: Get in touch with course inquiries
- **Responsive Design**: Mobile-first, works beautifully on all devices

### Admin Panel
- **Dashboard**: Analytics overview and quick stats
- **Blog Management**: Create, edit, and publish blog posts with rich text editor
- **Message Inbox**: View and manage contact form submissions
- **Google Analytics Integration**: Track site traffic and user behavior
- **Secure Authentication**: Firebase-based admin login

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Rich Text Editor**: TipTap
- **Analytics**: Google Analytics 4
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase account
- Google Analytics account (optional)

### Installation

1. **Clone the repository**
   ```bash
   cd tinytalks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Enable Authentication (Email/Password provider)
   - Enable Storage
   - Copy your Firebase configuration

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Firebase and Google Analytics credentials:
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

5. **Add placeholder images**
   Place the following images in the `public/images/` directory:
   - `teacher-hero.jpg` - Main hero section image
   - `teacher-about.jpg` - About section image
   
   Or use the provided placeholders.

6. **Create Firebase admin user**
   - Go to Firebase Console → Authentication
   - Click "Add user"
   - Create an admin account with email and password

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   - Public site: [http://localhost:3000](http://localhost:3000)
   - Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Firebase Security Rules

### Firestore Rules
Add these rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Blog posts - read public, write authenticated
    match /blog_posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Contact messages - create public, read/write authenticated
    match /contact_messages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Reviews - read public, write authenticated
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules
Add these rules in Firebase Console → Storage → Rules:

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

## Project Structure

```
tinytalks/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── blog/          # Blog management
│   │   ├── dashboard/     # Analytics dashboard
│   │   ├── messages/      # Contact messages
│   │   ├── login/         # Admin login
│   │   └── layout.tsx     # Admin layout with auth
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Public homepage
├── components/
│   ├── admin/             # Admin components
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── BlogEditor.tsx
│   │   └── MessageList.tsx
│   └── public/            # Public website components
│       ├── About.tsx
│       ├── BlogPreview.tsx
│       ├── Contact.tsx
│       ├── Footer.tsx
│       ├── Hero.tsx
│       ├── Pricing.tsx
│       └── Reviews.tsx
├── lib/
│   ├── analytics.ts       # Google Analytics setup
│   └── firebase.ts        # Firebase configuration
├── types/
│   └── index.ts           # TypeScript interfaces
└── public/
    └── images/            # Image assets
```

## Usage

### Admin Panel

1. **Login**: Navigate to `/admin/login` and sign in with your Firebase credentials

2. **Dashboard**: View site statistics and quick actions

3. **Blog Management**:
   - Create new posts with rich text editor
   - Upload images
   - Set SEO metadata
   - Publish or save as draft

4. **Messages**:
   - View contact form submissions
   - Mark as read/unread
   - Reply via email
   - Delete messages

### Customization

#### Update Content
- Edit component files in `components/public/` to customize text
- Modify pricing in `components/public/Pricing.tsx`
- Update reviews in `components/public/Reviews.tsx`

#### Styling
- Colors and design tokens are in `app/globals.css`
- Tailwind utilities available throughout

#### Images
- Replace placeholder images in `public/images/`
- Recommended sizes:
  - Hero image: 1200x800px
  - About image: 800x1200px

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

All required environment variables are documented in `.env.local.example`. 

**Important**: Never commit `.env.local` to version control!

## Support

For issues or questions:
- Email: info@tinytalks.com
- Check Firebase Console for backend issues
- Review Next.js documentation for frontend issues

## License

© 2024 TinyTalks. All rights reserved.

## Development Notes

- Firebase collections are created automatically on first write
- Admin authentication is required for all admin routes
- Blog posts support HTML content via TipTap editor
- Images are stored in Firebase Storage
- Contact form submissions are stored in Firestore

---

Built with ❤️ for English learners worldwide
