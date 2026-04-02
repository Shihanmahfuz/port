# Shihan Mahfuz — Personal Portfolio

Retro Win98-themed portfolio website. Static site, deployable to GitHub Pages.

## Quick Start (Local Development)

```bash
cd Pweb
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser. (Required because `fetch()` doesn't work on `file://` protocol.)

## How to Update Content

### Add a New Project

Edit `data/projects.json` — add a new entry to the `projects` array:

```json
{
  "slug": "my-new-project",
  "title": "My New Project",
  "emoji": "🚀",
  "category": "Category Name",
  "date": "Jan 2026 — Present",
  "summary": "Short one-liner for the card.",
  "longDescription": "<p>Full HTML description...</p>",
  "tags": ["Tag1", "Tag2"],
  "stats": { "Key Metric": "Value" },
  "thumbnail": "",
  "heroImage": "",
  "gradient": "background: linear-gradient(135deg, #001133, #003366);",
  "links": [{ "label": "View Live", "url": "https://example.com" }]
}
```

For project images: drop files in `assets/images/projects/` and set the `thumbnail` / `heroImage` paths.

### Add a New Writing Piece

Edit the `writings` object in `writing/index.html` — add a new key:

```js
'my-article': {
  title: 'My Article Title',
  emoji: '📝',
  description: '<p>Full HTML content of the article goes here...</p>',
  status: 'Published'
}
```

Then add a card linking to it in the Writing section of `index.html`.

### Add a New Hobby Page

Edit the `hobbies` object in `hobbies/index.html` — add a new key:

```js
'new-hobby': {
  title: 'New Hobby',
  emoji: '🎯',
  description: 'Content about this hobby...'
}
```

Then add a link in the Personal section of `index.html`.

### Update About / Experience / Skills

Edit the corresponding sections directly in `index.html`.

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to Settings → Pages → Source: Deploy from branch `main` (root `/`)
3. If deployed under a subdirectory (e.g., `username.github.io/Pweb/`), update `window.BASE_URL` in `index.html`, `projects/index.html`, `writing/index.html`, and `hobbies/index.html`

## File Structure

```
├── index.html              # Main page
├── projects/index.html     # Project detail template (reads ?id= param)
├── writing/index.html      # Writing detail template (reads ?id= param)
├── hobbies/index.html      # Hobby detail template (reads ?id= param)
├── assets/
│   ├── css/style.css       # All styles
│   ├── css/project.css     # Subpage styles (projects, writing, hobbies)
│   ├── js/main.js          # Main page JS
│   ├── js/project.js       # Project page JS
│   └── images/             # Profile & project images
├── data/projects.json      # Project data (edit this to add projects)
├── .nojekyll               # Disables Jekyll on GitHub Pages
└── .gitignore              # Excludes .DS_Store and .claude/
```
