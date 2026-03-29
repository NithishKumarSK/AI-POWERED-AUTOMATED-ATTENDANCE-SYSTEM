import os
from dataclasses import dataclass
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]


@dataclass(frozen=True)
class Settings:
    camera_index: int = int(os.getenv("ATT_CAMERA_INDEX", "0"))
    match_threshold: float = float(os.getenv("ATT_MATCH_THRESHOLD", "0.95"))  # 95% stricter accuracy!

    default_duration_minutes: int = int(os.getenv("ATT_PERIOD_DURATION_MIN", "60"))
    default_checks_count: int = int(os.getenv("ATT_RANDOM_CHECKS_COUNT", "2")) # Exactly 2 checks per student
    default_presence_threshold: float = float(os.getenv("ATT_PRESENCE_THRESHOLD", "0.50")) # 1 out of 2 checks is enough
    min_instances_required: int = int(os.getenv("ATT_MIN_INSTANCES", "1"))

    db_path: str = str(ROOT_DIR / "database" / "attendance.db")
    embeddings_path: str = str(ROOT_DIR / "models" / "face_encodings.pkl")
    known_faces_dir: str = str(ROOT_DIR / "data" / "known_faces")


settings = Settings()
