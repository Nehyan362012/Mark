
# Deployment Guide: Mark (Study & Quiz App)

This application is built with React and Vite. It is designed to be easily deployed to Vercel.

## Important: API Key Configuration

This app requires a **Google Gemini API Key** to function. 

Because this project uses a simple HTML entry point without a backend build system that automatically injects environment variables into the client code during the Vercel build process (unless configured specifically with Vite environment modes), the most reliable way to deploy this quickly is to manually configure the key.

### Step 1: Get your API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Create an API Key.

### Step 2: Configure the Key
**Option A: Hardcoding (Easiest for quick prototypes)**
1. Open `index.html`.
2. Locate the script tag at the bottom of the `<body>`:
   ```html
   <script>
     // This object is used by the Gemini API client.
     window.process = { env: { API_KEY: "__GEMINI_API_KEY__" } };
   </script>
   ```
3. Replace `__GEMINI_API_KEY__` with your actual key string (e.g., `AIzaSy...`).
4. **Warning:** This exposes your key in your source code. Restrict your API key in Google Cloud Console to your Vercel domain to prevent unauthorized use.

**Option B: Vercel Environment Variables (Secure)**
To use Vercel's Environment Variables, you would typically need to update the app to use `import.meta.env.VITE_API_KEY` instead of `process.env.API_KEY` and update the Vite config. 
*For this specific codebase which uses a `window.process` shim in `index.html`, Option A is recommended for immediate deployment.*

## Deploying to Vercel

1. **Push your code to GitHub.**
   ```bash
   git init
   git add .
   git commit -m "Ready for deploy"
   git branch -M main
   # Add your remote origin
   git push -u origin main
   ```

2. **Go to [Vercel](https://vercel.com) and sign in.**

3. **Click "Add New" -> "Project".**

4. **Select your GitHub repository.**

5. **Configure Project:**
   - **Framework Preset:** Select **Vite**.
   - **Root Directory:** Leave as `./` (or the root of your repo).

6. **Click "Deploy".**

## Setting up a Subdomain

To use a custom subdomain (e.g., `study.yourdomain.com`):

1. Go to your Project Settings in Vercel.
2. Select **"Domains"**.
3. Enter your desired domain (e.g., `study.yourdomain.com`).
4. Vercel will provide the DNS records (CNAME) you need to add to your domain registrar (GoDaddy, Namecheap, etc.).
5. Add these records to your DNS provider. Verification usually takes a few minutes.
