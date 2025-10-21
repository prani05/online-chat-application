# 💬 Stranger Chat – A Secure Full-Stack Online Chat Application

Welcome to **Stranger Chat**, a modern, secure, and anonymous chat application that connects users for real-time **text and video** conversations.  
This project features a robust **Java Spring Boot backend** and a **dynamic React frontend**, with a strong focus on **user safety** through **AI-powered gender verification**.

---

## ✨ Core Features

- 🕵️ **Anonymous Chat:** No login or personal information required. Users are identified only by a temporary session ID.
- 💬 **Dual Chat Modes:** Choose between classic **Text Chat** or face-to-face **Video Chat**.
- 🤖 **AI-Powered Gender Verification:**
  - **Face Detection:** Uses `face-api.js` to detect the user's gender from their webcam feed.
  - **Voice Analysis:** Implements a custom algorithm to analyze the fundamental frequency (pitch) of a user's voice to verify gender.
- ⚡ **Real-time Communication:** Built with **Spring Boot WebSockets** and a **StompJS** client for instant message delivery.
- 🎯 **Secure Matchmaking:** Backend-driven queueing system matches users based on their selected gender preference.
- 🚨 **Moderation Tools:** Options to report inappropriate behavior.
- 💻 **Responsive UI:** Built with **React**, **TypeScript**, and **Tailwind CSS**, optimized for desktop and mobile.

---

## 🛠 Tech Stack

### 🔹 Backend

| Technology | Purpose |
|-------------|----------|
| Java 17+ | Core programming language |
| Spring Boot 3 | Backend framework |
| Spring Data JPA | Database persistence and repository management |
| Spring Web | REST API endpoints for session and queue management |
| Spring WebSocket | Real-time, bidirectional communication |
| PostgreSQL | Relational database for storing chat data |
| Maven | Project build and dependency management |

### 🔹 Frontend

| Technology | Purpose |
|-------------|----------|
| React 18 | UI framework |
| TypeScript | Strong typing for cleaner code |
| Vite | Fast build tool and dev server |
| Tailwind CSS | Utility-first styling framework |
| shadcn/ui | Beautifully designed UI components |
| face-api.js | Face detection and recognition |
| Zustand | Lightweight global state management |
| Axios & StompJS | For API requests and WebSocket connections |

---

## 🚀 Getting Started

### 🧩 Prerequisites

Ensure you have the following installed:
- **JDK 17** or newer  
- **Node.js v18+** and npm  
- **PostgreSQL**  
- **Maven**

---

### ⚙️ Backend Setup (`/demo` folder)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/prani05/online-chat-application.git
   cd online-chat-application

2. **Create the Database**
   - Open **pgAdmin** or **psql**.
   - Create a new database named:
     ```sql
     CREATE DATABASE strangerchat;
     ```

3. **Configure Database Connection**
   - Edit the file:
     ```
     src/main/resources/application.properties
     ```
   - Update the password field:
     ```properties
     spring.datasource.password=your_postgres_password
     ```

4. **Run the Backend Server**
   - In your IDE, run the file:
     ```
     DemoApplication.java
     ```
   - Once started, the backend will be available at:
     ```
     http://localhost:8080
     ```

---

## ⚙️ Frontend Setup (`/frontend` folder)

1. **Navigate to the Frontend**
   ```bash
   cd frontend
2. **Install Dependencies** :
   ```bash
    npm install
4. **Set Up AI Models** :
    ○ The face-api.js library requires pre-trained models.
    ○ Download the model files from the official [face-api.js](https://github.com/justadudewhohacks/face-api.js/tree/master/weights) GitHub repository.
    ○ Place the downloaded model files into the frontend/public/models directory.


5. **Run the Development Server** :
    npm run dev
       ○ Your application will be available at [http://localhost:5173.](http://localhost:5173.)
You can now open your browser and start using the Stranger Chat application!

## 📸 Screenshots

_(This is a great place to add screenshots of your running application!)_
**Home Page Verification Flow Chat Interface**

<img width="1024" height="507" alt="image" src="https://github.com/user-attachments/assets/887d7ca6-5ece-4fc6-9270-4db7eb9c61c8" />
<img width="1024" height="487" alt="image" src="https://github.com/user-attachments/assets/6c6a94bd-82d0-470d-8cdf-3699eacd11c4" />
<img width="1348" height="544" alt="image" src="https://github.com/user-attachments/assets/572a0c70-5901-4abf-99fa-3bd3b1e9c73f" />
<img width="1196" height="596" alt="image" src="https://github.com/user-attachments/assets/c205c7e2-135d-4d6e-90fc-a05bc7c676db" />
<img width="1216" height="597" alt="image" src="https://github.com/user-attachments/assets/0e2d9958-0dc2-4d28-bd96-c74f9e0dfde3" />
<img width="587" height="591" alt="image" src="https://github.com/user-attachments/assets/4cc3b114-7eb2-4ca1-b8d1-4e5b2db48841" />
<img width="514" height="607" alt="image" src="https://github.com/user-attachments/assets/b83d4eba-eacb-47cc-b12f-2f54285be5c7" />
<img width="696" height="582" alt="image" src="https://github.com/user-attachments/assets/dcb93cdf-d04c-4d6c-98be-16b5816c3ec7" />
<img width="1069" height="553" alt="image" src="https://github.com/user-attachments/assets/5d9eb5b4-b4bb-4d01-af2f-829bb0cd9adb" />
<img width="766" height="562" alt="image" src="https://github.com/user-attachments/assets/6b1329ae-40b2-4029-842d-ffb097ab8878" />
<img width="967" height="643" alt="image" src="https://github.com/user-attachments/assets/68390c00-d7cb-4f2e-a5a3-f8fb4cfc142d" />
<img width="1031" height="566" alt="image" src="https://github.com/user-attachments/assets/93bbc625-3425-4c65-afbd-279d9d5eff11" />











