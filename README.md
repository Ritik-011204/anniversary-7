# 7 Years… and still you ♡

An interactive, cinematic 3D anniversary microsite.

## Quick Start

### Option 1 — Local Server (recommended)
```bash
npx serve .
```
Then open `http://localhost:3000` in your browser.

### Option 2 — VS Code Live Server
Install the **Live Server** extension, right-click `index.html` → *Open with Live Server*.

### Option 3 — Direct File
Double-click `index.html`. Note: some browsers may block local image loading.

---

## How to Customize

### 1. Replace Photos
- Place your photos in `assets/images/`.
- Recommended: JPG or WebP, max 800 px wide.
- Open `js/config.js` and update the `photos` object with your file names and captions.

### 2. Edit Text Content
- Open `index.html` and search for `<!-- EDIT:` comments.
- Each chapter's titles and paragraphs are marked for easy editing.

### 3. Write Your Letter
- Open `js/config.js` and edit the `letter` array.

### 4. Add Music
- Place an MP3 file at `assets/music/our-song.mp3` (or change the path in `config.js`).

### 5. Set Your Names & Date
- Open `js/config.js` and edit `names` and `anniversary`.

---

## File Structure

```
├── index.html          ← Page structure & text content
├── css/styles.css      ← All styling
├── js/
│   ├── config.js       ← ⭐ Your photos, names, letter, music
│   ├── scene.js        ← Three.js 3D engine + particles
│   ├── chapters.js     ← Chapter 3D objects + scroll animations
│   ├── ui.js           ← Navigation, music player, modals
│   └── app.js          ← Initialization
├── assets/
│   ├── images/         ← Your photos here
│   └── music/          ← Your music here
```

---

## Performance Tips

- Compress images to ≤ 200 KB each (use [Squoosh](https://squoosh.app))
- Use WebP format for smaller file sizes
- On slow devices, reduce particle counts in `config.js → performance`

---

## Deployment

### Netlify (free)
1. Drag the entire project folder onto [netlify.com/drop](https://app.netlify.com/drop)
2. Done — you get a shareable URL

### GitHub Pages (free)
1. Push to a GitHub repo
2. Settings → Pages → Source: main branch
3. Your site is live at `https://username.github.io/repo-name`

### Vercel (free)
1. `npx vercel` in the project folder
2. Follow the prompts

---

## Tech Stack

- **Three.js** — 3D rendering
- **GSAP + ScrollTrigger** — Scroll-driven animation
- **Vanilla HTML/CSS/JS** — No framework, easy to edit

---

Made with ♡
