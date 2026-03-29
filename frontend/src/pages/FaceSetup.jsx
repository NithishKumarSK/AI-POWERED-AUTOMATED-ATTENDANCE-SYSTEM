import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Camera, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

const directions = [
  "Look Straight Ahead",
  "Turn slightly LEFT",
  "Turn slightly RIGHT",
  "Tilt head slightly UP",
  "Tilt head slightly DOWN"
];

const framesPerDirection = 10;
const totalFrames = directions.length * framesPerDirection;

const FaceSetup = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  const authRole = localStorage.getItem('auth_role') || 'student';
  const authId = localStorage.getItem('auth_id') || '';

  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentDirectionIdx, setCurrentDirectionIdx] = useState(0);
  const [framesCaught, setFramesCaught] = useState(0);
  const [b64Frames, setB64Frames] = useState([]);
  
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success, error

  // Redirect if Faculty somehow gets here or if already registered!
  useEffect(() => {
    if (authRole === 'staff') {
       navigate('/home');
    }
    if (localStorage.getItem('face_registered') === 'true') {
       setUploadState('success');
    }
  }, [authRole, navigate]);

  // Request WebCam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setHasCameraAccess(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Please allow Camera Access in your browser settings to proceed with the 360° Setup!");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
       const tracks = videoRef.current.srcObject.getTracks();
       tracks.forEach(t => t.stop());
    }
  };

  // Automated 50-Frame Capture Loop
  const beginCapture = () => {
      setIsCapturing(true);
      setFramesCaught(0);
      setB64Frames([]);
      setCurrentDirectionIdx(0);
      
      let localFrames = [];
      let currentIdx = 0; // 0 to 4 (directions)
      let innerCount = 0; // 0 to 9 (frames within direction)

      const captureInterval = setInterval(() => {
         if(!videoRef.current || !canvasRef.current) return;
         
         const context = canvasRef.current.getContext('2d');
         context.drawImage(videoRef.current, 0, 0, 640, 480);
         const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.8);
         
         localFrames.push(base64Image);
         setB64Frames([...localFrames]);
         
         innerCount++;
         setFramesCaught((prev) => prev + 1);

         if (innerCount >= framesPerDirection) {
            currentIdx++;
            innerCount = 0;
            if (currentIdx < directions.length) {
                setCurrentDirectionIdx(currentIdx);
            } else {
                clearInterval(captureInterval);
                finishCapture(localFrames);
            }
         }
      }, 400); // Capture a frame roughly every ~400ms to allow them time to slightly move
  };

  const finishCapture = async (finalFrames) => {
      setIsCapturing(false);
      stopCamera();
      setUploadState('uploading');

      try {
         const response = await fetch(`http://127.0.0.1:5000/api/students/${authId}/upload_faces`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ frames: finalFrames })
         });
         const data = await response.json();
         if (data.status === 'ok') {
            setUploadState('success');
            localStorage.setItem('face_registered', 'true');
         } else {
            setUploadState('error');
            alert(data.message);
         }
      } catch (err) {
         setUploadState('error');
         alert("Networking error contacting AI backend.");
      }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] font-sans text-gray-200 flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-12 overflow-y-auto w-full">
        
        <div className="max-w-[800px] mx-auto space-y-8">
           
           <div>
              <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
                 <Camera className="w-8 h-8 text-[#2ea043]" />
                 360° Facial Biometric Protocol
              </h1>
              <p className="text-gray-400 mt-2">
                 TKREC Enterprise One-Time Registration. The system requires exactly 50 localized frames 
                 to build an unshakeable 360-degree VGG embedding matrix for CCTV integration.
              </p>
           </div>

           {/** Success Lockout */}
           {uploadState === 'success' && (
             <div className="bg-[#238636]/10 border border-[#2ea043]/30 rounded-xl p-10 flex flex-col items-center justify-center text-center shadow-lg">
                <CheckCircle2 className="w-20 h-20 text-[#2ea043] mb-4" />
                <h2 className="text-2xl font-bold text-[#2ea043] mb-3">Model Registration Locked</h2>
                <p className="text-[#2ea043]/80 mb-6 max-w-md">
                   Your biometric neural maps have been securely pushed to the backend and the DeepFace model is actively re-training. 
                   Continuous registration is disabled to prevent spoofing.
                </p>
                <div className="bg-[#2ea043]/20 text-[#2ea043] font-mono px-4 py-2 rounded font-bold uppercase tracking-widest text-sm">
                   AWAITING FIELD VERIFICATION
                </div>
             </div>
           )}

           {/** Pending Setup Flow */}
           {uploadState !== 'success' && (
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-xl p-8 flex flex-col items-center">
                 
                 {/* Live Camera Feed Feed */}
                 <div className="relative w-[640px] h-[480px] bg-black rounded-lg border-2 border-[#30363d] overflow-hidden shadow-inner">
                    <video 
                       ref={videoRef} 
                       className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect!
                       muted 
                       playsInline 
                    />
                    <canvas ref={canvasRef} width="640" height="480" className="hidden" />
                    
                    {!hasCameraAccess && !isCapturing && uploadState !== 'uploading' && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1117]/80">
                          <Camera className="w-16 h-16 text-gray-500 mb-4" />
                          <button 
                             onClick={startCamera}
                             className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
                          >
                             Enable Lens Connection
                          </button>
                       </div>
                    )}

                    {isCapturing && (
                       <>
                         <div className="absolute top-4 left-4 right-4 flex justify-between items-center bg-black/50 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
                            <span className="font-bold text-red-500 flex items-center gap-2">
                               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                               REC
                            </span>
                            <span className="font-bold text-white font-mono">{framesCaught} / 50</span>
                         </div>
                         <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                            <div className="inline-block bg-[#238636] text-white px-8 py-4 rounded-2xl text-2xl font-black shadow-[0_0_30px_rgba(35,134,54,0.5)] border-2 border-white/20 uppercase tracking-widest animate-bounce">
                               {directions[currentDirectionIdx]}
                            </div>
                         </div>
                       </>
                    )}

                    {uploadState === 'uploading' && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1117]/90 z-20">
                          <Cpu className="w-16 h-16 text-[#2ea043] mb-4 animate-pulse" />
                          <h3 className="text-xl font-bold text-gray-200">Injecting Embeddings...</h3>
                          <p className="text-gray-400 mt-2 font-mono">{b64Frames.length} Frames Extracted. Invalidating Local VGG Hash...</p>
                       </div>
                    )}
                 </div>

                 {/* Action Bar */}
                 <div className="mt-8 w-[640px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <ShieldAlert className="w-5 h-5 text-amber-500" />
                       <div className="text-sm text-gray-400">
                          <span className="text-gray-300 font-bold">STRICT RULES:</span><br/>
                          1. Ensure bright, even lighting.<br/>
                          2. Slowly pan your head precisely when prompted.
                       </div>
                    </div>
                    
                    {hasCameraAccess && !isCapturing && uploadState === 'idle' && (
                       <button 
                          onClick={beginCapture}
                          className="bg-[#238636] hover:bg-[#2ea043] text-white px-8 py-3 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(35,134,54,0.3)] hover:scale-105"
                       >
                          Initialize Override 360 Scan
                       </button>
                    )}
                 </div>

              </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default FaceSetup;
