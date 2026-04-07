import os
from pathlib import Path
from deepface import DeepFace

db_path = str(Path("data") / "known_faces")
img_path = str(Path(db_path) / "23R91A05L6_Nithish_Kumar" / "23R91A05L6_Nithish_Kumar_0.jpg")

print(f"Testing DeepFace... DB: {db_path}")
try:
    dfs = DeepFace.find(
        img_path=img_path, 
        db_path=db_path, 
        model_name="Facenet512",
        distance_metric="cosine", 
        detector_backend="opencv",
        enforce_detection=False,
        threshold=1.5,
        silent=False
    )
    if isinstance(dfs, list):
        for df in dfs:
            print(df)
    else:
        print(dfs)
except Exception as e:
    print("FATAL DEEPFACE ERROR:", e)
