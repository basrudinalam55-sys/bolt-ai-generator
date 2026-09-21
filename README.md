# Bolt AI Image Generator

Free, unlimited AI image generation powered by **Pollinations AI**. No signup, no API keys, no limits. Mobile-first PWA ready for shared hosting.

## Features

- ⚡ **Free & Unlimited** — Pollinations AI (Flux, SDXL, GPT-Image, Midjourney, DALL-E 3)
- 📱 **Mobile-First PWA** — Installable, offline-ready, responsive
- 🎨 **Multiple Models** — Flux (best), SDXL, GPT-Image, Midjourney style, DALL-E 3 style
- 📐 **Aspect Ratios** — Square, Portrait, Landscape, Story (9:16), Video (16:9), Ultrawide
- 💾 **History** — Local storage, persist across sessions
- 📥 **Download/Share** — One-click download, copy URL
- 🌙 **Dark Theme** — Bolt orange accent, glass morphism UI
- 🔧 **Zero Config** — No API keys, no environment variables needed

## Tech Stack

- **Next.js 14** (App Router, `output: 'standalone'`)
- **React 18** + TypeScript
- **Tailwind CSS** (custom bolt theme)
- **Pollinations AI** (free, no key)
- **Lucide React** (icons)
- **PWA** (manifest, service worker ready)

## Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev
# Open http://localhost:3000

# Production build
npm run build

# Start production server
npm start
```

## Deploy to Hostinger Shared Hosting (Node.js)

### 1. Build Locally
```bash
npm install
npm run build
```
This creates `.next/standalone/` — everything needed to run.

### 2. Upload to Hostinger

**Option A: Git Deploy (Recommended)**
1. Push this repo to GitHub
2. Hostinger hPanel → **Git** → Create Repository
3. Repository URL: `https://github.com/yourusername/bolt-ai-generator.git`
4. Branch: `main`
4. Deploy Path: `/domains/yourdomain.com/public_html/bolt-ai`
5. Click **Deploy**

**Option B: FTP/SFTP**
```bash
# Zip the deployment files
zip -r deploy.zip .next/standalone public server.js package.json

# Upload via File Manager → Extract
```

### 3. Configure Node.js App in hPanel

1. **Hosting → Manage → Advanced → Node.js**
2. **Create Application:**
   - Node.js version: **20.x**
   - Application mode: **Production**
   - Application root: `/domains/yourdomain.com/public_html/bolt-ai`
   - Application URL: `https://yourdomain.com` (or subdomain)
   - Startup file: `server.js`
3. **Click Create**

### 4. Restart & Test
- Click **Restart** in Node.js app
- Visit `https://yourdomain.com` → Works!

---

## Project Structure

```
bolt-ai-generator/
├── public/
│   ├── site.webmanifest      # PWA manifest
│   ├── icon.svg              # App icon
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── globals.css       # Bolt theme, animations
│   │   ├── layout.tsx        # Root layout, SEO, fonts
│   │   └── page.tsx          # Main generator UI
│   ├── lib/
│   │   └── pollinations.ts   # Pollinations API client
│   └── components/           # (UI components if needed)
├── server.js                 # Standalone server for Hostinger
├── next.config.js            # output: 'standalone'
├── tailwind.config.js        # Bolt theme config
├── tsconfig.json
└── package.json
```

---

## SEO Features (OpenSEO Ready)

- **Meta tags**: title, description, keywords, author
- **Open Graph**: og:title, og:description, og:image, og:url
- **Twitter Cards**: summary_large_image
- **JSON-LD**: WebApplication schema
- **PWA**: manifest, theme-color, apple-mobile-web-app
- **Semantic HTML**: proper heading hierarchy, alt texts
- **Performance**: `output: 'standalone'`, optimized images

---

## API Reference (Pollinations)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | required | Image description |
| `width` | number | 1024 | Image width |
| `height` | number | 1024 | Image height |
| `model` | string | 'flux' | flux, gptimage, sdxl, midjourney, dalle3 |
| `seed` | number | random | Reproducible results |
| `nologo` | boolean | true | Remove watermark |
| `private` | boolean | true | Don't show in public feed |
| `enhance` | boolean | true | Auto-enhance prompt |
| `safe` | boolean | true | SFW filter |

**Direct URL format:**
```
https://image.pollinations.ai/prompt/{prompt}?width=1024&height=1024&model=flux&nologo=true&private=true&enhance=true
```

---

## Customization

### Change Theme Colors
Edit `tailwind.config.js` → `theme.extend.colors.primary`

### Add Models
Edit `src/lib/pollinations.ts` → `MODELS` object

### Add Aspect Ratios
Edit `src/lib/pollinations.ts` → `ASPECT_RATIOS` object

### Add Prompt Templates
Edit `src/lib/pollinations.ts` → `PROMPT_TEMPLATES` array

---

## License

MIT — Free to use, modify, distribute.

---

## Credits

- **Pollinations AI** — Free image generation API
- **Next.js** — React framework
- **Tailwind CSS** — Utility-first styling
- **Lucide** — Beautiful icons