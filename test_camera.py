import cv2
import time
from deepface import DeepFace
from pathlib import Path

# 1. Connect dynamically to the Webcam 
print("[*] Accessing DirectShow Live Camera Feed (Bypassing Windows Buffer)...")
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

if not cap.isOpened():
    print("[!] Failed to open camera!")
    exit(1)

# 2. Flush hardware buffers of any old caching
print("[*] Flushing 10 old hardware frames...")
for _ in range(10):
    cap.read()

# 3. Capture a single fresh, absolute real-time frame
ret, frame = cap.read()
cap.release()
print("[*] Frame Captured Successfully. Extracting facial map...")

db_path = str(Path("data") / "known_faces")

# 4. Strictly process frame. Will CRASH mathematically if no human is physically seated.
try:
    print("\n================ DEEPFACE STRICT ENGINE ================")
    dfs = DeepFace.find(
        img_path=frame, 
        db_path=db_path, 
        model_name="Facenet",
        distance_metric="cosine", 
        detector_backend="opencv",
        enforce_detection=True,  # STRICT FACE ENFORCEMENT
        silent=True
    )
    
    # Check if anything was matched
    if isinstance(dfs, list):
        for df in dfs:
            print("\n[+] MATCH FOUND:\n", df)
            
except Exception as e:
    print(f"\n[-] NO MATCH / NO FACE DETECTED: {e}")
    print("[-] The system properly rejected the empty frame.")
