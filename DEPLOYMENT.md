# Deployment Guide

## 🚀 Deploy to GitHub

### 1. Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click **"New repository"**
3. Repository name: `campus-notifications-frontend`
4. Description: `Enhanced Campus Notifications Frontend - Priority Inbox & Management System`
5. Make it **Public** (for free deployment)
6. **Do not** initialize with README
7. Click **"Create repository"**

### 2. Push to GitHub

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/campus-notifications-frontend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy Options

#### Option 1: Vercel (Recommended) 🌟

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click **"New Project"**
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click **"Deploy"**

3. **Deploy via CLI**:
   ```bash
   vercel --prod
   ```

#### Option 2: Netlify 🌐

1. **Build for static export**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `out` folder
   - Or connect your GitHub repository

#### Option 3: GitHub Pages 📄

1. **Update next.config.js**:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   module.exports = nextConfig
   ```

2. **Build and deploy**:
   ```bash
   npm run build
   # Deploy the 'out' folder to GitHub Pages
   ```

## 🔧 Environment Variables

### For Production Deployment

Set these environment variables in your deployment platform:

```
NEXT_PUBLIC_API_URL=http://20.244.56.144/evaluation-service
NEXT_PUBLIC_ACCESS_CODE=QkbpxH
```

### Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add the variables above
4. Redeploy your application

## 📱 Access Your Deployed App

After deployment, your app will be available at:
- **Vercel**: `https://your-app-name.vercel.app`
- **Netlify**: `https://your-app-name.netlify.app`
- **GitHub Pages**: `https://your-username.github.io/campus-notifications-frontend`

## 🎯 Features After Deployment

✅ **Live URL**: Your app is accessible worldwide  
✅ **HTTPS**: Secure connection automatically  
✅ **CDN**: Fast global content delivery  
✅ **Auto-deploys**: Updates when you push to GitHub  
✅ **Preview**: Test changes before production  

## 🔄 Continuous Deployment

### Automatic Deployments (Vercel/Netlify)

1. Connect your GitHub repository
2. Enable automatic deployments
3. Every `git push` triggers a new deployment

### Manual Updates

```bash
# Make changes
git add .
git commit -m "Update: New feature"
git push origin main
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Check `package.json` scripts
2. **API Issues**: Verify environment variables
3. **Routing**: Ensure `trailingSlash: true` for static export
4. **Images**: Set `unoptimized: true` for static export

### Debug Mode

```bash
# Build with debug info
npm run build

# Check build output
ls -la out/
```

## 📊 Performance Optimization

### For Production

1. **Bundle Analysis**:
   ```bash
   npm install @next/bundle-analyzer
   ANALYZE=true npm run build
   ```

2. **Image Optimization**: Use Next.js Image component
3. **Code Splitting**: Already implemented with Next.js
4. **Caching**: Configure CDN headers

## 🔐 Security Considerations

### Production Checklist

- ✅ Environment variables set
- ✅ HTTPS enabled
- ✅ API endpoints secured
- ✅ No sensitive data in client code
- ✅ Proper CORS configuration

## 📈 Monitoring

### Vercel Analytics

1. Go to Vercel dashboard
2. Click **"Analytics"**
3. Monitor performance and usage

### Custom Monitoring

Add analytics tracking to your app:
```javascript
// Add to _app.tsx or layout.tsx
useEffect(() => {
  // Analytics tracking code
}, []);
```

---

**🎉 Your Campus Notifications Frontend is now deployed and accessible worldwide!**

For support, check the deployment platform documentation or create an issue in your GitHub repository.
