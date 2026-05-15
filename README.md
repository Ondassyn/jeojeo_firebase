# 🎙️ LiveQuiz: Real-Time Interactive Player Engine

A high-performance, mobile-responsive real-time quiz interface built with **Next.js 15** and **Firebase Realtime Database**. This project allows players to join live sessions, answer questions under a synchronized countdown, and view results pushed instantly from a host dashboard.

## ✨ Core Features

* **Instant State Sync:** Uses Firebase `onValue` listeners to pull questions, round titles, and media the moment the host pushes them.
* **Dynamic Media Handling:** * **Questions:** Supports static images and `.mp4` video/GIF formats.
    * **Answers:** Automated reveal of the correct answer string along with an optional visual "reveal" asset.
* **Intelligent Timer:** A local countdown synchronized with the host's `timeForQuestion` setting.
    * **Visual Feedback:** The timer bar shifts from Green → Orange → Red based on urgency.
    * **Auto-Lock:** Submissions are automatically disabled when `timeLeft` hits zero.
* **Submission Tracking:** Real-time feedback showing the player's current score and a confirmation state once an answer is submitted.
* **Immersive UX:** Built with a "Cyber-Grid" aesthetic, featuring glassmorphism, Framer Motion animations, and a dedicated image lightbox for close-up inspection.

---

## 🛠️ Tech Stack

| Layer            | Technology                               |
| :--------------- | :--------------------------------------- |
| **Framework** | Next.js 15 (App Router)                  |
| **Real-time DB** | Firebase Realtime Database               |
| **Animations** | Framer Motion (motion/react)             |
| **Styling** | Tailwind CSS                             |
| **Icons** | Lucide React                             |

---

## 🚀 Setup & Environment

1.  **Clone the repository** and install dependencies:
    ```bash
    npm install
    ```

2.  **Configure Firebase:**
    Create a `.env.local` file with your Firebase credentials:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_key
    NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_db_url
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 🏗️ Firebase Schema Architecture

The `SessionPage` interacts with the following Realtime Database structure at `sessions/${sessionId}/`:

```json
{
  "question": "Which planet is known as the Red Planet?",
  "questionImage": "[https://example.com/mars.mp4](https://example.com/mars.mp4)",
  "answer": "Mars",
  "answerImage": "[https://example.com/mars-reveal.jpg](https://example.com/mars-reveal.jpg)",
  "roundTitle": "Space Exploration",
  "timeForQuestion": 30,
  "players": {
    "PlayerName": {
      "answer": "Mars",
      "score": 550
    }
  }
}
