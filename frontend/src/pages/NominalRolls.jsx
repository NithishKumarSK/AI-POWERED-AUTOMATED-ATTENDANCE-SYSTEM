import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Users, ClipboardList } from 'lucide-react';

const NominalRolls = () => {
    const [students, setStudents] = useState([]);
    
    useEffect(() => {
        // Fetching the 66 students dynamically from the backend DB we seeded
        fetch('http://127.0.0.1:5000/api/classes/CSE-D-2026/students')
           .then(res => res.json())
           .then(data => setStudents(data))
           .catch(err => console.error(err));
    }, []);

    return (
       <div className="min-h-screen bg-[#0b0e14] text-gray-200 flex font-sans">
           <Sidebar />
           <div className="ml-64 flex-1 p-12 overflow-y-auto">
               <div className="max-w-[1000px] mx-auto space-y-6">
                   <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl flex items-center gap-4">
                       <ClipboardList className="w-8 h-8 text-[#2ea043]" />
                       <div>
                          <h1 className="text-2xl font-bold text-gray-100">Class Nominal Rolls</h1>
                          <p className="text-gray-400 text-sm">Official CSE-D 2026 Batch Registry.</p>
                       </div>
                   </div>

                   <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm p-4">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="border-b-2 border-[#30363d] text-gray-500 text-sm uppercase tracking-wider bg-[#0d1117]">
                               <th className="py-4 px-6">S.No</th>
                               <th className="py-4 px-6 border-l border-[#30363d]">H.T No (Roll)</th>
                               <th className="py-4 px-6 border-l border-[#30363d]">Name of the Student</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-[#30363d]">
                            {students.map((s, idx) => (
                               <tr key={s.student_id} className="hover:bg-[#1f2937]/30 transition-colors">
                                  <td className="py-3 px-6 font-mono text-gray-400 font-bold">{idx + 1}</td>
                                  <td className="py-3 px-6 font-mono font-bold text-blue-400 border-l border-[#30363d]/50 bg-[#0b0e14]/50">{s.student_id}</td>
                                  <td className="py-3 px-6 font-semibold border-l border-[#30363d]/50">{s.full_name}</td>
                               </tr>
                            ))}
                            {students.length === 0 && (
                               <tr>
                                  <td colSpan="3" className="py-8 text-center text-gray-500">Awaiting Backend Sync...</td>
                               </tr>
                            )}
                         </tbody>
                      </table>
                   </div>
               </div>
           </div>
       </div>
    );
}

export default NominalRolls;
