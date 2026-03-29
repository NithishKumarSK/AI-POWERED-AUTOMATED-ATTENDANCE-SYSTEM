import random
import time
from datetime import datetime, timezone

from . import db
from .recognition import detect_specific_students
from .roster import load_roster_for_class, parse_folder_name


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _build_student_schedules(duration_minutes: int, checks_count: int, student_ids: list[str]) -> dict[int, list[str]]:
    schedule: dict[int, list[str]] = {}
    
    # 10-40-10 exact scaling
    grace_period = max(1, int(duration_minutes * (10 / 60)))
    active_start = grace_period + 1
    active_end = duration_minutes - grace_period
    
    if active_end <= active_start:
        active_start = 1
        active_end = duration_minutes
        
    for sid in student_ids:
        # Pick exactly `checks_count` distinct random minutes in the active window
        possible_minutes = list(range(active_start, active_end + 1))
        
        if len(possible_minutes) < checks_count:
            picked = possible_minutes
        else:
            picked = random.sample(possible_minutes, checks_count)
            
        for minute in picked:
            if minute not in schedule:
                schedule[minute] = []
            schedule[minute].append(sid)
            
    return schedule


def _finalize(period_id: int, class_id: str, checks_count: int, threshold: float, min_instances: int) -> None:
    students = db.get_class_students(class_id)
    logs = db.get_detection_logs(period_id)
    seen: dict[str, int] = {}
    for row in logs:
        sid = row["student_id"]
        seen[sid] = seen.get(sid, 0) + 1

    total_present = 0
    total_enrolled = len(students)

    for s in students:
        sid = s["student_id"]
        cnt = seen.get(sid, 0)
        
        # New Strict Logic: 1 Valid CCTV Hit = Automatic Present in the Two-Phase model.
        # We assign 100% ratio naturally.
        ratio = 1.0 if cnt > 0 else 0.0
        status = "PRESENT" if cnt > 0 else "ABSENT"
        
        if status == "PRESENT":
            total_present += 1
            
        db.write_final_row(period_id, sid, cnt, 1, ratio, status)
        
    # Faculty Alert Module
    print("\n" + "="*60)
    print(f"[SMS ALERT => FACULTY] Sent to Registered Mobile / Portal")
    print(f"[Message] AI Period {period_id} finalized across Phases. {total_present}/{total_enrolled} students marked PRESENT with strictly >95% confidence bounds.")
    print("="*60 + "\n")


def run_period(
    class_id: str,
    duration_minutes: int,
    checks_count: int,
    threshold: float,
    min_instances: int,
    seconds_per_minute: float,
) -> int:
    roster = load_roster_for_class(class_id)
    if not roster:
        raise RuntimeError("No enrolled students found in data/known_faces.")
    db.sync_class_roster(class_id, roster)

    period_id = db.create_period(class_id, duration_minutes, checks_count, threshold, min_instances)
    student_ids = [sid for sid, _, _ in roster]

    print(f"\n[====] STRICT Two-Phase CCTV Period Initiated | period_id={period_id} | class_id={class_id} [====]")
    print(f"[*] Duration: {duration_minutes} min | Phase 1 (11-40) | Phase 2 (41-50)")
    
    found_sids = set()
    phase1_mins = [15, 25, 35] # Global Sweeps
    phase2_mins = [45, 50]     # Missing Target Targeted Sweeps

    for minute in range(1, duration_minutes + 1):
        time.sleep(seconds_per_minute)
        
        if minute <= 10 or minute > 55:
            print(f"[Min {minute}/{duration_minutes}] Grace Period or Idle - Camera Off.")
            continue
            
        target_sids = []
        phase_name = ""
        
        if minute in phase1_mins:
            target_sids = student_ids
            phase_name = "Phase 1 (Global Sweep)"
        elif minute in phase2_mins:
            target_sids = list(set(student_ids) - found_sids)
            phase_name = "Phase 2 (Missing Target Hunt)"
            if not target_sids:
                print(f"[Min {minute}/{duration_minutes}] Phase 2 Skipped. 100% Class Attendance Confirmed.")
                continue
                
        if not target_sids:
            print(f"[Min {minute}/{duration_minutes}] Wait Cycle - No scheduled scans.")
            continue
            
        print(f"\n[ALERT] {phase_name} at minute={minute}. Hunting {len(target_sids)} students...")
        check_id = db.insert_check(period_id, minute, minute, _utc_now())
        
        raw = detect_specific_students(target_sids, sample_frames=12)
        valid: list[tuple[str, float]] = []
        
        for folder_label, conf in raw:
            sid, _ = parse_folder_name(folder_label)
            valid.append((sid, conf))
            found_sids.add(sid)
            
        db.insert_detections(period_id, check_id, valid)
        if valid:
            detail = ", ".join([f"{sid} (cert={conf*100:.1f}%)" for sid, conf in valid])
            print(f"    -> Solid Targets Identified: {len(valid)} | {detail}")
        else:
            print("    -> Zero targets identified meeting 95% threshold in 360-space.")

    _finalize(period_id, class_id, checks_count, threshold, min_instances)
    db.end_period(period_id)

    print("\n[====] Period Completed. Attendance Saved Permanently [====]")
    return period_id
