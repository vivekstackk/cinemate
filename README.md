# CineMate 🎬

### Discover films. Explore stories. Find your next favourite.

CineMate is a cinematic movie discovery platform designed to make choosing what to watch easier and more enjoyable. Explore trending films, discover movies by mood, follow film awards, and build your own personal film journal.

**Live Demo:** [Add your deployed website URL]

**Repository:** https://github.com/vivekstackk/cinemate

---

## ✨ Features

- 🎥 **Cinematic Discovery:** Explore trending and popular movies with a visually immersive interface.
- 🔎 **Movie Search:** Find films and explore movie information.
- 🎭 **Find a Film:** Discover films based on your mood and preferences.
- 🏆 **Awards:** Explore film awards and stay informed about cinema-related news.
- 🎞️ **Movie Gallery:** Browse movies through a dedicated gallery experience.
- 👤 **Personal Profile:** Create an account and customize your profile.
- 🔐 **Authentication:** Sign in using Google or email and password.
- ❤️ **Watchlist:** Save films you want to watch later.
- 📚 **Custom Collections:** Organize saved movies into personalized collections, inspired by a personal film journal.
- 🎨 **Premium UI:** A cinematic editorial aesthetic with smooth interactions and responsive layouts.

*Some features may depend on configured API keys and Firebase services.*

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| TypeScript | Type safety |
| Vite | Development and build tooling |
| CSS | Styling and animations |
| Firebase Authentication | User sign-in and account management |
| Firebase / Firestore | User data and collections, if configured |
| TMDB API | Movie information and discovery |
| Git and GitHub | Version control |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Git
- A TMDB API key
- A Firebase project with the required services enabled

### 1. Clone the repository

```bash
git clone https://github.com/vivekstackk/cinemate.git
cd cinemate
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

Example:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Use the exact variable names expected by your current source code. If your Firebase configuration is currently hardcoded, update it to use environment variables before relying on this example.

### 4. Run locally

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

### 5. Build for production

```bash
npm run build
```

The production build is generated in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deployment

CineMate can be deployed to static hosting platforms such as Netlify, Cloudflare Pages, or Vercel.

Typical Vite build settings:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Framework | Vite |

Configure your environment variables in the hosting provider's dashboard.

For client-side routing, configure a fallback so routes such as `/awards`, `/find-film`, and `/movie-gallery` serve the main `index.html` file.

---

## 🔐 Security Notes

- Do not commit `.env` files or private credentials.
- Configure Firebase Authentication and Firestore security rules appropriately.
- Restrict API keys where supported.
- Remember that frontend environment variables are included in browser-delivered code. Never put server secrets in `VITE_` variables.
- Use the appropriate TMDB attribution and branding requirements.

---

## 📸 Screenshots

Add screenshots of your homepage, movie discovery page, movie details, and personal profile here.

```text
public/
└── screenshots/
    ├── homepage.png
    ├── discovery.png
    ├── movie-gallery.png
    └── profile.png
```

Example:

```markdown
![CineMate Homepage](public/screenshots/homepage.png)
```

---

## 🗺️ Future Improvements

- More personalized movie recommendations
- Advanced discovery filters
- Enhanced accessibility
- More detailed movie and award information
- Improved performance and search engine optimization
- Social sharing for film collections

---

## 👨‍💻 Author

**Vivek Damar**

Computer Science and Engineering  
National Institute of Technology Rourkela

- GitHub: [@vivekstackk](https://github.com/vivekstackk)
- LinkedIn: [Vivek Damar](https://www.linkedin.com/in/vivek-damar)

---

## 📄 License

This project was created as a learning and academic project. Add a license file if you intend to permit reuse, modification, or distribution under specific terms.

---

**CineMate — Your next great film is one discovery away.** 🍿