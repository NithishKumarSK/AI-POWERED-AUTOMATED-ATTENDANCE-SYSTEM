import sqlite3
from pathlib import Path

db_path = Path("database/attendance.db").resolve()
if not db_path.exists():
    print(f"DB not found at {db_path}")
    exit(0)

print("Purging duplicate shadow periods...")

with sqlite3.connect(db_path) as conn:
    conn.row_factory = sqlite3.Row
    
    # Get all distinct (date_string, period_number) pairs that have MORE than 1 entry
    dupes = conn.execute("""
        SELECT date_string, period_number, COUNT(period_id) as c 
        FROM periods 
        WHERE period_number > 0 AND date_string != '' 
        GROUP BY date_string, period_number 
        HAVING c > 1
    """).fetchall()
    
    for d in dupes:
        ds = d["date_string"]
        pn = d["period_number"]
        
        # Get all period_ids for this specific block, DESCENDING (newest first)
        rows = conn.execute("SELECT period_id FROM periods WHERE date_string=? AND period_number=? ORDER BY period_id DESC", (ds, pn)).fetchall()
        
        # Keep the exact 1 newest one, destroy ALL others mathematically
        if len(rows) > 1:
            for bad in rows[1:]:
                pid = bad["period_id"]
                conn.execute("DELETE FROM detection_logs WHERE period_id=?", (pid,))
                conn.execute("DELETE FROM period_checks WHERE period_id=?", (pid,))
                conn.execute("DELETE FROM final_attendance WHERE period_id=?", (pid,))
                conn.execute("DELETE FROM overrides WHERE period_id=?", (pid,))
                conn.execute("DELETE FROM periods WHERE period_id=?", (pid,))

    conn.commit()
print("Duplicates totally eradicated!")
