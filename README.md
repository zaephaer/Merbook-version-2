# MERBOOK - Meeting Room Booking System

MERBOOK is a modern, internal web-based application designed for seamless meeting room reservations. It eliminates scheduling conflicts and provides real-time oversight of office resources.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Hooks (useState, useEffect, useMemo)
- **Date Handling:** [date-fns](https://date-fns.org/)
- **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit) (Ready for enhancement)
- **Database/Auth:** [Firebase](https://firebase.google.com/) (Scaffolded for Firestore & Auth)

## ✨ Key Features

### User Experience
- **Interactive Dashboard:** View real-time room availability for any selected date (weekdays only).
- **Smart Booking Modal:** 
  - Strict 15-minute interval selection.
  - Automatic validation against overlapping bookings.
  - Prevention of past-time reservations for the current day.
- **My Reservations:** A dedicated space for users to track their upcoming and past meetings, with the ability to cancel future bookings.

### Admin Features
- **Room Management:**
  - Create and Edit meeting rooms.
  - Upload custom images or provide external URLs.
  - Assign facilities (AC, Smart Camera, Hybrid-Ready, HDMI Connectivity, etc.) with alphabetical sorting.
- **Administrative Dashboard:**
  - High-level analytics (Total Active, Scheduled Today, Unique Users).
  - Searchable live booking feed.
  - Administrative cancellation power to resolve urgent scheduling conflicts.

## 🎨 Theme & Design
The app uses a professional **Primary Navy** and **Accent Orange** color scheme.
- **Primary:** `#1B393D` (Deep Navy)
- **Accent:** `#F97316` (Vibrant Orange) - Used for active navigation, call-to-action buttons, and status indicators.
- **Typography:** Clean, bold Inter font for high readability.

## 🛠️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open the app:**
   Navigate to [http://localhost:9002](http://localhost:9002) in your browser.

## 📂 Project Structure

- `src/app/dashboard`: User booking experience.
- `src/app/admin`: Room and booking management tools.
- `src/components`: Reusable UI components (Shadcn, Navbar, Modals).
- `src/lib`: Mock data, types, and utility functions.
- `src/firebase`: Configuration for backend integration.

---
*Developed for PIJ Property Development.*