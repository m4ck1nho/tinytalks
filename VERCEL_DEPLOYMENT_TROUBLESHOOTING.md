# 🚀 Vercel Deployment Troubleshooting Guide

## Current Issues
1. ❌ Images not showing on deployed site
2. ❌ Blog post links not opening when clicked

## ✅ Quick Fix Steps

### Step 1: Force Redeploy on Vercel

The changes are in your Git repository, but Vercel needs to rebuild with the new configuration:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your TinyTalks project**
3. **Click "Deployments" tab**
4. **Find the latest deployment** (should be at the top)
5. **Click the three dots (⋯)** on the right side
6. **Click "Redeploy"**
7. **Select "Use existing Build Cache"** checkbox - **UNCHECK IT**
8. **Click "Redeploy"** button
9. **Wait for build to complete** (usually 2-3 minutes)

**Why?** The `next.config.ts` changes require a fresh build to take effect.

---

### Step 2: Check Deployment Logs

While it's building, check for errors:

1. **Click on the deployment** (the one that's building)
2. **Click "Building" or "Logs"** tab
3. **Look for any errors** (red text)
4. **Common errors to watch for:**
   - ❌ Build failed
   - ❌ Module not found
   - ❌ Type errors
   - ❌ Image optimization errors

---

### Step 3: Verify Environment Variables

Make sure your Supabase credentials are set:

1. **In Vercel Dashboard** → Your Project
2. **Click "Settings"** tab
3. **Click "Environment Variables"** in sidebar
4. **Verify these exist:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **If missing**, add them:
   - Click "Add New"
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase URL (from Supabase Dashboard → Settings → API)
   - Environment: Production, Preview, Development (check all)
   - Click "Save"
   - Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**After adding variables**, you MUST redeploy (go back to Step 1)!

---

### Step 4: Test Your Site

After deployment completes:

1. **Open your Vercel URL**: `https://your-project.vercel.app`
2. **Hard refresh**: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)
3. **Test images**: Scroll to blog section - images should show
4. **Test blog links**: Click "Read More" on a blog post - should open full article

---

## 🔍 Detailed Diagnostics

### If Images Still Don't Show:

**Check Browser Console:**
1. Press F12 to open Developer Tools
2. Go to "Console" tab
3. Look for errors related to images
4. Look for errors like:
   - ❌ "Failed to load resource"
   - ❌ "Image optimization error"
   - ❌ "CORS error"

**Check Network Tab:**
1. F12 → Network tab
2. Refresh page
3. Filter by "Img"
4. Look for failed image requests (red status)
5. Click on failed request to see details

**Verify Image URLs:**
1. Right-click on broken image area
2. "Inspect" or "Inspect Element"
3. Look at the `src` attribute
4. Should be: `https://yourid.supabase.co/storage/v1/object/public/blog-images/...`
5. Copy URL and paste in new tab - does it load?

---

### If Blog Links Don't Work:

**Check the Link:**
1. Hover over "Read More" button
2. Look at bottom-left of browser
3. Should show: `https://your-site.vercel.app/blog/post-slug`
4. Does it show the correct URL?

**Try Direct URL:**
1. Copy a blog post URL manually
2. Example: `https://your-site.vercel.app/blog/your-post-slug`
3. Paste in browser and press Enter
4. Does it load now?

**Check 404 Errors:**
1. If you get 404 on blog post page
2. The dynamic route might not have deployed
3. Try Step 1 again (force redeploy without cache)

---

## 🛠️ Advanced Troubleshooting

### Verify Build on Vercel:

1. **Vercel Dashboard** → Deployments → Latest deployment
2. **Click "Building" tab**
3. **Look for these success messages:**
   - ✅ "Generating static pages"
   - ✅ "Route (app)" sections showing your blog routes
   - ✅ "Compiled successfully"

### Check for Dynamic Route Generation:

In the build logs, you should see:
```
○ /blog/[slug]
```

If you DON'T see this, the dynamic route isn't building correctly.

**Solution:**
- Clear Vercel build cache
- Redeploy from scratch

---

## 🚨 Common Issues & Solutions

### Issue: "Images appear locally but not on Vercel"

**Cause:** `next.config.ts` wasn't deployed or build cache is stale

**Solution:**
1. Verify `next.config.ts` has the images configuration
2. Force redeploy WITHOUT build cache (Step 1)
3. Wait for fresh build to complete

---

### Issue: "Blog post page shows 404"

**Cause:** Dynamic route folder not deployed or build failed

**Solution:**
1. Check Vercel build logs for errors
2. Verify `app/blog/[slug]/page.tsx` exists in your repo
3. Redeploy without cache
4. Check that TypeScript has no errors

---

### Issue: "Images load but are very slow"

**Cause:** Image optimization not working

**Solution:**
- This is normal for first load
- Vercel caches optimized images after first request
- Subsequent loads will be fast

---

### Issue: "Clicking blog post does nothing"

**Cause:** Client-side routing issue or JavaScript error

**Solution:**
1. Check browser console for JavaScript errors
2. Hard refresh the page (Ctrl + Shift + R)
3. Try in incognito/private window
4. Check if Link component is imported correctly

---

## ✅ Verification Checklist

After redeploying, verify:

- [ ] Deployment shows "Ready" status (not "Error")
- [ ] No errors in build logs
- [ ] Environment variables are set
- [ ] Main page loads correctly
- [ ] Blog section shows on homepage
- [ ] Blog post images appear on homepage
- [ ] Clicking "Read More" navigates to `/blog/[slug]`
- [ ] Individual blog post page loads
- [ ] Featured image appears on blog post page
- [ ] Article content displays correctly
- [ ] "Back" buttons work

---

## 🎯 Expected Behavior

### Homepage (`/`):
- Scroll to blog section
- See 3 latest published posts
- Each post shows:
  - ✅ Featured image
  - ✅ Date
  - ✅ Title
  - ✅ Excerpt
  - ✅ "Read More" button (clickable)

### Blog Post Page (`/blog/[slug]`):
- Beautiful hero section with gradient
- Featured image below hero
- Article content in white card
- "Back to Blog" buttons work
- Navigation smooth

---

## 📞 Still Not Working?

### Check These:

1. **Is the latest commit deployed?**
   - Vercel Dashboard → Deployments
   - Compare commit hash with your latest Git commit
   - Run: `git log --oneline -1` to see your latest commit

2. **Are there TypeScript errors?**
   - Locally run: `npm run build`
   - Fix any errors shown
   - Commit and push
   - Redeploy

3. **Is the Vercel project connected to correct repo?**
   - Vercel Dashboard → Settings → Git
   - Verify correct repository
   - Verify correct branch (usually "master" or "main")

4. **Try local production build:**
   ```bash
   npm run build
   npm start
   ```
   - If it works locally but not on Vercel, it's a Vercel config issue
   - If it fails locally, fix the build errors first

---

## 💡 Quick Command Reference

```bash
# Check latest commit
git log --oneline -1

# Check if files are committed
git ls-files app/blog
git ls-files next.config.ts

# Verify local build works
npm run build

# Test production build locally
npm start
```

---

## 🎉 Success Criteria

You'll know everything is working when:

1. ✅ Vercel deployment shows "Ready" 
2. ✅ Images load on homepage blog section
3. ✅ Clicking blog post opens `/blog/[slug]` page
4. ✅ Full article displays with formatting
5. ✅ Images appear on individual blog posts
6. ✅ Navigation works smoothly

---

**Most Common Fix:** Redeploy without build cache (Step 1). This solves 90% of deployment issues!

