import React from 'react';
import Sidebar from '../components/Sidebar';
import { Calendar, Clock, Lock } from 'lucide-react';

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
  {
    day: 'MON',
    periods: ['ML', 'FLAT', 'SL', 'LUNCH', 'FIOT', 'AI', 'ML'],
    spans: [1, 1, 1, 1, 1, 1, 1]
  },
  {
    day: 'TUE',
    periods: ['FLAT', 'FLAT/CRT', 'AI/CRT', 'LUNCH', 'SL', 'FIOT', 'ML'],
    spans: [1, 1, 1, 1, 1, 1, 1]
  },
  {
    day: 'WED',
    periods: ['AI-LAB(NB-204)', 'LUNCH', 'SL', 'AI', 'FIOT'],
    spans: [3, 1, 1, 1, 1]
  },
  {
    day: 'THU',
    periods: ['ML LAB(NB-204)', 'LUNCH', 'SL', 'FLAT', 'FIOT'],
    spans: [3, 1, 1, 1, 1]
  },
  {
    day: 'FRI',
    periods: ['SL', 'AI', 'FIOT', 'LUNCH', 'FLAT/IOMP', 'ML/IOMP', 'ES'],
    spans: [1, 1, 1, 1, 1, 1, 1]
  },
  {
    day: 'SAT',
    periods: ['SL-LAB(NB-204)', 'LUNCH', 'FLAT', 'AI/IOMP', 'ML/IOMP'],
    spans: [3, 1, 1, 1, 1]
  }
];

const timeHeaders = [
  "9:40AM - 10:40AM",
  "10:40AM - 11:40AM",
  "11:40AM - 12:40PM",
  "12:40PM - 1:20PM",
  "1:20PM - 2:20PM",
  "2:20PM - 3:20PM",
  "3:20PM - 4:20PM"
];

const TimeTable = () => {
  const authRole = localStorage.getItem('auth_role') || 'student';
  const authId = localStorage.getItem('auth_id') || 'GUEST';

  const mySubjects = facultySubjectMap[authId] || [];

  const isVisible = (periodName) => {
     if (authRole === 'student') return true;
     if (periodName === 'LUNCH') return true; 

     // Faculty mode: strictly check if this period matches their mapped subject array
     return mySubjects.some(sub => periodName.includes(sub));
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] font-sans text-gray-200 flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-12 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl flex justify-between items-center shadow-sm">
             <div>
                <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                   <Calendar className="w-6 h-6 text-blue-500" />
                   B. TECH III YEAR II SEM TIME TABLE
                </h1>
                <p className="text-gray-400 text-sm mt-3 ml-1 flex flex-wrap gap-6">
                   <span className="font-semibold text-gray-300">BRANCH:</span> CSE-D
                   <span className="font-semibold text-gray-300">ROOM NO:</span> NB-208W 
                   <span className="font-semibold text-gray-300">ACADEMIC YEAR:</span> 2025-2026
                </p>
             </div>
             <div className="bg-[#1f2937]/50 border border-[#30363d] px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 shadow-inner">
                <Clock className="w-4 h-4 text-blue-400" /> 
                {new Date().toLocaleTimeString()}
             </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
             <div className="overflow-x-auto">
               <table className="w-full text-center border-collapse">
                 <thead>
                   <tr className="bg-[#0d1117] border-b-2 border-[#30363d]">
                     <th className="px-4 py-4 text-sm font-bold text-gray-400 border-r border-[#30363d] w-24">DAY / TIME</th>
                     {timeHeaders.map((t, idx) => (
                       <th key={idx} className="px-4 py-4 text-xs font-semibold text-gray-400 border-r border-[#30363d]">{t}</th>
                     ))}
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[#30363d]">
                   {timetableData.map((row, idx) => (
                     <tr key={idx} className="hover:bg-[#1f2937]/10 transition-colors">
                       <td className="px-4 py-5 text-sm font-bold text-blue-400 border-r border-[#30363d] bg-[#0d1117]">
                          {row.day}
                       </td>
                       {row.periods.map((p, pIdx) => {
                          const allowed = isVisible(p);
                          const span = row.spans[pIdx];
                          const isLunch = p === 'LUNCH';

                          return (
                            <td 
                              key={pIdx} 
                              colSpan={span}
                              className={`
                                border-r border-[#30363d] px-4 py-5 text-sm font-semibold transition-all
                                ${isLunch ? 'bg-[#1f2937]/30 text-gray-500 tracking-widest' : ''}
                                ${allowed && !isLunch ? 'text-gray-200' : ''}
                                ${!allowed && !isLunch ? 'bg-[#0b0e14] opacity-40' : ''}
                              `}
                            >
                               {allowed ? (
                                  <div className={`flex flex-col items-center justify-center ${p.includes('LAB') ? 'text-[#ff7b72]' : ''}`}>
                                    {p}
                                  </div>
                               ) : (
                                  <div className="flex flex-col items-center justify-center text-gray-600">
                                     <Lock className="w-4 h-4 mb-1 opacity-50" />
                                     RESTRICTED
                                  </div>
                               )}
                            </td>
                          );
                       })}
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

          {authRole === 'staff' && (
            <div className="mt-8 bg-[#1f2937]/30 border border-[#30363d] rounded-xl p-6 text-center shadow-sm">
               <p className="text-gray-400 font-medium text-sm">
                  Role-Based Timetable Isolation Active. You are logged in as <strong className="text-gray-200">{authId}</strong>. 
                  Only your designated AI verification periods are visible and accessible.
               </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TimeTable;
