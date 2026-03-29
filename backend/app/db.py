import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

from .settings import settings


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def ensure_db() -> None:
    Path(settings.db_path).parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(settings.db_path) as conn:
        conn.executescript(
            """
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS students (
                student_id TEXT PRIMARY KEY,
                full_name TEXT NOT NULL,
                class_id TEXT NOT NULL,
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS periods (
                period_id INTEGER PRIMARY KEY AUTOINCREMENT,
                class_id TEXT NOT NULL,
                started_at TEXT NOT NULL,
                ended_at TEXT,
                duration_minutes INTEGER NOT NULL,
                checks_count INTEGER NOT NULL,
                presence_threshold REAL NOT NULL,
                min_instances_required INTEGER NOT NULL,
                status TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS period_checks (
                check_id INTEGER PRIMARY KEY AUTOINCREMENT,
                period_id INTEGER NOT NULL,
                check_index INTEGER NOT NULL,
                scheduled_minute INTEGER NOT NULL,
                actual_ts TEXT,
                FOREIGN KEY(period_id) REFERENCES periods(period_id)
            );

            CREATE TABLE IF NOT EXISTS detection_logs (
                detection_id INTEGER PRIMARY KEY AUTOINCREMENT,
                period_id INTEGER NOT NULL,
                check_id INTEGER NOT NULL,
                student_id TEXT NOT NULL,
                confidence_distance REAL NOT NULL,
                detected_ts TEXT NOT NULL,
                FOREIGN KEY(period_id) REFERENCES periods(period_id),
                FOREIGN KEY(check_id) REFERENCES period_checks(check_id),
                FOREIGN KEY(student_id) REFERENCES students(student_id)
            );

            CREATE TABLE IF NOT EXISTS final_attendance (
                final_id INTEGER PRIMARY KEY AUTOINCREMENT,
                period_id INTEGER NOT NULL,
                student_id TEXT NOT NULL,
                detections_count INTEGER NOT NULL,
                checks_count INTEGER NOT NULL,
                detection_ratio REAL NOT NULL,
                ai_status TEXT NOT NULL,
                final_status TEXT NOT NULL,
                finalized_at TEXT,
                UNIQUE(period_id, student_id),
                FOREIGN KEY(period_id) REFERENCES periods(period_id),
                FOREIGN KEY(student_id) REFERENCES students(student_id)
            );

            CREATE TABLE IF NOT EXISTS overrides (
                override_id INTEGER PRIMARY KEY AUTOINCREMENT,
                period_id INTEGER NOT NULL,
                student_id TEXT NOT NULL,
                old_status TEXT NOT NULL,
                new_status TEXT NOT NULL,
                reason TEXT,
                lecturer TEXT,
                overridden_at TEXT NOT NULL,
                FOREIGN KEY(period_id) REFERENCES periods(period_id),
                FOREIGN KEY(student_id) REFERENCES students(student_id)
            );

            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                password TEXT NOT NULL,
                role TEXT NOT NULL,
                full_name TEXT
            );
            """
        )
        
        # --- Autonomous Seeder for DB Auth Initialization ---
        # --- Autonomous Seeder for DB Auth Initialization ---
        conn.executescript("""
            INSERT OR IGNORE INTO users VALUES ('FACULTY_01', 'admin123', 'staff', 'Dr. Professor Admin');
            INSERT OR IGNORE INTO users VALUES ('ESHIRISHA', 'ESHIRISHA', 'staff', 'Machine Learning');
            INSERT OR IGNORE INTO users VALUES ('BPRIYANKA', 'BPRIYANKA', 'staff', 'FLAT');
            INSERT OR IGNORE INTO users VALUES ('SK', 'SK', 'staff', 'Artificial Intelligence');
            INSERT OR IGNORE INTO users VALUES ('AMOUNIKA', 'AMOUNIKA', 'staff', 'Scripting Languages');
            INSERT OR IGNORE INTO users VALUES ('BNAVEENA', 'BNAVEENA', 'staff', 'FIOT');
            INSERT OR IGNORE INTO users VALUES ('PSWETHA', 'PSWETHA', 'staff', 'IOMP');
            INSERT OR IGNORE INTO users VALUES ('JANAKI', 'JANAKI', 'staff', 'Environmental Science');
            
            INSERT OR IGNORE INTO users VALUES ('23R91A05K9', '23R91A05K9', 'student', 'MOHAMMED ABDUL GHANI');
            INSERT OR IGNORE INTO users VALUES ('23R91A05L0', '23R91A05L0', 'student', 'MOHAMMED ABDUL HASEEB');
            INSERT OR IGNORE INTO users VALUES ('23R91A05L1', '23R91A05L1', 'student', 'MOTADI MANITEJA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05L2', '23R91A05L2', 'student', 'MOTHE SHIVA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05L3', '23R91A05L3', 'student', 'MUDAVATH MOUNIKA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05L4', '23R91A05L4', 'student', 'MUDDASANI DIVYA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05L5', '23R91A05L5', 'student', 'MUDIREDDY HARISH REDDY');
            INSERT OR IGNORE INTO users VALUES ('23R91A05L6', '23R91A05L6', 'student', 'MUKKAM NITHISH KUMAR');
            INSERT OR IGNORE INTO users VALUES ('23R91A05L7', '23R91A05L7', 'student', 'MUMMEDY DURGA SAI LAKSHMI');
            INSERT OR IGNORE INTO users VALUES ('23R91A05L8', '23R91A05L8', 'student', 'MUSHA SHASHI KUMAR');
            INSERT OR IGNORE INTO users VALUES ('23R91A05L9', '23R91A05L9', 'student', 'MUSKAN KUMARI');
            INSERT OR IGNORE INTO users VALUES ('23R91A05M0', '23R91A05M0', 'student', 'MUSTI ARAVIND');
            INSERT OR IGNORE INTO users VALUES ('23R91A05M1', '23R91A05M1', 'student', 'MUTHAMSETTY ASHWINI');
            INSERT OR IGNORE INTO users VALUES ('23R91A05M2', '23R91A05M2', 'student', 'NAGAVELLI SRI POORNA CHANDRA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05M3', '23R91A05M3', 'student', 'NAGILLA HARI KRISHNA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05M4', '23R91A05M4', 'student', 'NAMALA EKANSH');
            INSERT OR IGNORE INTO users VALUES ('23R91A05M5', '23R91A05M5', 'student', 'NANDYALA AAKASH');
            INSERT OR IGNORE INTO users VALUES ('23R91A05M6', '23R91A05M6', 'student', 'NARAGANI JAYANTH');
            INSERT OR IGNORE INTO users VALUES ('23R91A05M7', '23R91A05M7', 'student', 'NARAMULA PRAKASH');
            INSERT OR IGNORE INTO users VALUES ('23R91A05M8', '23R91A05M8', 'student', 'NATTA SRAVANTHI');
            INSERT OR IGNORE INTO users VALUES ('23R91A05M9', '23R91A05M9', 'student', 'NEGURI AKSHARA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05N0', '23R91A05N0', 'student', 'NELLURI SIDDARDHA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05N1', '23R91A05N1', 'student', 'NENAVATH SINDHU');
            INSERT OR IGNORE INTO users VALUES ('23R91A05N2', '23R91A05N2', 'student', 'NOMULA BHAVITH REDDY');
            INSERT OR IGNORE INTO users VALUES ('23R91A05N3', '23R91A05N3', 'student', 'NUNUGONDA SAI VENKAT REDDY');
            INSERT OR IGNORE INTO users VALUES ('23R91A05N4', '23R91A05N4', 'student', 'OGGU SRINIDHI');
            INSERT OR IGNORE INTO users VALUES ('23R91A05N5', '23R91A05N5', 'student', 'OMER AFZAL AHMED KHAN');
            INSERT OR IGNORE INTO users VALUES ('23R91A05N6', '23R91A05N6', 'student', 'P C PAVAN KUMAR');
            INSERT OR IGNORE INTO users VALUES ('23R91A05N7', '23R91A05N7', 'student', 'P SANJANA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05N8', '23R91A05N8', 'student', 'PAGADALA PAVANI');
            INSERT OR IGNORE INTO users VALUES ('23R91A05N9', '23R91A05N9', 'student', 'PALLAVI PATIL');
            INSERT OR IGNORE INTO users VALUES ('23R91A05P0', '23R91A05P0', 'student', 'PANDIRI SAI CHARITHA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05P1', '23R91A05P1', 'student', 'PANJUGULA RAHUL');
            INSERT OR IGNORE INTO users VALUES ('23R91A05P2', '23R91A05P2', 'student', 'PANNALA LIKHITHA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05P3', '23R91A05P3', 'student', 'PANYALA KEERTHANA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05P4', '23R91A05P4', 'student', 'PATIL GOURAV SURYAKANT');
            INSERT OR IGNORE INTO users VALUES ('23R91A05P5', '23R91A05P5', 'student', 'PATNAM AKHILESH');
            INSERT OR IGNORE INTO users VALUES ('23R91A05P6', '23R91A05P6', 'student', 'PAWAR ANAND KUMAR');
            INSERT OR IGNORE INTO users VALUES ('23R91A05P7', '23R91A05P7', 'student', 'PAWAR DEEPAK');
            INSERT OR IGNORE INTO users VALUES ('23R91A05P8', '23R91A05P8', 'student', 'PENDLY RAHUL');
            INSERT OR IGNORE INTO users VALUES ('23R91A05P9', '23R91A05P9', 'student', 'PILLI PREM KUMAR');

            INSERT OR IGNORE INTO users VALUES ('23R91A05Q0', '23R91A05Q0', 'student', 'PITTALA SRINATH');
            INSERT OR IGNORE INTO users VALUES ('23R91A05Q1', '23R91A05Q1', 'student', 'PODAKANDLA LOHITH');
            INSERT OR IGNORE INTO users VALUES ('23R91A05Q2', '23R91A05Q2', 'student', 'POLISHETTY HARSHITHA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05Q3', '23R91A05Q3', 'student', 'POODARI SAIKEERTHI');
            INSERT OR IGNORE INTO users VALUES ('23R91A05Q4', '23R91A05Q4', 'student', 'POREDDY SHREYA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05Q5', '23R91A05Q5', 'student', 'POTHANNAGARI NITHIN');
            INSERT OR IGNORE INTO users VALUES ('23R91A05Q6', '23R91A05Q6', 'student', 'POTLA SIDDARDHA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05Q7', '23R91A05Q7', 'student', 'PULI SUNIL');
            INSERT OR IGNORE INTO users VALUES ('23R91A05Q8', '23R91A05Q8', 'student', 'PULLA KOUSHIK');
            INSERT OR IGNORE INTO users VALUES ('23R91A05Q9', '23R91A05Q9', 'student', 'PULLURI PRANAY');
            INSERT OR IGNORE INTO users VALUES ('23R91A05R0', '23R91A05R0', 'student', 'PUPPALA MANIPRIYA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05R1', '23R91A05R1', 'student', 'PYATA BOWDHINI');
            INSERT OR IGNORE INTO users VALUES ('23R91A05R2', '23R91A05R2', 'student', 'RACHAKONDA CHARAN KUMAR');
            INSERT OR IGNORE INTO users VALUES ('23R91A05R3', '23R91A05R3', 'student', 'RACHAKONDA SHIRISHA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05R4', '23R91A05R4', 'student', 'RACHURI MADHU');
            INSERT OR IGNORE INTO users VALUES ('23R91A05R5', '23R91A05R5', 'student', 'RAHUL SAMAL');
            INSERT OR IGNORE INTO users VALUES ('23R91A05R6', '23R91A05R6', 'student', 'RAMANAGONI DHEEKSHITHA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05R7', '23R91A05R7', 'student', 'RATAPU RASAGNA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05R8', '23R91A05R8', 'student', 'RATHLAVATH VENKATESH');
            INSERT OR IGNORE INTO users VALUES ('23R91A05R9', '23R91A05R9', 'student', 'RAVIRALA SAMPATH KUMAR');
            INSERT OR IGNORE INTO users VALUES ('23R91A05S0', '23R91A05S0', 'student', 'RAYAPATI ASHOK');
            INSERT OR IGNORE INTO users VALUES ('23R91A05S1', '23R91A05S1', 'student', 'REGATTE SINDHU');
            INSERT OR IGNORE INTO users VALUES ('23R91A05S2', '23R91A05S2', 'student', 'RODDA SRAVYA');
            INSERT OR IGNORE INTO users VALUES ('23R91A05S3', '23R91A05S3', 'student', 'S RAQEEB');
            INSERT OR IGNORE INTO users VALUES ('23R91A05S4', '23R91A05S4', 'student', 'S S SINDHIYA GRACE');
        """)


@contextmanager
def get_conn():
    ensure_db()
    conn = sqlite3.connect(settings.db_path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def sync_class_roster(class_id: str, students: Iterable[tuple[str, str, str]]) -> None:
    rows = list(students)
    now = utc_now()
    with get_conn() as conn:
        conn.executemany(
            """
            INSERT INTO students(student_id, full_name, class_id, created_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(student_id) DO UPDATE SET
                full_name=excluded.full_name,
                class_id=excluded.class_id,
                is_active=1
            """,
            [(sid, name, class_id, now) for sid, name, class_id in rows],
        )
        allowed = {sid for sid, _, _ in rows}
        existing = conn.execute(
            "SELECT student_id FROM students WHERE class_id=?",
            (class_id,),
        ).fetchall()
        for row in existing:
            sid = row["student_id"]
            if sid not in allowed:
                conn.execute(
                    "UPDATE students SET is_active=0 WHERE class_id=? AND student_id=?",
                    (class_id, sid),
                )


def list_classes() -> list[str]:
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT DISTINCT class_id FROM students WHERE is_active=1 ORDER BY class_id"
        ).fetchall()
    return [r["class_id"] for r in rows]


def get_class_students(class_id: str) -> list[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute(
            """
            SELECT student_id, full_name, class_id
            FROM students
            WHERE class_id=? AND is_active=1
            ORDER BY student_id
            """,
            (class_id,),
        ).fetchall()


def create_period(
    class_id: str,
    duration_minutes: int,
    checks_count: int,
    threshold: float,
    min_instances: int,
) -> int:
    with get_conn() as conn:
        cur = conn.execute(
            """
            INSERT INTO periods(
                class_id, started_at, duration_minutes, checks_count,
                presence_threshold, min_instances_required, status
            ) VALUES (?, ?, ?, ?, ?, ?, 'running')
            """,
            (class_id, utc_now(), duration_minutes, checks_count, threshold, min_instances),
        )
        return int(cur.lastrowid)


def end_period(period_id: int) -> None:
    with get_conn() as conn:
        conn.execute(
            "UPDATE periods SET ended_at=?, status='completed' WHERE period_id=?",
            (utc_now(), period_id),
        )


def list_periods(limit: int = 50) -> list[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute(
            "SELECT * FROM periods ORDER BY period_id DESC LIMIT ?",
            (limit,),
        ).fetchall()


def get_period(period_id: int):
    with get_conn() as conn:
        return conn.execute("SELECT * FROM periods WHERE period_id=?", (period_id,)).fetchone()


def insert_check(period_id: int, idx: int, scheduled_minute: int, actual_ts: str) -> int:
    with get_conn() as conn:
        cur = conn.execute(
            """
            INSERT INTO period_checks(period_id, check_index, scheduled_minute, actual_ts)
            VALUES (?, ?, ?, ?)
            """,
            (period_id, idx, scheduled_minute, actual_ts),
        )
        return int(cur.lastrowid)


def get_period_checks(period_id: int) -> list[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute(
            """
            SELECT check_id, check_index, scheduled_minute, actual_ts
            FROM period_checks
            WHERE period_id=?
            ORDER BY check_index
            """,
            (period_id,),
        ).fetchall()


def insert_detections(period_id: int, check_id: int, rows: Iterable[tuple[str, float]]) -> None:
    data = [(period_id, check_id, sid, dist, utc_now()) for sid, dist in rows]
    if not data:
        return
    with get_conn() as conn:
        conn.executemany(
            """
            INSERT INTO detection_logs(period_id, check_id, student_id, confidence_distance, detected_ts)
            VALUES (?, ?, ?, ?, ?)
            """,
            data,
        )


def get_detection_logs(period_id: int) -> list[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute(
            """
            SELECT d.detection_id, d.period_id, d.check_id, d.student_id, s.full_name,
                   d.confidence_distance, d.detected_ts
            FROM detection_logs d
            JOIN students s ON s.student_id=d.student_id
            WHERE d.period_id=?
            ORDER BY d.check_id, d.student_id
            """,
            (period_id,),
        ).fetchall()


def write_final_row(
    period_id: int,
    student_id: str,
    detections_count: int,
    checks_count: int,
    ratio: float,
    ai_status: str,
) -> None:
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO final_attendance(
                period_id, student_id, detections_count, checks_count, detection_ratio,
                ai_status, final_status, finalized_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(period_id, student_id) DO UPDATE SET
                detections_count=excluded.detections_count,
                checks_count=excluded.checks_count,
                detection_ratio=excluded.detection_ratio,
                ai_status=excluded.ai_status,
                final_status=excluded.final_status,
                finalized_at=excluded.finalized_at
            """,
            (period_id, student_id, detections_count, checks_count, ratio, ai_status, ai_status, utc_now()),
        )


def get_final_attendance(period_id: int) -> list[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute(
            """
            SELECT f.*, s.full_name
            FROM final_attendance f
            JOIN students s ON s.student_id=f.student_id
            WHERE f.period_id=?
            ORDER BY s.student_id
            """,
            (period_id,),
        ).fetchall()


def apply_override(period_id: int, student_id: str, new_status: str, lecturer: str, reason: str) -> None:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT final_status FROM final_attendance WHERE period_id=? AND student_id=?",
            (period_id, student_id),
        ).fetchone()
        if row is None:
            raise ValueError("No final attendance row found for this student/period.")
        old_status = row["final_status"]
        conn.execute(
            "UPDATE final_attendance SET final_status=?, finalized_at=? WHERE period_id=? AND student_id=?",
            (new_status, utc_now(), period_id, student_id),
        )
        conn.execute(
            """
            INSERT INTO overrides(period_id, student_id, old_status, new_status, reason, lecturer, overridden_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (period_id, student_id, old_status, new_status, reason, lecturer, utc_now()),
        )


def get_overrides(period_id: int) -> list[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute(
            """
            SELECT override_id, period_id, student_id, old_status, new_status, reason, lecturer, overridden_at
            FROM overrides
            WHERE period_id=?
            ORDER BY override_id DESC
            """,
            (period_id,),
        ).fetchall()

def get_student_attendance(student_id: str) -> list[sqlite3.Row]:
    with get_conn() as conn:
        return conn.execute(
            """
            SELECT f.*, p.class_id, p.started_at, p.status, p.duration_minutes
            FROM final_attendance f
            JOIN periods p ON p.period_id=f.period_id
            WHERE f.student_id=?
            ORDER BY p.period_id DESC
            """,
            (student_id,),
        ).fetchall()

def get_student_stats(student_id: str) -> dict:
    with get_conn() as conn:
        row = conn.execute(
            """
            SELECT COUNT(f.period_id) as total_periods,
                   SUM(CASE WHEN f.final_status='PRESENT' THEN 1 ELSE 0 END) as present_periods
            FROM final_attendance f
            WHERE f.student_id=?
            """, (student_id,)
        ).fetchone()
        
        info = conn.execute("SELECT full_name, class_id FROM students WHERE student_id=?", (student_id,)).fetchone()
        
        if not row or not info:
             return {"total_periods": 0, "present_periods": 0, "percentage": 0.0, "full_name": "Unknown", "class_id": "Unknown"}
             
        total = row["total_periods"] or 0
        present = row["present_periods"] or 0
        pct = (present / total) if total > 0 else 0.0
        return {
            "total_periods": total,
            "present_periods": present,
            "percentage": pct,
            "full_name": info["full_name"],
            "class_id": info["class_id"]
        }
