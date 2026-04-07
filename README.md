# 🎓 AI-Powered Automated Attendance ERP System

![Python Architecture](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)
![React Framework](https://img.shields.io/badge/React.js-Vite-61DAFB?style=for-the-badge&logo=react)
![SQLite](https://img.shields.io/badge/SQLite-Embedded-003B57?style=for-the-badge&logo=sqlite)
![DeepFace Biometrics](https://img.shields.io/badge/DeepFace-Google_Facenet-FF6F00?style=for-the-badge)

An elite, fully autonomous computer-vision enterprise platform designed to completely eradicate manual academic attendance protocols. By fusing native React.js frontend interfaces with highly multi-threaded Python data pipelines, this architecture autonomously tracks student biometrics throughout entire lecture periods.

## 🌟 Key Features
- **10-40-10 Time-Warp Scheduling:** Implements completely randomized facial sweeps using a strict institutional lecture period simulator algorithm, eliminating the possibility of proxy attendance.
- **Role-Based Cryptographic Access:** Total state segregation between 'Student Privacy Portals' and the master 'Faculty Control Hub'.
- **Google Facenet Biometric Engine:** Leverages the DeepFace API mathematically mapped to 128-dimensional Cosine Similarity, guaranteeing a strict `>95%` confidence barrier.
- **Glassmorphism UI:** An Apple-tier, extremely dark-mode React interface running seamlessly via Vite Hot Module Replacement (HMR).

---

## 🚀 How to Run the Application Locally

Because this application relies on a dual-server architecture (Frontend and Backend), you absolutely must run **two separate terminal windows**.

### 1. Start the Machine Learning Backend
This powers the facial recognition, database, and background scheduling daemon.
```bash
# Navigate into the backend repository
cd backend

# Create a virtual environment and activate it (Windows)
python -m venv venv
.\venv\Scripts\activate

# Install the massive neural-network dependencies
pip install -r requirements.txt

# Run the Flask API and DeepFace Load Caches
python run.py
```
*(The backend should now securely be running on `http://127.0.0.1:5000`)*

---

### 2. Start the React Frontend Engine
This boots the local client GUI dashboard. Open a **brand new Terminal inside VS Code**.
```bash
# Navigate into the frontend repository
cd frontend

# Install exact Node modules
npm install

# Start the extremely fast Vite Server
npm run dev
```
*(The frontend should be globally accessible at `http://localhost:5173`. Click the link in the terminal to view the application!)*

---

## 🔒 Security & Database
- The master SQLite Database `iomp_erp.db` is completely embedded in the backend. 
- You can log into the faculty dashboard immediately utilizing credential `FACULTY_01` (pass: `admin123`) or via pre-registered AI Instructors (e.g., username `SK` and password `SK`).

## 🧠 Architectural Diagram (Simplified)
`Webcam Frame` ➡️ `OpenCV Haar Cascade Isolation` ➡️ `DeepFace 128-D Vector Transformation` ➡️ `Python Verification Matrix (>95%)` ➡️ `SQLite Logging` ➡️ `React Virtual DOM Rendering`

---

*Designed and engineered to achieve peak software abstraction paradigms across educational ERP infrastructure.*
