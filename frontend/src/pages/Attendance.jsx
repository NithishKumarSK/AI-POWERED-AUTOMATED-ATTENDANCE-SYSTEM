import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { DatabaseZap, Camera, RefreshCw, Send, Calendar, Lock, TerminalSquare } from 'lucide-react';

const facultySubjectMap = {
    'ESHIRISHA': ['ML', 'ML LAB'],
    'BPRIYANKA': ['FLAT', 'FLAT/CRT'],
    'SK': ['AI', 'AI/CRT', 'AI-LAB', 'AI/IOMP'],
    'AMOUNIKA': ['SL', 'SL-LAB'],
    'BNAVEENA': ['FIOT'],
    'PSWETHA': ['FLAT/IOMP', 'ML/IOMP', 'AI/IOMP'], // IOMP handlers
    'JANAKI': ['ES'],
};

const timetableData = [
  { day: 'MON', periods: ['ML', 'FLAT', 'SL', 'LUNCH', 'FIOT', 'AI', 'ML'], spans: [1, 1, 1, 1, 1, 1, 1] },
  { day: 'TUE', periods: ['FLAT', 'FLAT/CRT', 'AI/CRT', 'LUNCH', 'SL', 'FIOT', 'ML'], spans: [1, 1, 1, 1, 1, 1, 1] },
  { day: 'WED', periods: ['AI-LAB(NB-204)', 'LUNCH', 'SL', 'AI', 'FIOT'], spans: [3, 1, 1, 1, 1] },
  { day: 'THU', periods: ['ML LAB(NB-204)', 'LUNCH', 'SL', 'FLAT', 'FIOT'], spans: [3, 1, 1, 1, 1] },
  { day: 'FRI', periods: ['SL', 'AI', 'FIOT', 'LUNCH', 'FLAT/IOMP', 'ML/IOMP', 'ES'], spans: [1, 1, 1, 1, 1, 1, 1] },
  { day: 'SAT', periods: ['SL-LAB(NB-204)', 'LUNCH', 'FLAT', 'AI/IOMP', 'ML/IOMP'], spans: [3, 1, 1, 1, 1] }
];

const LIVE_DAY_MAP = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function getActivePeriodInfo(authId, debugOverride) {
    if (debugOverride && debugOverride.periodNum > 0) {
        return {
           periodNum: debugOverride.periodNum,
           subject: debugOverride.subject,
           isAuthorized: true
        };
    }

    const now = new Date();
    const dayName = LIVE_DAY_MAP[now.getDay()];
    const mins = now.getHours() * 60 + now.getMinutes();
    
    let flatIdx = -1;
    let periodNum = 0;
    
    if (mins >= 580 && mins < 640) { flatIdx = 0; periodNum = 1; }
    else if (mins >= 640 && mins < 700) { flatIdx = 1; periodNum = 2; }
    else if (mins >= 700 && mins < 760) { flatIdx = 2; periodNum = 3; }
    else if (mins >= 760 && mins < 800) { flatIdx = 3; periodNum = 0; } // Lunch
    else if (mins >= 800 && mins < 860) { flatIdx = 4; periodNum = 4; }
    else if (mins >= 860 && mins < 920) { flatIdx = 5; periodNum = 5; }
    else if (mins >= 920 && mins < 980) { flatIdx = 6; periodNum = 6; }
    
    if (flatIdx === -1 || periodNum === 0) return { periodNum: 0, subject: 'OUTSIDE ACADEMIC HOURS', isAuthorized: false };
    
    const todayRow = timetableData.find(r => r.day === dayName);
    if (!todayRow) return { periodNum: 0, subject: 'WEEKEND / HOLIDAY', isAuthorized: false };
    
    // Flatten the spans into a fixed 7-element array
    let flatPeriods = [];
    for (let i = 0; i < todayRow.periods.length; i++) {
        for (let s = 0; s < todayRow.spans[i]; s++) {
            flatPeriods.push(todayRow.periods[i]);
        }
    }
    
    const subjectName = flatPeriods[flatIdx];
    
    // Check Authorization
    const mySubjects = facultySubjectMap[authId] || [];
    const isAuthorized = mySubjects.some(sub => subjectName.includes(sub));
    
    return { periodNum, subject: subjectName, isAuthorized };
}

const Attendance = () => {
  const navigate = useNavigate();
  const authRole = localStorage.getItem('auth_role') || 'student';
  const authId = localStorage.getItem('auth_id') || 'GUEST';

  // --- Student State ---
  const [studentHistory, setStudentHistory] = useState([]);

  // --- Faculty State ---
  const [students, setStudents] = useState([]);
  const [duration, setDuration] = useState(60);
  const [checks, setChecks] = useState(2);
  const [runStatus, setRunStatus] = useState('');
  
  // Faculty Custom Manual Form State
  const [attendanceState, setAttendanceState] = useState({});
  const [topicTold, setTopicTold] = useState('');
  const [bulkSubmitStatus, setBulkSubmitStatus] = useState('');

  // Project Presentation Demo State (Overrides Live Clock!)
  const [demoMode, setDemoMode] = useState(false);
  const [demoPeriod, setDemoPeriod] = useState(1);

  // Lock State
  const [timeInfo, setTimeInfo] = useState({ periodNum: 0, subject: '', isAuthorized: false });
  const [isFinalizedToday, setIsFinalizedToday] = useState(false);
  const currentDateTimeStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

  useEffect(() => {
     if (authRole === 'student') {
         fetch(`http://127.0.0.1:5000/api/students/${authId}/attendance`)
           .then(res => res.json())
           .then(data => setStudentHistory(data))
           .catch(err => console.error(err));
         return;
     } else {
         fetch('http://127.0.0.1:5000/api/classes/CSE-D-2026/students')
             .then(res => res.json())
             .then(data => {
                setStudents(data);
                const initialObj = {};
                data.forEach(s => { initialObj[s.student_id] = 'ABSENT'; });
                setAttendanceState(initialObj);
             })
             .catch(err => console.error(err));
             
         // Evaluate Time Clock
         let debugParams = null;
         if (demoMode) {
             debugParams = { periodNum: demoPeriod, subject: facultySubjectMap[authId]?.[0] || 'Machine Learning' };
         }
         
         const info = getActivePeriodInfo(authId, debugParams);
         setTimeInfo(info);
         
         if (info.isAuthorized && info.periodNum > 0) {
             const ds = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
             fetch(`http://127.0.0.1:5000/api/periods/status?date_string=${ds}&period_number=${info.periodNum}`)
                .then(res => res.json())
                .then(data => setIsFinalizedToday(data.is_finalized))
                .catch(err => console.error(err));
         }
     }
  }, [authRole, authId, demoMode, demoPeriod]);

  const uiLocked = !timeInfo.isAuthorized || isFinalizedToday || timeInfo.periodNum === 0;

  const handleRunPeriod = (e) => {
     e.preventDefault();
     if (uiLocked) return;
     
     setRunStatus(`Initializing TKREC CCTV Daemon for Period ${timeInfo.periodNum}...`);
     const ds = new Date().toLocaleDateString('en-CA');
     
     fetch('http://127.0.0.1:5000/api/periods/run', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
          class_id: `CSE-D-2026 - ${timeInfo.subject}`,
          duration_minutes: duration,
          checks_count: checks,
          seconds_per_minute: 1.5, // PRO SPEED OVERRIDE: 60 minutes takes exactly 90 SECONDS (1.5s per min)
          topic: topicTold || 'General AI Monitored Lecture',
          period_number: timeInfo.periodNum,
          subject_name: timeInfo.subject,
          date_string: ds
       })
     })
     .then(res => res.json())
     .then(data => {
       if(data.status === 'error') {
          setRunStatus(`System Error: ${data.message}`);
       } else {
          setRunStatus(`Active! AI is now silently hunting in the background for CSE-D-2026! (Wait ~90 seconds)`);
          setIsFinalizedToday(true);
       }
     })
     .catch(err => setRunStatus(`Networking Error: ${err.message}`));
  };

  const toggleAttendance = (student_id) => {
     if (uiLocked) return;
     setAttendanceState(prev => ({
        ...prev,
        [student_id]: prev[student_id] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
     }));
  };

  const handleBulkManualSubmit = (e) => {
     e.preventDefault();
     if (uiLocked) return;
     
     if (!topicTold) {
         setBulkSubmitStatus('Error: You must enter the Topic Told in class.');
         return;
     }

     setBulkSubmitStatus('Submitting...');
     const ds = new Date().toLocaleDateString('en-CA');
     
     fetch('http://127.0.0.1:5000/api/periods/manual_bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           class_id: `CSE-D-2026 - ${timeInfo.subject}`,
           topic: topicTold,
           statuses: attendanceState,
           lecturer: authId,
           period_number: timeInfo.periodNum,
           subject_name: timeInfo.subject,
           date_string: ds
        })
     })
     .then(res => res.json())
     .then(data => {
        if(data.status === 'error') {
           setBulkSubmitStatus(`Error: ${data.message}`);
        } else {
           setBulkSubmitStatus(`Successfully submitted manual attendance overrides for Period ${timeInfo.periodNum}!`);
           setIsFinalizedToday(true);
        }
     })
     .catch(err => setBulkSubmitStatus(`Network Error: ${err.message}`));
  };

  // ================= STUDENT VIEW =================
  if (authRole === 'student') {
     return (
        <div className="min-h-screen bg-[#0b0e14] text-gray-200 font-sans flex text-[13px]">
           <Sidebar />
           <div className="ml-64 flex-1 p-12 overflow-y-auto">
              <div className="max-w-[1000px] mx-auto space-y-6">
                 
                 <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl shadow-lg flex items-center justify-between">
                    <div>
                       <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                          <DatabaseZap className="w-8 h-8 text-[#d29922]" />
                          Student Period Ledger
                       </h1>
                       <p className="text-gray-400 text-sm mt-2">Hour-by-Hour Verification Tracking synchronized with CCTV Logs</p>
                    </div>
                 </div>

                 <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                       <thead className="bg-[#0d1117] border-b border-[#30363d] text-gray-400 tracking-wider uppercase text-xs">
                          <tr>
                             <th className="py-4 px-6">Timestamp / Date</th>
                             <th className="py-4 px-6 border-l border-[#30363d]">Period Block</th>
                             <th className="py-4 px-6 border-l border-[#30363d]">Subject Stream</th>
                             <th className="py-4 px-6 border-l border-[#30363d] text-center w-32">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-[#30363d]">
                          {studentHistory.length === 0 ? (
                             <tr>
                                <td colSpan="4" className="p-10 text-center font-mono text-gray-500 uppercase tracking-widest text-xs">No attendance records found in database.</td>
                             </tr>
                          ) : studentHistory.map((row, i) => {
                             const parseDate = new Date(row.started_at);
                             const fmtDate = parseDate.toLocaleDateString('en-IN');
                             const subjName = row.class_id.split(' - ')[1] || row.class_id;
                             return (
                             <tr key={i} className="hover:bg-[#1f2937]/30 transition-colors text-sm">
                                <td className="py-3 px-6 text-gray-400 font-medium">{fmtDate}</td>
                                <td className="py-3 px-6 font-mono font-bold text-[#58a6ff] border-l border-[#30363d]/50 bg-[#0b0e14]/30">Period {row.period_number || '?'}</td>
                                <td className="py-3 px-6 text-gray-300 font-semibold border-l border-[#30363d]/50">{subjName}</td>
                                <td className="py-3 px-6 border-l border-[#30363d]/50 text-center">
                                   <div className={`mx-auto w-full py-1.5 rounded text-xs font-bold tracking-widest border ${row.final_status === 'PRESENT' ? 'bg-[#238636]/10 border-[#2ea043]/30 text-[#3fb950]' : 'bg-[#da3633]/10 border-[#da3633]/30 text-[#ff7b72]'}`}>
                                      {row.final_status}
                                   </div>
                                </td>
                             </tr>
                          )})}
                       </tbody>
                    </table>
                 </div>

              </div>
           </div>
        </div>
     );
  }

  // ================= FACULTY VIEW =================
  return (
    <div className="min-h-screen bg-[#0b0e14] font-sans text-gray-200 flex text-[13px]">
      <Sidebar />
      <div className="flex-1 ml-64 p-6 overflow-y-auto w-full">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl shadow-lg w-full flex flex-col gap-4">
             <div className="flex justify-between items-center w-full">
                 <div>
                    <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                       <DatabaseZap className="w-8 h-8 text-[#2ea043]" />
                       AI Deployment Hub & Timetable Sync
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">Initialize Autonomous Routines and Formally Submit Manual Audit Logs</p>
                 </div>
                 
                 <div className="flex items-center gap-4">
                     {/* PRESENTATION DEMO OVERRIDE */}
                     <div className="bg-[#0d1117] border border-[#d29922]/50 p-2 rounded-lg flex items-center gap-3 mr-4">
                        <TerminalSquare className="w-4 h-4 text-[#d29922]" />
                        <label className="text-[#d29922] font-bold text-xs uppercase tracking-wider">Demo Override</label>
                        <input type="checkbox" checked={demoMode} onChange={(e) => setDemoMode(e.target.checked)} className="mr-2" />
                        {demoMode && (
                           <select value={demoPeriod} onChange={(e) => setDemoPeriod(parseInt(e.target.value))} className="bg-[#161b22] text-white text-xs border border-[#30363d] rounded px-2 py-1">
                              {[1,2,3,4,5,6].map(p => <option key={p} value={p}>Force Period {p}</option>)}
                           </select>
                        )}
                     </div>

                     <button 
                        onClick={handleRunPeriod} 
                        disabled={uiLocked}
                        className={`font-bold px-8 py-3 rounded-xl tracking-wide transition-all flex items-center gap-2 uppercase text-sm ${uiLocked ? 'bg-[#1f2937] text-gray-500 cursor-not-allowed border border-[#30363d]' : 'bg-[#238636] hover:bg-[#2ea043] text-white shadow-[0_0_15px_rgba(35,134,54,0.3)] hover:scale-105'}`}
                     >
                       {uiLocked ? <Lock className="w-5 h-5" /> : <Camera className="w-5 h-5" />} 
                       Start CCTV Routine
                     </button>
                 </div>
             </div>
             
             {/* Security Banner */}
             {uiLocked && (
                 <div className="bg-[#da3633]/10 border border-[#da3633]/30 p-4 rounded-lg flex items-center gap-4 mt-2">
                     <Lock className="w-6 h-6 text-[#ff7b72]" />
                     <div>
                         <h3 className="text-[#ff7b72] font-bold tracking-wider uppercase text-sm">System Locked ({timeInfo.subject})</h3>
                         <p className="text-[#ff7b72]/80 mt-1">
                             {timeInfo.periodNum === 0 ? "You are attempting to post attendance outside of academic working hours (9:40 AM - 4:20 PM)." :
                              isFinalizedToday ? `Attendance for Period ${timeInfo.periodNum} has already been securely finalized for today. To run it again, enable Demo Override.` :
                              `You are logged in as ${authId}. You are not authorized to post attendance for ${timeInfo.subject} at Period ${timeInfo.periodNum}.`}
                         </p>
                     </div>
                 </div>
             )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full">
             <div className="xl:col-span-1 border border-[#30363d] rounded-xl flex flex-col overflow-hidden bg-[#0d1117] shadow-sm h-max">
                <div className="bg-[#1f2937]/50 text-center py-3 font-bold text-gray-300 uppercase tracking-widest text-xs border-b border-[#30363d]">CCTV System Parameters</div>
                <div className="p-6 space-y-6">
                   <div>
                     <label className="block text-gray-400 font-medium mb-2 text-sm">Target Descriptor</label>
                     <input type="text" value={`CSE-D-2026 - ${timeInfo.subject}`} disabled
                            className="w-full bg-[#161b22]/50 border border-[#30363d] rounded-lg px-4 py-2.5 text-gray-500 font-mono text-xs cursor-not-allowed" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-gray-400 font-medium mb-2 text-sm">Mins</label>
                         <input type="number" value={duration} disabled={uiLocked} onChange={e=>setDuration(parseInt(e.target.value))}
                              className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2 text-gray-200 focus:border-blue-500 font-mono text-center disabled:opacity-50" />
                      </div>
                      <div>
                         <label className="block text-gray-400 font-medium mb-2 text-sm">Sweeps</label>
                         <input type="number" value={checks} disabled={uiLocked} onChange={e=>setChecks(parseInt(e.target.value))}
                              className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2 text-gray-200 focus:border-blue-500 font-mono text-center disabled:opacity-50" />
                      </div>
                   </div>
                   {runStatus && (
                      <div className={`mt-2 p-3 text-xs rounded-lg font-mono tracking-widest text-center border ${runStatus.includes('Error') ? 'bg-[#ff7b72]/10 border-[#ff7b72]/30 text-[#ff7b72]' : 'bg-[#58a6ff]/10 border-[#58a6ff]/30 text-[#58a6ff]'}`}>
                         {runStatus}
                      </div>
                   )}
                </div>
             </div>

             <div className="xl:col-span-3 bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="bg-[#1f2937]/30 border-b border-[#30363d] p-4 flex justify-between items-center">
                   <span className="font-semibold text-gray-300 flex items-center gap-2"><Calendar size={16} className="text-[#d29922]" /> Official Class Attendance Submission Portal</span>
                   <button className="text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-2 text-xs" onClick={()=>setAttendanceState({})} disabled={uiLocked}><RefreshCw className="w-3 h-3" /> Reset Draft</button>
                </div>
                
                <div className="p-4 border-b border-[#30363d] bg-[#0d1117]/50 grid grid-cols-1 md:grid-cols-4 gap-6">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Timestamp / Date</label>
                      <input type="text" disabled value={currentDateTimeStr} className="w-full bg-[#161b22]/50 border border-[#30363d] rounded px-3 py-2 text-[#58a6ff] font-mono text-xs cursor-not-allowed" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Target Period</label>
                      <input type="text" disabled value={timeInfo.periodNum === 0 ? 'N/A' : `Period ${timeInfo.periodNum}`} className="w-full bg-[#161b22]/50 border border-[#30363d] rounded px-3 py-2 text-[#58a6ff] font-mono text-xs cursor-not-allowed" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Subject Stream</label>
                      <input type="text" disabled value={timeInfo.subject} className="w-full bg-[#161b22]/50 border border-[#30363d] rounded px-3 py-2 text-[#ff7b72] font-mono text-xs cursor-not-allowed" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 border-[#d29922] border-l-2 pl-2">Topic Told (Lecture)</label>
                      <input type="text" disabled={uiLocked} value={topicTold} onChange={(e)=>setTopicTold(e.target.value)} placeholder="e.g. Unit 3 Regex..." className="w-full bg-[#161b22] border border-[#30363d] rounded px-3 py-2 text-gray-200 outline-none focus:border-[#d29922] font-mono text-sm placeholder-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" />
                   </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar" style={{maxHeight: "500px"}}>
                   <table className="w-full text-left border-collapse opacity-90">
                      <thead className="sticky top-0 bg-[#0d1117] border-b border-[#30363d] shadow-sm z-10">
                         <tr>
                            <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">S.No</th>
                            <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-l border-[#30363d]">Roll No</th>
                            <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-l border-[#30363d]">Full Name</th>
                            <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-l border-[#30363d] text-center w-32">Set Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[#30363d]">
                         {students.map((student, idx) => {
                            const currentStatus = attendanceState[student.student_id] || 'ABSENT';
                            const isPresent = currentStatus === 'PRESENT';
                            return (
                               <tr key={student.student_id} className={`transition-colors ${uiLocked ? 'opacity-50' : 'hover:bg-[#1f2937]/30'}`}>
                                  <td className="py-3 px-6 font-mono text-gray-500 font-bold">{idx + 1}</td>
                                  <td className="py-3 px-6 font-mono font-bold text-blue-400 border-l border-[#30363d]/50 bg-[#0b0e14]/30">{student.student_id}</td>
                                  <td className="py-3 px-6 font-medium text-gray-300 border-l border-[#30363d]/50 w-full">{student.full_name}</td>
                                  <td className="py-2 px-6 border-l border-[#30363d]/50 text-center">
                                     <button 
                                        disabled={uiLocked}
                                        onClick={() => toggleAttendance(student.student_id)}
                                        className={`w-full py-1.5 rounded-lg text-xs font-bold tracking-widest border transition-all ${
                                           uiLocked ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed' :
                                           isPresent 
                                           ? 'bg-[#238636] border-[#2ea043] text-white shadow-[0_0_10px_rgba(35,134,54,0.3)]' 
                                           : 'bg-[#da3633]/20 border-[#da3633]/50 text-[#ff7b72] hover:bg-[#da3633]/40'
                                        }`}
                                     >
                                        {currentStatus}
                                     </button>
                                  </td>
                               </tr>
                            );
                         })}
                      </tbody>
                   </table>
                </div>

                <div className="bg-[#0d1117] border-t border-[#30363d] p-4 flex justify-between items-center">
                   <div className="flex-1">
                      {bulkSubmitStatus && <span className={`font-mono text-xs font-bold tracking-widest pl-4 ${bulkSubmitStatus.includes('Error') ? 'text-[#ff7b72]' : 'text-[#3fb950]'}`}>{bulkSubmitStatus}</span>}
                   </div>
                   <button 
                      disabled={uiLocked}
                      onClick={handleBulkManualSubmit}
                      className={`font-bold px-8 py-2.5 rounded-lg tracking-wider flex items-center gap-2 text-sm uppercase transition-all ${uiLocked ? 'bg-[#1f2937] text-gray-500 border border-[#30363d] cursor-not-allowed' : 'bg-[#1f6feb] hover:bg-[#388bfd] text-white shadow-[0_0_10px_rgba(31,111,235,0.4)]'}`}
                   >
                      <Send className="w-4 h-4" /> Submit Override
                   </button>
                </div>
             </div>
          </div>
          
          <div className="mb-20"></div>

        </div>
      </div>
    </div>
  );
};

export default Attendance;
