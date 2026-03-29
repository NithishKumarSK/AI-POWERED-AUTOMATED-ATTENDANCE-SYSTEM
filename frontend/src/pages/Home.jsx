import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Camera, Shield, Database, Crosshair } from 'lucide-react';

const facultySubjectMap = {
    'ESHIRISHA': 'Machine Learning',
    'BPRIYANKA': 'FLAT',
    'SK': 'Artificial Intelligence',
    'AMOUNIKA': 'Scripting Languages',
    'BNAVEENA': 'FIOT',
    'PSWETHA': 'IOMP',
    'JANAKI': 'Environmental Science',
};

const Home = () => {
  const authRole = localStorage.getItem('auth_role') || 'student';
  const authId = localStorage.getItem('auth_id') || 'GUEST';

  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Faculty State - Preload Subject
  const [duration, setDuration] = useState(60);
  const [checks, setChecks] = useState(2);
  const [classId, setClassId] = useState(`CSE-D-2026 - ${facultySubjectMap[authId] || 'General'}`);
  const [runStatus, setRunStatus] = useState('');

  useEffect(() => {
    if (authRole === 'student') {
      fetch(`http://127.0.0.1:5000/api/students/${authId}/stats`)
        .then(res => res.json())
        .then(data => setStats(data));
      
      fetch(`http://127.0.0.1:5000/api/students/${authId}/attendance`)
        .then(res => res.json())
        .then(data => setHistory(data));
    }
  }, [authId, authRole]);

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

  const formatDate = (isoStr) => {
    if(!isoStr) return 'N/A';
    return new Date(isoStr).toLocaleDateString() + " " + new Date(isoStr).toLocaleTimeString();
  };

  // ------------------------------------------------------------------------------------------
  // STAFF VIEW
  // ------------------------------------------------------------------------------------------
  if (authRole === 'staff') {
    return (
      <div className="min-h-screen bg-[#0b0e14] font-sans text-gray-200 flex">
        <Sidebar />
        <div className="ml-64 flex-1 p-12 overflow-y-auto">
           
           <div className="max-w-[1200px] mx-auto space-y-8">
              <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
                 <Shield className="w-8 h-8 text-[#2ea043]" />
                 Faculty Profile Hub
              </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 
                 {/* ID CARD */}
                 <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm flex flex-col items-center p-8 relative">
                    <div className="absolute top-0 right-0 p-3 bg-[#1f2937]/50 border-b border-l border-[#30363d] rounded-bl-xl text-xs font-mono text-gray-400">SYS_ID: {authId}</div>
                    
                    <div className="w-32 h-32 rounded-full border-4 border-[#30363d] bg-[#0d1117] flex items-center justify-center mb-6 shadow-2xl text-5xl">
                       👨‍🏫
                    </div>
                    <h2 className="text-2xl font-bold text-gray-100">{authId}</h2>
                    <p className="text-[#58a6ff] font-bold text-sm uppercase tracking-widest mb-6 border-b border-[#30363d] pb-4 w-full text-center">
                       {facultySubjectMap[authId] || 'Assistant Professor'}
                    </p>
                    
                    <div className="w-full space-y-3">
                       <div className="flex justify-between items-center text-sm bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
                          <span className="text-gray-500 font-bold uppercase tracking-wide">Blood Group</span>
                          <span className="text-red-400 font-bold bg-red-400/10 px-2 py-0.5 rounded">O+</span>
                       </div>
                       <div className="flex justify-between items-center text-sm bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
                          <span className="text-gray-500 font-bold uppercase tracking-wide">Contact No.</span>
                          <span className="text-gray-300 font-mono font-bold">+91 98765 43210</span>
                       </div>
                       <div className="flex justify-between items-center text-sm bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
                          <span className="text-gray-500 font-bold uppercase tracking-wide">Official Mail</span>
                          <span className="text-blue-400 font-mono text-xs font-bold">{authId.toLowerCase()}@tkrec.ac.in</span>
                       </div>
                    </div>
                 </div>

                 {/* 7-Day Matrix */}
                 <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-xl shadow-sm p-6 flex flex-col">
                    <h3 className="font-bold text-gray-300 mb-6 flex items-center justify-between border-b border-[#30363d] pb-4">
                       <span className="flex items-center gap-2"><Crosshair className="w-5 h-5 text-gray-400" /> Recent Surveillance Matrix</span>
                       <span className="text-[10px] font-bold font-mono tracking-widest text-gray-400 bg-[#0d1117] px-3 py-1.5 border border-[#30363d] rounded cursor-pointer hover:bg-[#30363d] hover:text-white transition-colors">EXPORT LOGS</span>
                    </h3>

                    <div className="flex-1 flex flex-col justify-center items-center text-center p-10 bg-[#0d1117] rounded-xl border border-[#30363d] border-dashed">
                       <Database className="w-12 h-12 text-gray-600 mb-6 opacity-30" />
                       <h4 className="text-lg font-bold text-gray-500 mb-2">Historical Attendance Pipeline</h4>
                       <p className="text-gray-600 max-w-md mb-8 text-sm leading-relaxed">
                          The 7-Day retrospective academic mapping module is synchronizing. Once authenticated, the daily attendance retention blocks will automatically graph here.
                       </p>
                       <div className="flex gap-3">
                          {[...Array(7)].map((_, i) => (
                             <div key={i} className={`w-10 h-10 rounded border ${i < 4 ? 'bg-[#3fb950]/20 border-[#3fb950]/40' : 'bg-[#1f2937]/30 border-[#30363d]'} animate-pulse shadow-inner`}></div>
                          ))}
                       </div>
                    </div>
                 </div>

              </div>
           </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------------------------------
  // STUDENT VIEW (LIVE DYNAMIC DASHBOARD)
  // ------------------------------------------------------------------------------------------
  
  // 1. Dynamic Periods Generation from Backend History Vector
  const createDynamicPeriods = () => {
     if(!history || history.length === 0) return [];
     
     const groupedByDate = {};
     history.forEach((scan) => {
        // Parse date string natively without timezone offsets breaking format
        const scanDate = new Date(scan.started_at);
        const day = scanDate.getDate().toString().padStart(2, '0');
        const month = (scanDate.getMonth() + 1).toString().padStart(2, '0');
        const year = scanDate.getFullYear();
        const strDate = `${day}-${month}-${year}`;

        if (!groupedByDate[strDate]) {
           groupedByDate[strDate] = [];
        }
        groupedByDate[strDate].push(scan.final_status === 'PRESENT' ? 'P' : 'A');
     });

     // Map mapped dates back into an ordered Array structure up to 6 P/A markers
     const dynamicPeriodsArray = [];
     for (const [date, marks] of Object.entries(groupedByDate)) {
        // Assume maximum 6 periods mapped per day
        const pArray = [];
        let attendCount = 0;
        
        for(let i = 0; i < 6; i++) {
           if(i < marks.length) {
              pArray.push(marks[i]);
              if(marks[i] === 'P') attendCount++;
           } else {
              pArray.push('-');
           }
        }

        dynamicPeriodsArray.push({
           date: date,
           p: pArray,
           t: marks.length,
           a: attendCount
        });
     }
     
     // Sort newest dates first conceptually based on DB history
     return dynamicPeriodsArray;
  };

  const dynamicPeriods = createDynamicPeriods();

  // 2. Auto-Generate SMS Strings algorithms based on Dynamic Periods
  const autogenSMSList = dynamicPeriods
     .filter(periodObj => periodObj.p.includes('A')) // Only trigger SMS if they were missing any period that day!
     .map(periodObj => {
        return {
           date: periodObj.date,
           phone: '9705874657',
           msg: `Dear Parent, Your ward ${stats?.full_name || authId} with Roll No: ${authId} is Absent for ${periodObj.t - periodObj.a} periods out of ${periodObj.t} periods on ${periodObj.date}. For any queries, contact mentor: Kallem vijayalalitha, 9618878295 between 9:00AM to 7:00PM only. Principal, TKREC.`
        }
     });

  const synthAttendance = [
    { sub: 'Machine Learning', c: 64, a: 42, pct: '65.63' },
    { sub: 'Formal Languages And Automata Theory', c: 65, a: 41, pct: '63.08' },
    { sub: 'Artificial Intelligence', c: 64, a: 39, pct: '60.94' },
    { sub: 'Scripting Languages', c: 61, a: 40, pct: '65.57' },
    { sub: 'Fundamentals Of Internet Of Things', c: 55, a: 26, pct: '47.27' },
    { sub: 'Environmental Science', c: 14, a: 9, pct: '64.29' }
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-200 font-sans flex text-[13px]">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 overflow-y-auto w-full">
        <div className="w-full max-w-[1400px] mx-auto space-y-6">

          {/* DUAL-COLUMN LAYOUT WITHOUT MARKS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
             
             {/* LEFT COLUMN: DETAILS & SMS INBOX */}
             <div className="space-y-6">
                
                {/* Details Block */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-sm overflow-hidden w-full">
                   <div className="bg-[#1f2937]/50 text-center py-2 font-bold text-[#58a6ff] border-b border-[#30363d]">Student Details</div>
                   <div className="p-4 flex gap-4">
                      <div className="flex-1 space-y-3">
                         <div className="flex justify-between border-b border-[#30363d] pb-1"><span className="text-gray-400">Roll No</span> <span className="font-bold text-gray-100">{authId}</span></div>
                         <div className="flex justify-between border-b border-[#30363d] pb-1"><span className="text-gray-400">Student Name</span> <span className="font-bold text-gray-100">{stats?.full_name || 'Loading'}</span></div>
                         <div className="flex justify-between border-b border-[#30363d] pb-1"><span className="text-gray-400">Fathers Name</span> <span className="font-bold text-gray-100">Mr. TKREC Parent</span></div>
                         <div className="flex justify-between border-b border-[#30363d] pb-1"><span className="text-gray-400">Department</span> <span className="font-bold text-gray-100">III CSE II D (B.Tech)</span></div>
                      </div>
                      <div className="w-24 h-[104px] bg-[#0d1117] border border-[#30363d] overflow-hidden flex items-center justify-center">
                         <img src="/placeholder.jpg" onError={(e)=>{e.target.style.display='none';}} className="w-full h-full object-cover" alt="Student" />
                         <span className="text-4xl absolute z-[-1] opacity-50">🧑‍🎓</span>
                      </div>
                   </div>
                </div>

                {/* Algorithmic SMS Inbox Block */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-sm overflow-hidden flex flex-col h-[525px] w-full">
                   <div className="bg-[#1f2937]/50 text-center py-2 font-bold text-[#58a6ff] border-b border-[#30363d] flex justify-between px-4">
                      <span>Absentees SMS Intercepts</span>
                      <span className="bg-[#d29922]/20 text-[#d29922] px-2 rounded-full text-[10px] flex items-center">Auto-Sys</span>
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {autogenSMSList.length === 0 ? (
                         <div className="flex items-center justify-center h-full text-gray-500 font-mono text-xs">
                             [NO ANOMALIES DETECTED IN LOGS]
                         </div>
                      ) : (
                         <table className="w-full text-left border-collapse">
                            <thead className="bg-[#0d1117] sticky top-0 border-b border-[#30363d]">
                               <tr>
                                  <th className="p-2 border-r border-[#30363d] w-24">Date Target</th>
                                  <th className="p-2 border-r border-[#30363d] w-24">Phone No.</th>
                                  <th className="p-2">Triggered String Object</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-[#30363d]">
                               {autogenSMSList.map((sms, i) => (
                                  <tr key={i} className="hover:bg-[#1f2937]/30 text-xs transition-colors">
                                     <td className="p-3 align-top border-r border-[#30363d] text-gray-400 font-mono font-bold whitespace-nowrap">{sms.date}</td>
                                     <td className="p-3 align-top border-r border-[#30363d] font-mono text-[#58a6ff]">{sms.phone}</td>
                                     <td className="p-3 text-gray-400 leading-relaxed text-justify">{sms.msg}</td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      )}
                   </div>
                </div>
             </div>

             {/* RIGHT COLUMN: ATTENDANCE & PERIODS MATRIX */}
             <div className="space-y-6">
                
                {/* Attendance Subject Table */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-sm overflow-hidden w-full">
                   <div className="bg-[#1f2937]/50 text-center py-2 font-bold text-[#d29922] border-b border-[#30363d]">Subject Attendance Matrix</div>
                   <table className="w-full text-center border-collapse">
                      <thead className="bg-[#0d1117] border-b border-[#30363d]">
                         <tr>
                            <th className="p-2 text-left border-r border-[#30363d]">Subject Architecture</th>
                            <th className="p-2 border-r border-[#30363d] w-12">Total</th>
                            <th className="p-2 border-r border-[#30363d] w-12">Attend</th>
                            <th className="p-2 w-16">Match %</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[#30363d]">
                         {synthAttendance.map((row, i) => (
                            <tr key={i} className="hover:bg-[#1f2937]/30">
                               <td className="p-2 text-left border-r border-[#30363d] text-[#ff7b72]">{row.sub}</td>
                               <td className="p-2 border-r border-[#30363d] text-[#58a6ff] font-mono">{row.c}</td>
                               <td className="p-2 border-r border-[#30363d] text-[#58a6ff] font-mono">{row.a}</td>
                               <td className="p-2 text-[#58a6ff] font-mono font-bold">{row.pct}</td>
                            </tr>
                         ))}
                         <tr className="bg-[#0d1117] font-bold">
                            <td className="p-2 text-right border-r border-[#30363d]">Net Aggregate Map:</td>
                            <td className="p-2 border-r border-[#30363d]">435</td>
                            <td className="p-2 border-r border-[#30363d]">279</td>
                            <td className="p-2 text-[#3fb950]">64.14%</td>
                         </tr>
                      </tbody>
                   </table>
                </div>

                {/* LIVE DYNAMIC Periods Log Matrix */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-sm overflow-hidden w-full">
                   <div className="bg-[#1f2937]/50 text-center py-2 font-bold text-[#d29922] border-b border-[#30363d] flex justify-between px-4">
                       <span>Live Daily Periods Detail Ledger</span>
                       <span className="bg-[#3fb950]/20 text-[#3fb950] px-2 rounded-full text-[10px] flex items-center">SQL Hook Active</span>
                   </div>
                   <table className="w-full text-center border-collapse">
                      <thead className="bg-[#0d1117] border-b border-[#30363d] text-gray-400">
                         <tr>
                            <th className="p-3 border-r border-[#30363d]">Date</th>
                            <th className="p-3 border-r border-[#30363d]">1</th>
                            <th className="p-3 border-r border-[#30363d]">2</th>
                            <th className="p-3 border-r border-[#30363d]">3</th>
                            <th className="p-3 border-r border-[#30363d]">4</th>
                            <th className="p-3 border-r border-[#30363d]">5</th>
                            <th className="p-3 border-r border-[#30363d]">6</th>
                            <th className="p-3 border-r border-[#30363d] w-16">Total</th>
                            <th className="p-3 w-16">Attend</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[#30363d]">
                         {dynamicPeriods.length === 0 ? (
                           <tr>
                              <td colSpan="9" className="p-10 text-center text-gray-500 font-mono text-xs tracking-widest uppercase">No Active Log Detections Yet.</td>
                           </tr>
                         ) : dynamicPeriods.map((row, i) => (
                            <tr key={i} className="hover:bg-[#1f2937]/30 font-bold transition-colors">
                               <td className="p-3 border-r border-[#30363d] text-gray-400 font-normal font-mono">{row.date}</td>
                               {row.p.map((status, idx) => (
                                  <td key={idx} className={`p-3 border-r border-[#30363d] ${status==='A' ? 'text-[#ff7b72] bg-[#ff7b72]/10' : (status==='P' ? 'text-[#3fb950] bg-[#3fb950]/10' : 'text-gray-600')}`}>
                                     {status}
                                  </td>
                               ))}
                               <td className="p-3 border-r border-[#30363d] font-mono text-gray-400">{row.t}</td>
                               <td className="p-3 font-mono text-[#58a6ff]">{row.a}</td>
                            </tr>
                         ))}
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

export default Home;
