# 🖥️ PomoZone - A Focus Terminal for Developers

![Image](https://github.com/user-attachments/assets/c04fa308-6053-418c-94af-d96327713f14)

**Live Demo:** [**pomozone.rakaarfi.dev**](https://pomozone.rakaarfi.dev)

PomoZone is a web-based Pomodoro application that merges the classic time management technique with an immersive, terminal-style coding ambiance. It's designed specifically for developers, freelancers, and anyone who loves the "deep work" vibe to help them focus and track their progress effectively.

---

## ✨ Key Features

-   **🕒 Customizable Focus Timer:** A classic Pomodoro timer (25/5/15) with fully customizable durations available through the settings menu.
-   **💻 Immersive Terminal UI:** An interface inspired by modern IDEs and terminals, complete with a dark theme and a monospace font for an authentic coding feel.
-   **🧠 Mini-Challenges:** Interactive quizzes about coding and logic appear during break sessions to keep your mind sharp and refreshed.
-   **✍️ Git-Style Checkpoints:** After completing a cycle of 4 focus sessions, log your accomplishments in a `git commit` format to meaningfully track your progress.
-   **🎵 Ambient Sounds:** Choose from a selection of background sounds (mechanical keyboard, rain, etc.) to create your perfect work environment.
-   **📊 Session Statistics:** Track your total completed focus sessions and review your "commit" history on the statistics page.
-   **🚀 PWA Ready:** Install PomoZone directly to your desktop or mobile device for quick, native-app-like access and offline capabilities.
-   **💾 Local Persistence:** All your settings and session history are automatically saved in your browser using `localStorage`.

---

## 🛠️ Tech Stack

| Category         | Technology                               |
|------------------|------------------------------------------|
| Framework        | **Next.js 14+** (App Router)             |
| Language         | **TypeScript**                           |
| Styling          | **Tailwind CSS**                         |
| State Management | **Zustand**                              |
| Animations       | **Framer Motion**                        |
| Custom UI        | **Headless UI** (Tabs, Listbox)          |
| Audio Engine     | **Howler.js**                            |
| PWA              | **next-pwa**                             |
| Deployment       | **Vercel**                               |

---

## 🚀 Running Locally

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/pomozone.git
    # Replace with your repository URL
    cd pomozone
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.