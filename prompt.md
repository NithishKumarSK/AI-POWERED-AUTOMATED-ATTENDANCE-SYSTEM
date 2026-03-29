# MASTER TKREC AI ERP CONTEXT RESTORATION PROMPT

**Instructions for the User:** 
If you ever switch Gemini accounts and need the AI to instantly understand your ENTIRE `IOMP` project natively without explaining it all, simply copy and paste everything below this line into your first message:

---

> Please act as a senior Software ERP Architect. I am developing an "AI-Powered Automated Attendance ERP System" for my college (TKREC). I already have a fully functioning backend and frontend. You MUST read this context thoroughly before helping me further.
> 
> **Architecture & State Analysis:**
> - **Backend Platform:** Python 3 + Flask + SQLite3. 
>   - The SQLite database handles full authentication logic via a custom `users` table mapped to `/api/auth/login`. It contains strict roles: `staff` and `student`.
>   - **ACTIVE FACULTY DATABASE:** `ESHIRISHA` (ML), `BPRIYANKA` (FLAT), `SK` (AI), `AMOUNIKA` (SL), `BNAVEENA` (FIOT), `PSWETHA` (IOMP), `JANAKI` (ES). 
>   - **ACTIVE STUDENT DATABASE:** Contains exactly 66 records for Phase 2 CSE-D (`23R91A05K9` through `23R91A05S4`). Both their `user_id` and `password` natively equal their Roll Number!
>   - Time-series facial recognition scans are managed autonomously inside `backend/app/attendance.py` which spawns threaded background processes.
> 
> - **AI Engine:** DeepFace + OpenCV (`haarcascade_frontalface_default.xml`).
>   - The engine uses a strict 10-40-10 CCTV logic mapping model: 
>     - **Phase 0 (0-10m):** Grace Period. Camera is idle. 
>     - **Phase 1 (11-40m):** Global CCTV sweeps. Hunting for all students.
>     - **Phase 2 (41-50m):** Active Missing Target Hunt. Only targets students who were ABSENT in Phase 1 for a second strict verification.
>     - **Phase 3 (51+m):** Finalizes the database.
>   - **Auto-Retrain Logic:** If a student uploads their face directly from the React portal, the Python route `/api/students/upload_faces` natively invalidates `representations_vgg_face.pkl` to force an automatic embedding retrain on the next boot!
> 
> - **Frontend Platform:** React.js + Vite + TailwindCSS. (Flat Dark `#0b0e14` Theme, `#161b22` panels).
>   - **Router (`App.jsx`):** Completely separated. Core tabs include `/home`, `/details`, `/timetable`, `/attendance` (CCTV Deployment Hub), `/face-setup`, `/nominal-rolls`, `/lecture-planning`, `/mid-marks`.
>   - **Staff Dashboard (`Home.jsx`):** Exclusively hosts the Faculty Identity Card (Photo, Blood Group, Number) and a retro-active 7-day Surveillance history grid framework.
>   - **AI Array Hub (`Attendance.jsx`):** Side-by-side architecture. Left side inputs the CCTV Background Daemon. Right side immediately maps all 66 students into a toggleable Present/Absent grid for live-audits.
>   - **Academic Sub-Nodes:** Native components built for `MidMarks.jsx` (MID-1/MID-2/SEM data entry maps), `NominalRolls.jsx` (List array display), and `LecturePlanning.jsx`.
>   - **ROLE ISOLATION (TIMETABLE):** The `TimeTable.jsx` module holds the exact CSE-D Schedule (9:40-4:20 bounds). If a faculty logs in, they ONLY see their respective subjects unlocked while the rest are locked!
> 
> My workspace is located at `C:\Users\nithi\OneDrive\Desktop\IOMP`.
> Please analyze this architecture and tell me you are ready to implement my next requested feature!
