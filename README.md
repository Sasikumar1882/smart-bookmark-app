# 🚀 Smart Bookmark Manager

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel)

A full-stack real-time bookmark management application built using **Next.js App Router** and **Supabase**.

Users can securely store, manage, and update personal bookmarks with **real-time synchronization across multiple browser tabs**.

---

## 🌟 Why This Project?

Managing bookmarks across sessions and devices can be difficult.
This application provides:

* Secure cloud-based bookmark storage
* Private user data isolation
* Instant real-time updates
* Clean and responsive user experience

This project demonstrates full-stack development, authentication, database security, and real-time systems.

---

## ✨ Features

✅ Google OAuth authentication (Supabase Auth)
✅ Add bookmarks (Title + URL)
✅ Edit bookmarks
✅ Delete bookmarks
✅ Private bookmarks per user (Row Level Security enabled)
✅ Real-time updates across multiple tabs (Supabase Realtime)
✅ Instant search functionality
✅ Success & error notifications (auto-hide)
✅ Responsive UI using Tailwind CSS
✅ Secure logout functionality

---


## 📸 Screenshots

Users can sign in securely using Google OAuth authentication.

Each user can only access their own bookmarks.


### 🔐 Login Page

![Login Page](./screenshots/Login%20page%20image.png)

### 🏠 Dashboard

![Dashboard](./screenshots/Dashboard%20image.png)

### ➕ Add Bookmark

![Add Bookmark](./screenshots/Bookmarks%20image.png)

### ✏️ Edit Bookmark

![Edit Bookmark](./screenshots/Edit%20option%20image.png)

### 🔍 Search Feature

![Search](./screenshots/Search%20option%20image.png)


---

## 🔐 Security Implementation

* Row Level Security (RLS) enabled on database
* Users can only access and manage their own bookmarks
* Google OAuth authentication only (no password storage)
* Protected database queries using authenticated user ID

---

## ⚡ Real-Time Functionality

* Changes in one tab instantly update in other tabs
* Powered by Supabase PostgreSQL change subscriptions
* No manual refresh required

---

## 🛠 Tech Stack

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS

### Backend / Database

* Supabase (Authentication + PostgreSQL + Realtime)

### Deployment

* Vercel

---

## 🧱 Architecture

```
Client (Next.js UI)
       ↓
Supabase Authentication (Google OAuth)
       ↓
Supabase PostgreSQL Database (Bookmarks Table)
       ↓
Realtime Subscription Updates
```

---

## 📂 Project Structure

```
app/        → UI pages (Next.js App Router)
lib/        → Supabase client configuration
services/   → Database operations (CRUD)
utils/      → URL validation logic
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root folder and add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🧪 How to Run Locally

Clone the repository:

```
git clone https://github.com/Sasikumar1882/smart-bookmark-app.git
```

Go to project folder:

```
cd smart-bookmark-app
```

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## 🌍 Live Demo

Deployed on Vercel.

👉 https://smart-bookmark-app-ten-vert.vercel.app


---

## 🚧 Challenges Faced & Solutions

### 1. Row Level Security (RLS)

**Challenge:** Restrict users from accessing other users’ bookmarks.
**Solution:** Implemented Supabase RLS policies using authenticated user ID.

### 2. Real-time Updates Across Multiple Tabs

**Challenge:** Synchronizing bookmark changes instantly.
**Solution:** Used Supabase PostgreSQL realtime subscriptions.

### 3. Authentication State Management

**Challenge:** Handling login/logout UI updates.
**Solution:** Implemented Supabase session handling and auth state listener.

### 4. User Data Isolation

**Challenge:** Maintaining privacy for each user's bookmarks.
**Solution:** Linked bookmarks with user_id and enforced RLS policies.

---

## 💡 Future Improvements

* Bookmark categories or tags
* Drag-and-drop sorting
* Bookmark preview thumbnails
* Dark mode support
* Pagination for large bookmark lists

---

## 👨‍💻 Author

**Sasikumar R**
Aspiring Fullstack Developer

---

⭐ If you like this project, give it a star!
