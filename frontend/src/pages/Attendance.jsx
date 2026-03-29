import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { DatabaseZap, Camera, RefreshCw } from 'lucide-react';

const facultySubjectMap = {
    'ESHIRISHA': 'Machine Learning',
    'BPRIYANKA': 'FLAT',
    'SK': 'Artificial Intelligence',
    'AMOUNIKA': 'Scripting Languages',
    'BNAVEENA': 'FIOT',
    'PSWETHA': 'IOMP',
    'JANAKI': 'Environmental Science',
};

const Attendance = () => {
  const navigate = useNavigate();
  const authRole = localStorage.getItem('auth_role') || 'student';
  const authId = localStorage.getItem('auth_id') || 'GUEST';

  const [students, setStudents] = useState([]);
  const [duration, setDuration] = useState(60);
  const [checks, setChecks] = useState(2);
  const [classId, setClassId] = useState(`CSE-D-2026 - ${facultySubjectMap[authId] || 'General'}`);
  const [runStatus, setRunStatus] = useState('');
  
  // A local map holding manual overrides or status changes for the UI
  const [attendanceState, setAttendanceState] = useState({});

  useEffect(() => {
     if (authRole === 'student') {
         return;
     }
     fetch('http://127.0.0.1:5000/api/classes/CSE-D-2026/students')
         .then(res => res.json())
         .then(data => {
            setStudents(data);
            const initialObj = {};
            data.forEach(s => { initialObj[s.student_id] = 'ABSENT'; });
            setAttendanceState(initialObj);
         })
         .catch(err => console.error(err));
  }, [authRole]);

  const handleRunPeriod = (e) => {
     e.preventDefault();
     setRunStatus('Initializing TKREC CCTV Daemon...');
     fetch('http://127.0.0.1:5000/api/periods/run', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
          class_id: classId,
          duration_minutes: duration,
          checks_count: checks,
          seconds_per_minute: 1.0
       })
     })
     .then(res => res.json())
     .then(data => {
       if(data.status === 'error') {
          setRunStatus(`System Error: ${data.message}`);
       } else {
          setRunStatus(`Active! AI is now silently hunting in the background for ${classId}.`);
       }
     })
     .catch(err => setRunStatus(`Networking Error: ${err.message}`));
  };

  const toggleAttendance = (student_id) => {
     setAttendanceState(prev => ({
        ...prev,
        [student_id]: prev[student_id] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
     }));
  };

  if (authRole === 'student') {
     const studentPeriodsData = [
         { date: '04-03-2026', p: 1, prof: 'ESHIRISHA', sub: 'Machine Learning', status: 'PRESENT' },
         { date: '04-03-2026', p: 2, prof: 'SK', sub: 'Artificial Intelligence', status: 'ABSENT' },
         { date: '04-03-2026', p: 3, prof: 'BPRIYANKA', sub: 'FLAT', status: 'PRESENT' },
         { date: '04-03-2026', p: 4, prof: 'AMOUNIKA', sub: 'Scripting Languages', status: 'ABSENT' },
         { date: '04-03-2026', p: 5, prof: 'BNAVEENA', sub: 'FIOT', status: 'PRESENT' },
         { date: '04-03-2026', p: 6, prof: 'PSWETHA', sub: 'IOMP', status: 'PRESENT' },
         
         { date: '05-03-2026', p: 1, prof: 'JANAKI', sub: 'Environmental Science', status: 'ABSENT' },
         { date: '05-03-2026', p: 2, prof: 'SK', sub: 'Artificial Intelligence', status: 'PRESENT' },
         { date: '05-03-2026', p: 3, prof: 'ESHIRISHA', sub: 'Machine Learning', status: 'PRESENT' },
     ];

     return (
        <div className="min-h-screen bg-[#0b0e14] text-gray-200 font-sans flex">
           <Sidebar />
           <div className="ml-64 flex-1 p-12 overflow-y-auto">
              <div className="max-w-[1000px] mx-auto space-y-6">
                 
                 <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl shadow-lg flex items-center justify-between">
                    <div>
                       <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                          <DatabaseZap className="w-8 h-8 text-[#d29922]" />
                          Student Period Ledger
                       </h1>
                       <p className="text-gray-400 text-sm mt-2">Hour-by-Hour Verification Tracking</p>
                    </div>
                 </div>

                 <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                       <thead className="bg-[#0d1117] border-b border-[#30363d] text-gray-400 tracking-wider uppercase text-xs">
                          <tr>
                             <th className="py-4 px-6">Timestamp</th>
                             <th className="py-4 px-6 border-l border-[#30363d]">Period</th>
                             <th className="py-4 px-6 border-l border-[#30363d]">Faculty Name</th>
                             <th className="py-4 px-6 border-l border-[#30363d]">Subject Stream</th>
                             <th className="py-4 px-6 border-l border-[#30363d] text-center w-32">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-[#30363d]">
                          {studentPeriodsData.map((row, i) => (
                             <tr key={i} className="hover:bg-[#1f2937]/30 transition-colors">
                                <td className="py-3 px-6 text-gray-400 font-medium">{row.date}</td>
                                <td className="py-3 px-6 font-mono font-bold text-[#58a6ff] border-l border-[#30363d]/50 bg-[#0b0e14]/30">{row.p}</td>
                                <td className="py-3 px-6 text-gray-300 font-semibold border-l border-[#30363d]/50">{row.prof}</td>
                                <td className="py-3 px-6 text-gray-500 font-medium border-l border-[#30363d]/50 text-sm">{row.sub}</td>
                                <td className="py-3 px-6 border-l border-[#30363d]/50 text-center">
                                   <div className={`mx-auto w-full py-1.5 rounded text-xs font-bold tracking-widest border ${row.status === 'PRESENT' ? 'bg-[#238636]/10 border-[#2ea043]/30 text-[#3fb950]' : 'bg-[#da3633]/10 border-[#da3633]/30 text-[#ff7b72]'}`}>
                                      {row.status}
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>

              </div>
           </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] font-sans text-gray-200 flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-12 overflow-y-auto w-full">
        <div className="max-w-[1200px] mx-auto space-y-8">
          
          <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl flex justify-between items-center shadow-lg">
             <div>
                <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                   <DatabaseZap className="w-8 h-8 text-[#2ea043]" />
                   AI Deployment Hub & Class Register
                </h1>
                <p className="text-gray-400 text-sm mt-2">Initialize Autonomous Routines and Manually Audit Live Feed</p>
             </div>
             
             <button 
                onClick={handleRunPeriod} 
                className="bg-[#238636] hover:bg-[#2ea043] text-white font-bold px-8 py-3 rounded-xl tracking-wide shadow-[0_0_15px_rgba(35,134,54,0.3)] transition-all flex items-center gap-2 hover:scale-105"
             >
               <Camera className="w-5 h-5" /> Start CCTV Monitoring
             </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
             {/* Left - Deployment Config */}
             <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 h-max shadow-inner">
                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6 border-b border-[#30363d] pb-2">Target Config</h3>
                <div className="space-y-6">
                   <div>
                     <label className="block text-gray-400 font-medium mb-2 text-sm">Target Descriptor</label>
                     <input type="text" value={classId} onChange={e=>setClassId(e.target.value)}
                            className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2.5 text-gray-200 focus:border-blue-500 focus:outline-none transition-colors" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-gray-400 font-medium mb-2 text-sm">Mins</label>
                         <input type="number" value={duration} onChange={e=>setDuration(parseInt(e.target.value))}
                              className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2.5 text-gray-200 focus:border-blue-500 font-mono text-center" />
                      </div>
                      <div>
                         <label className="block text-gray-400 font-medium mb-2 text-sm">Sweeps</label>
                         <input type="number" value={checks} onChange={e=>setChecks(parseInt(e.target.value))}
                              className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2.5 text-gray-200 focus:border-blue-500 font-mono text-center" />
                      </div>
                   </div>
                </div>
                {runStatus && (
                   <div className={`mt-6 p-4 rounded-lg font-medium text-sm text-center border ${runStatus.includes('Error') ? 'bg-[#ff7b72]/10 border-[#ff7b72]/30 text-[#ff7b72]' : 'bg-[#58a6ff]/10 border-[#58a6ff]/30 text-[#58a6ff]'}`}>
                      {runStatus}
                   </div>
                )}
             </div>

             {/* Right - Live Roster Overview */}
             <div className="xl:col-span-2 bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="bg-[#1f2937]/30 border-b border-[#30363d] p-4 flex justify-between items-center">
                   <span className="font-semibold text-gray-300">Live Period Fallback Register</span>
                   <button className="text-gray-500 hover:text-white transition-colors duration-200" title="Refresh local states"><RefreshCw className="w-4 h-4" /></button>
                </div>
                
                <div className="flex-1 overflow-auto custom-scrollbar" style={{maxHeight: "600px"}}>
                   <table className="w-full text-left">
                      <thead className="sticky top-0 bg-[#0d1117] border-b border-[#30363d] shadow-sm z-10">
                         <tr>
                            <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">S.No</th>
                            <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-l border-[#30363d]">Roll No</th>
                            <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-l border-[#30363d]">Full Name</th>
                            <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest border-l border-[#30363d] text-center w-28">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[#30363d]">
                         {students.map((student, idx) => {
                            const currentStatus = attendanceState[student.student_id];
                            const isPresent = currentStatus === 'PRESENT';
                            return (
                               <tr key={student.student_id} className="hover:bg-[#1f2937]/30 transition-colors">
                                  <td className="py-3 px-6 font-mono text-gray-500 font-bold">{idx + 1}</td>
                                  <td className="py-3 px-6 font-mono font-bold text-blue-400 border-l border-[#30363d]/50 bg-[#0b0e14]/30">{student.student_id}</td>
                                  <td className="py-3 px-6 font-medium text-gray-300 border-l border-[#30363d]/50 text-sm w-full">{student.full_name}</td>
                                  <td className="py-2 px-6 border-l border-[#30363d]/50 text-center">
                                     <button 
                                        onClick={() => toggleAttendance(student.student_id)}
                                        className={`w-full py-1.5 rounded-lg text-xs font-bold tracking-widest border transition-all ${
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
             </div>
             
          </div>

        </div>
      </div>
    </div>
  );
};

export default Attendance;
