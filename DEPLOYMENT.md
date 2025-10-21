# Deployment Guide

Quick guide to deploy TinyTalks to production.

## Vercel Deployment (Recommended)

Vercel is the recommended hosting platform for Next.js applications.

### Method 1: GitHub Integration (Easiest)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   In Vercel project settings, add all variables from `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a live URL instantly!

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Or deploy to production
vercel --prod
```

## Environment Setup

### Production Environment Variables

Ensure all environment variables are set in your deployment platform:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Custom Domain

### On Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel provides automatic HTTPS

Example DNS settings:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Firebase Configuration for Production

### Update Firebase Settings

1. **Add Production Domain to Firebase**
   - Firebase Console → Authentication → Settings
   - Add your production domain to "Authorized domains"

2. **Update Security Rules** (if needed)
   No changes needed - rules are already set for production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Images added to `public/images/`
- [ ] Content customized (text, prices, contact info)
- [ ] Firebase project set up and configured
- [ ] Admin user created in Firebase
- [ ] Firebase security rules deployed
- [ ] Tested locally with `npm run build && npm start`
- [ ] Linter passed (`npm run build`)
- [ ] All links tested
- [ ] Mobile responsiveness verified

## Post-Deployment Steps

### 1. Verify Deployment

- [ ] Visit production URL
- [ ] Test public website
- [ ] Test admin login
- [ ] Create a test blog post
- [ ] Submit a test contact form
- [ ] Check Firebase Console for data

### 2. Setup Google Analytics

1. Go to [analytics.google.com](https://analytics.google.com)
2. Verify tracking is working
3. Set up goals and conversions

### 3. Performance Optimization

- Verify images are optimized
- Check Lighthouse scores
- Enable Vercel Analytics (optional)

### 4. Monitoring

- Set up Firebase monitoring alerts
- Monitor Vercel deployment logs
- Check Google Analytics regularly

## Alternative Deployment Options

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

### Self-Hosted (VPS/Server)

```bash
# Build the application
npm run build

# Start production server
npm start
# Or use PM2 for process management
pm2 start npm --name "tinytalks" -- start
```

## Continuous Deployment

### Automatic Deployment on Git Push

With Vercel + GitHub:
- Every push to `main` branch auto-deploys
- Pull requests get preview deployments
- Zero configuration needed!

### Branch Strategy

- `main` → Production
- `develop` → Staging (optional)
- Feature branches → Preview deployments

## Rollback

### On Vercel

1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Manual Rollback

```bash
git revert HEAD
git push origin main
```

## Performance Tips

1. **Optimize Images**
   - Use WebP format
   - Compress images before upload
   - Next.js Image component handles optimization

2. **Enable Caching**
   - Vercel handles this automatically
   - Firebase CDN for Storage files

3. **Monitor Performance**
   - Use Vercel Analytics
   - Check Core Web Vitals
   - Monitor Firebase usage

## Security

1. **Environment Variables**
   - Never commit `.env.local`
   - Use Vercel environment variables
   - Rotate keys if exposed

2. **Firebase Rules**
   - Review security rules regularly
   - Test with Firebase Emulator
   - Monitor for suspicious activity

3. **Dependencies**
   - Run `npm audit` regularly
   - Update dependencies monthly
   - Monitor Dependabot alerts

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check Vercel logs for errors

### Firebase Connection Issues

- Verify environment variables are correct
- Check Firebase Console for project status
- Review browser console for specific errors

## Cost Estimation

### Vercel
- **Hobby Plan**: Free
  - Perfect for personal projects
  - 100GB bandwidth
  - Unlimited sites

- **Pro Plan**: $20/month
  - For commercial use
  - Better performance
  - Team collaboration

### Firebase
- **Spark Plan**: Free
  - 1GB storage
  - 10GB bandwidth
  - 50K reads/day

- **Blaze Plan**: Pay-as-you-go
  - Scales with usage
  - Usually < $10/month for small sites

## Support

Need help deploying?
- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Firebase Hosting: https://firebase.google.com/docs/hosting

---

Good luck with your deployment! 🚀

