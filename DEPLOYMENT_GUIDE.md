# CommX Deployment Guide

## 🌐 Environment Configuration

Your app is now configured to work seamlessly in both local development and production environments!

### Backend

- **Local**: `http://localhost:3000`
- **Production**: `https://comm-x.vercel.app`

### Frontend

The frontend automatically detects which backend to use based on where it's running:

1. **Running on `localhost`** → Uses `http://localhost:3000`
2. **Running on domain/Vercel** → Uses `https://comm-x.vercel.app`
3. **Running on LAN IP** → Uses `http://{your-ip}:3000`

## 📁 Environment Files

### Frontend Environment Variables

Three environment files have been created:

- **`.env.development`** - Used during `npm run dev`

  ```
  VITE_API_URL=http://localhost:3000
  ```

- **`.env.production`** - Used during `npm run build`

  ```
  VITE_API_URL=https://comm-x.vercel.app
  ```

- **`.env.example`** - Template for custom configurations

### Creating Custom Environment

If you need to override the default behavior:

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your custom API URL
3. The `.env.local` file is ignored by git (already in `.gitignore`)

## 🚀 Development Workflow

### Local Development

1. **Start Backend** (in `backend` folder):

   ```bash
   npm run dev
   ```

2. **Start Frontend** (in `frontend` folder):

   ```bash
   npm run dev
   ```

3. **Access**: `http://localhost:5173`
   - Frontend will automatically connect to `http://localhost:3000`

### Testing on LAN

1. **Find your local IP**:

   ```bash
   ipconfig
   ```

   Look for "IPv4 Address" (e.g., `10.1.0.222`)

2. **Access from another device**: `http://10.1.0.222:5173`
   - Frontend will automatically connect to `http://10.1.0.222:3000`

## 🔐 CORS Configuration

### Adding Production Frontend URL

When you deploy your frontend, add its URL to the backend's CORS whitelist:

1. Open `backend/server.js`
2. Add your frontend URL to `allowedOrigins`:

   ```javascript
   const allowedOrigins = [
     "http://localhost:5173",
     "http://10.1.0.222:5173",
     "https://your-frontend-domain.vercel.app", // Add this
   ];
   ```

3. Commit and push to Vercel

### Current CORS Setup

The backend automatically allows:

- ✅ Specified origins in `allowedOrigins` array
- ✅ All `localhost` URLs in development mode
- ✅ Requests with no origin (mobile apps, curl)

## 📦 Building for Production

### Frontend

```bash
cd frontend
npm run build
```

This creates an optimized build in the `dist` folder, using the production environment variables.

### Backend

Your backend is already deployed at `https://comm-x.vercel.app/`

To update:

```bash
cd backend
git push origin main
```

Vercel will automatically deploy the changes.

## 🧪 Testing the Setup

### Check Backend Connection

Open browser console on your frontend and look for:

```
🔌 Creating socket connection to: http://localhost:3000
✅ Socket connected successfully
```

### Verify Environment

Add this to any component to check which backend is being used:

```javascript
import { BASE_URL } from "./utils/constants";
console.log("Current Backend:", BASE_URL);
```

## 🐛 Troubleshooting

### CORS Errors

**Problem**: "Not allowed by CORS" in console

**Solution**:

1. Check that your frontend URL is in the `allowedOrigins` array in `backend/server.js`
2. Restart the backend server after changes
3. Clear browser cache

### Socket Connection Issues

**Problem**: Socket keeps disconnecting

**Solution**:

1. Verify backend is running
2. Check CORS configuration includes your origin
3. Look for transport errors in console
4. Backend automatically falls back to polling if WebSocket fails

### Wrong Backend URL

**Problem**: Frontend connecting to wrong backend

**Solution**:

1. Check your environment variables
2. Clear `.env.local` if you created one for testing
3. Hard refresh the browser (Ctrl+F5)

## 📝 Notes

- Environment variables are loaded at **build time** for Vite
- Changes to `.env` files require a restart of the dev server
- `.env.local` takes precedence over `.env.development` and `.env.production`
- The automatic detection (in `constants.js`) works as a fallback if no env vars are set
