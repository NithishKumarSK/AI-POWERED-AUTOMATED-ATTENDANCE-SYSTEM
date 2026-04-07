import os
from pathlib import Path
from deepface import DeepFace
import traceback

db_path = str(Path("data") / "known_faces")
img_path = str(Path(db_path) / "23R91A05L6_Nithish_Kumar" / "23R91A05L6_Nithish_Kumar_0.jpg")

print(f"Testing DeepFace... DB: {db_path}")
try:
    print("Testing OPENCV with Facenet")
    dfs1 = DeepFace.find(img_path=img_path, db_path=db_path, model_name="Facenet", detector_backend="opencv", enforce_detection=False, silent=False)
    print("OPENCV OUTPUT:", dfs1)
except Exception as e:
    print("FATAL OPENCV ERROR:")
    traceback.print_exc()
