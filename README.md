# ASCII Portfolio (React + Vite)
npm install && npm run dev   — build: npm run build
Edit your content in src/data.js. Koi + hover grid: src/components/Hero.jsx.
v1.2: butterflies in Butterflies.jsx, blue ripple in Hero.jsx. Optional portrait: public/portrait.jpg

## v1.3 — where to edit
- src/data.js: name, greeting, title, tagline, email, links (hero + contact), projects[], jobs[], about{text,rows}
- Projects: add/remove objects in `projects` (title, kind: noise|lines|rings|waves, tag, desc, stack[], url)
- Experience: add/remove objects in `jobs`; each becomes a cactus the dino jumps
- About: `about.text` paragraphs and `about.rows` (label/value); letter in AsciiPortrait.jsx
- Nav labels: Navbar.jsx · page title: index.html · butterfly count: Butterflies.jsx
- Technologies: edit the `tech` array in src/data.js (just names). Nav label: Navbar.jsx
- Music: put your audio in public/audio/ and set `music` in src/data.js. Butterfly count: `area` in src/butterflies/butterflies.js
- Butterflies: src/butterflies/ (flock.js world, butterflies.js animal, pen.js renderer). Count: `area`/`max` in butterflies.js. Greeting: `me.hello` in data.js
- v1.8: scatter radius/strength in flock.js (STARTLE_RADIUS) + butterflies.js startle()
