from flask import Blueprint, jsonify, request

from . import db
from .attendance import run_period
from .recognition import probe_recognition
from .settings import settings


api = Blueprint("api", __name__, url_prefix="/api")


@api.get("/health")
def health():
    return jsonify({"status": "ok"})


@api.get("/config")
def config():
    return jsonify(
        {
            "camera_index": settings.camera_index,
            "match_threshold": settings.match_threshold,
            "default_duration_minutes": settings.default_duration_minutes,
            "default_checks_count": settings.default_checks_count,
            "default_presence_threshold": settings.default_presence_threshold,
            "min_instances_required": settings.min_instances_required,
        }
    )


@api.get("/classes")
def classes():
    return jsonify(db.list_classes())


@api.get("/classes/<class_id>/students")
def class_students(class_id: str):
    return jsonify([dict(r) for r in db.get_class_students(class_id)])


@api.get("/periods")
def periods():
    limit = int(request.args.get("limit", "50"))
    return jsonify([dict(r) for r in db.list_periods(limit)])


@api.get("/periods/<int:period_id>")
def period(period_id: int):
    row = db.get_period(period_id)
    if row is None:
        return jsonify({"error": "period not found"}), 404
    return jsonify(dict(row))


import threading

import traceback
import sys

@api.post("/periods/run")
def run():
    body = request.get_json(force=True)
    try:
        def background_job():
            try:
                print(">>> STARTING BACKGROUND CCTV THREAD...", flush=True)
                run_period(
                    class_id=body["class_id"],
                    duration_minutes=int(body.get("duration_minutes", settings.default_duration_minutes)),
                    checks_count=int(body.get("checks_count", settings.default_checks_count)),
                    threshold=float(body.get("threshold", settings.default_presence_threshold)),
                    min_instances=int(body.get("min_instances", settings.min_instances_required)),
                    seconds_per_minute=float(body.get("seconds_per_minute", 1.0)),
                    topic=body.get("topic", "General Lecture"),
                    period_number=int(body.get("period_number", 0)),
                    subject_name=body.get("subject_name", ""),
                    date_string=body.get("date_string", "")
                )
            except Exception as e:
                print("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", flush=True)
                print("FATAL CRASH IN BACKGROUND CCTV THREAD!!!", flush=True)
                traceback.print_exc(file=sys.stdout)
                print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n", flush=True)
            
        thread = threading.Thread(target=background_job)
        thread.daemon = True
        thread.start()
        
        return jsonify({"status": "running in background"}), 201
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400


@api.get("/periods/<int:period_id>/attendance")
def attendance(period_id: int):
    return jsonify([dict(r) for r in db.get_final_attendance(period_id)])


@api.get("/periods/<int:period_id>/checks")
def checks(period_id: int):
    return jsonify([dict(r) for r in db.get_period_checks(period_id)])


@api.get("/periods/<int:period_id>/detections")
def detections(period_id: int):
    return jsonify([dict(r) for r in db.get_detection_logs(period_id)])


@api.get("/periods/<int:period_id>/overrides")
def overrides(period_id: int):
    return jsonify([dict(r) for r in db.get_overrides(period_id)])


@api.post("/periods/<int:period_id>/override")
def override(period_id: int):
    body = request.get_json(force=True)
    try:
        db.apply_override(
            period_id=period_id,
            student_id=body["student_id"],
            new_status=body["new_status"],
            lecturer=body.get("lecturer", "unknown_lecturer"),
            reason=body.get("reason", ""),
        )
        return jsonify({"status": "ok"})
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400

@api.post("/periods/manual_bulk")
def create_manual_period_bulk():
    body = request.get_json(force=True)
    try:
        pid = db.create_manual_period(
            class_id=body["class_id"],
            topic=body.get("topic", "General Lecture"),
            statuses=body["statuses"],
            lecturer=body.get("lecturer", "unknown"),
            period_number=int(body.get("period_number", 0)),
            subject_name=body.get("subject_name", ""),
            date_string=body.get("date_string", "")
        )
        return jsonify({"status": "ok", "period_id": pid}), 201
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400
@api.get("/periods/status")
def period_status():
    date_string = request.args.get("date_string")
    period_number = request.args.get("period_number")
    
    if not date_string or not period_number:
        return jsonify({"is_finalized": False, "message": "Missing params"})
        
    with db.get_conn() as conn:
        row = conn.execute("SELECT * FROM periods WHERE date_string = ? AND period_number = ?", (date_string, int(period_number))).fetchone()
        
    if row:
        return jsonify({"is_finalized": True})
    return jsonify({"is_finalized": False})


@api.get("/recognition/probe")
def probe():
    try:
        return jsonify(probe_recognition())
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 400

@api.get("/students/<student_id>/attendance")
def student_attendance(student_id: str):
    return jsonify([dict(r) for r in db.get_student_attendance(student_id)])

@api.get("/students/<student_id>/stats")
def student_stats(student_id: str):
    return jsonify(db.get_student_stats(student_id))

@api.post("/auth/login")
def login():
    body = request.get_json(force=True)
    user_id = body.get("user_id")
    password = body.get("password")
    if not user_id or not password:
        return jsonify({"status": "error", "message": "Missing credentials"}), 400
    with db.get_conn() as conn:
        row = conn.execute("SELECT * FROM users WHERE user_id=? AND password=?", (user_id, password)).fetchone()
        if not row:
            return jsonify({"status": "error", "message": "Invalid ID or password"}), 401
        return jsonify({"status": "ok", "user": dict(row)})

@api.post("/auth/register")
def register():
    body = request.get_json(force=True)
    try:
        with db.get_conn() as conn:
            conn.execute(
                "INSERT INTO users (user_id, password, role, full_name) VALUES (?, ?, ?, ?)",
                (body["user_id"], body["password"], body["role"], body.get("full_name", ""))
            )
        return jsonify({"status": "ok"})
    except Exception as exc:
        return jsonify({"status": "error", "message": "UserID already exists or invalid payload."}), 400

import base64
from pathlib import Path

@api.post("/students/<student_id>/upload_faces")
def upload_faces(student_id):
    body = request.get_json(force=True)
    frames = body.get("frames", [])
    if not frames:
         return jsonify({"status": "error", "message": "No frames provided"}), 400
         
    with db.get_conn() as conn:
         usr = conn.execute("SELECT full_name FROM users WHERE user_id=?", (student_id,)).fetchone()
         name = usr["full_name"] if usr else student_id

    # Secure Directory Mapping
    safe_name = "".join([c if c.isalnum() else "_" for c in name])
    target_dir = Path("data") / "known_faces" / "CSE-D-2026" / f"{student_id}_{safe_name}"
    target_dir.mkdir(parents=True, exist_ok=True)
    
    for idx, b64_str in enumerate(frames):
        try:
            if ',' in b64_str:
                b64_str = b64_str.split(',', 1)[1]
            img_data = base64.b64decode(b64_str)
            file_path = target_dir / f"{student_id}_{idx+1:03d}.jpg"
            with open(file_path, "wb") as f:
                f.write(img_data)
        except Exception as e:
            print("Base64 Decode Error:", e)
            
    # Asynchronous Re-Training: Nuke the old Cache so DeepFace builds a new one!
    def retrain_model():
        pkl_paths = Path("data/known_faces/CSE-D-2026").glob("representations*.pkl")
        for p in pkl_paths:
             p.unlink()
        print(f"[*] Neural embeddings cache invalidated. DeepFace will automatically re-train '{student_id}' on next active daemon boot!")

    threading.Thread(target=retrain_model).start()
    return jsonify({"status": "ok", "message": f"{len(frames)} physical frames extracted and trained."})
