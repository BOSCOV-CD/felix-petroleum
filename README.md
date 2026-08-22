# Felix Petroleum Website

A responsive, premium oil & gas company website for **Felix Petroleum**, using the supplied `website.mp4` as the hero video.

## Run it

No build step is required.

1. Keep the folder structure intact.
2. Open `index.html` in a modern browser.
3. For best video/browser behaviour, run a simple local server:
   - VS Code: use Live Server
   - Python: `python -m http.server 8000`
   - Then open `http://localhost:8000`

## Replace the photo slots

Go to `assets/images/` and replace the six SVG placeholders with your real images. Keep the same filenames or update the `<img src="">` paths in `index.html`.

Suggested photos:
- `terminal.svg` → depot/terminal
- `fuel-trucks.svg` → delivery trucks
- `storage.svg` → tanks/storage
- `team.svg` → Felix Petroleum team
- `community.svg` → Rivers State/community
- `contact.svg` → company/brand image

## Important

The contact form is currently front-end only. Connect it to your email service, Formspree, Netlify Forms, a backend API, or your preferred CRM before going live.

The supplied video is used locally at `assets/felix-petroleum-hero.mp4`.
