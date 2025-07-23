# TypeNest - Modern Blog Platform

TypeNest is a full-stack blog application built using React (Vite), Appwrite, and Tailwind CSS. It allows users to register, write rich content posts, and explore blogs by others.

---

## Features

- Rich Text Editor (TinyMCE)
- Email authentication via Appwrite
- Image upload & post management
- Explore posts with category and tags
- Demo login access (no registration needed)

---

## Live Demo

https://blog-platform-using-react.vercel.app/

### Demo Login Access

Click the “Use Demo Account” button on the login page.

Credentials are hidden in environment variables.

---

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Appwrite (Auth, Database, Storage)
- Editor: TinyMCE
- State Management: Redux Toolkit

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/gauravnainwal518/Blog-platform-using-react
cd Mega_blog

2. Install dependencies
npm install

3. Add environment variables
Create a .env file in the root of the project and add the following:
VITE_APPWRITE_ENDPOINT=your-appwrite-endpoint
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_COLLECTION_ID=your-collection-id
VITE_APPWRITE_BUCKET_ID=your-bucket-id
VITE_APPWRITE_COMMENTS_COLLECTION_ID= your-bucket-id
VITE_TINYMCE_API_KEY=your-tinymce-api-key
VITE_DEMO_EMAIL=your-demo-email@gmail.com
VITE_DEMO_PASSWORD=your-demo-password

// Make sure to keep this file private and never commit it.

4. Start the development server
npm run dev
Visit http://localhost:5173 in your browser.



Project Structure

src/
 ┣ appwrite/         - Appwrite service functions
 ┣ components/       - Reusable UI components
 ┣ pages/            - Route-level components
 ┣ store/            - Redux slices
 ┣ utils/            - Helper functions
 ┗ main.jsx          - Entry point


Important Notes
Only verified users can log in.
Demo user is already verified for easy access.
Image uploads are stored in Appwrite's bucket.
Blog posts support categories and tags.

```
