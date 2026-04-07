import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { LineChart, Save } from 'lucide-react';

const facultySubjectMap = {
    'ESHIRISHA': 'Machine Learning',
    'BPRIYANKA': 'FLAT',
    'SK': 'Artificial Intelligence',
    'AMOUNIKA': 'Scripting Languages',
    'BNAVEENA': 'FIOT',
    'PSWETHA': 'IOMP',
    'JANAKI': 'Environmental Science',
};

const MidMarks = () => {
    const authId = localStorage.getItem('auth_id') || 'GUEST';
    const initialSubj = facultySubjectMap[authId] || 'Artificial Intelligence';

    const [students, setStudents] = useState([]);
    const [examType, setExamType] = useState('MID-1');
    const [subjectName, setSubjectName] = useState(initialSubj);

    useEffect(() => {
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
                   
                   {/* Header Row */}
                   <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                           <LineChart className="w-8 h-8 text-[#2ea043]" />
                           <div>
                              <h1 className="text-2xl font-bold text-gray-100">Academic Marks Entry</h1>
                              <p className="text-gray-400 text-sm">Direct input system for MID / SEM examinations.</p>
                           </div>
                       </div>
                       
                       <button className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-2.5 rounded-lg font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(35,134,54,0.3)] flex items-center gap-2">
                           <Save className="w-4 h-4" /> Save Batch
                       </button>
                   </div>

                   {/* Configuration Row */}
                   <div className="grid grid-cols-2 gap-6 bg-[#0d1117] border border-[#30363d] p-5 rounded-lg shadow-inner">
                       <div>
                           <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Examination Type</label>
                           <select 
                               value={examType}
                               onChange={(e) => setExamType(e.target.value)}
                               className="w-full bg-[#161b22] border border-[#30363d] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                           >
                               <option value="MID-1">MID-1 Internal</option>
                               <option value="MID-2">MID-2 Internal</option>
                               <option value="SEM">End Semester (SEM)</option>
                           </select>
                       </div>
                       <div>
                           <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Subject Header</label>
                           <input 
                               type="text" 
                               value={subjectName}
                               onChange={(e) => setSubjectName(e.target.value)}
                               className="w-full bg-[#161b22] border border-[#30363d] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3"
                               placeholder="e.g. Machine Learning"
                           />
                       </div>
                   </div>

                   {/* Data Entry Table */}
                   <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="border-b-2 border-[#30363d] text-gray-500 text-xs uppercase tracking-wider bg-[#0d1117]">
                               <th className="py-4 px-6">S.No</th>
                               <th className="py-4 px-6 border-l border-[#30363d]">H.T No</th>
                               <th className="py-4 px-6 border-l border-[#30363d]">Student Name</th>
                               <th className="py-4 px-6 border-l border-[#30363d] text-center">Subject Map</th>
                               <th className="py-4 px-6 border-l border-[#30363d] w-32">{examType} SCORE</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-[#30363d]">
                            {students.map((s, idx) => (
                               <tr key={s.student_id} className="hover:bg-[#1f2937]/30 transition-colors">
                                  <td className="py-3 px-6 font-mono text-gray-400 font-bold">{idx + 1}</td>
                                  <td className="py-3 px-6 font-mono font-bold text-blue-400 border-l border-[#30363d]/50 bg-[#0b0e14]/50">{s.student_id}</td>
                                  <td className="py-3 px-6 font-semibold border-l border-[#30363d]/50 text-sm">{s.full_name}</td>
                                  <td className="py-3 px-6 text-center border-l border-[#30363d]/50">
                                      <span className="bg-[#1e293b] text-gray-300 px-3 py-1 rounded text-xs truncate max-w-[150px] inline-block">{subjectName}</span>
                                  </td>
                                  <td className="py-2 px-4 border-l border-[#30363d]/50">
                                      <input 
                                         type="number"
                                         className="w-full bg-[#0b0e14] border border-[#30363d] text-white text-center font-mono font-bold text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-2 transition-colors focus:bg-[#1e293b]"
                                         placeholder="-"
                                      />
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
};

export default MidMarks;
