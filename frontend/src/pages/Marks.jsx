import React from 'react';
import Sidebar from '../components/Sidebar';

const Marks = () => {
  const authId = localStorage.getItem('auth_id') || 'GUEST';

  const synthMarks = [
    { sub: 'ML', m1: 33, m2: null, avg: 33, act: null, tot: 33 },
    { sub: 'FLAT', m1: 33, m2: null, avg: 33, act: null, tot: 33 },
    { sub: 'AI', m1: 33, m2: null, avg: 33, act: null, tot: 33 },
    { sub: 'SL', m1: 34, m2: null, avg: 34, act: null, tot: 34 }
  ];

  const synthSemResults = [
    { code: '22CS501PC', name: 'Design And Analysis Of Algorithms', g: 'A+', gp: 9, c: 4.0, res: 'Pass' },
    { code: '22CS502PC', name: 'Computer Networks', g: 'A+', gp: 9, c: 3.0, res: 'Pass' },
    { code: '22CS503PC', name: 'Dev Ops', g: 'A', gp: 8, c: 3.0, res: 'Pass' },
    { code: '22CS511PE', name: 'Data Analytics', g: 'A+', gp: 9, c: 3.0, res: 'Pass' }
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-200 font-sans flex text-[13px]">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 overflow-y-auto w-full">
        <div className="max-w-[1200px] mx-auto space-y-8">
           
           <h1 className="text-2xl font-bold text-gray-100 mb-6 border-b border-[#30363d] pb-4">Academic Evaluation Hub</h1>

           {/* MARKS & RESULTS PORTED FROM HOME */}
           <div className="space-y-8">
                 
                 {/* Mid Marks */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-sm overflow-hidden">
                   <div className="bg-[#1f2937]/50 text-center py-3 font-bold text-[#3fb950] border-b border-[#30363d] text-base tracking-widest uppercase">Internal Assessments</div>
                   <table className="w-full text-center border-collapse">
                      <thead className="bg-[#0d1117] border-b border-[#30363d]">
                         <tr>
                            <th className="p-4 border-r border-[#30363d] text-[#3fb950]">Subject</th>
                            <th className="p-4 border-r border-[#30363d] text-[#3fb950]">I Mid</th>
                            <th className="p-4 border-r border-[#30363d] text-[#3fb950]">II Mid</th>
                            <th className="p-4 border-r border-[#30363d] text-[#3fb950]">Avg</th>
                            <th className="p-4 border-r border-[#30363d] text-[#3fb950]">Activity</th>
                            <th className="p-4 text-[#3fb950]">Total</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[#30363d]">
                         {synthMarks.map((row, i) => (
                            <tr key={i} className="hover:bg-[#1f2937]/30 transition-colors">
                               <td className="p-4 border-r border-[#30363d] font-semibold text-gray-300">{row.sub}</td>
                               <td className="p-4 border-r border-[#30363d]">{row.m1}</td>
                               <td className="p-4 border-r border-[#30363d]">{row.m2 || '-'}</td>
                               <td className="p-4 border-r border-[#30363d] font-bold text-[#58a6ff]">{row.avg}</td>
                               <td className="p-4 border-r border-[#30363d]">{row.act || '-'}</td>
                               <td className="p-4 font-bold text-[#3fb950]">{row.tot}</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Upto Date Results */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-sm overflow-hidden h-max">
                    <div className="bg-[#1f2937]/50 text-center py-3 font-bold text-gray-200 border-b border-[#30363d] tracking-widest uppercase">Upto Date Results (Roll No. {authId})</div>
                    <table className="w-full text-center border-collapse">
                        <thead className="bg-[#0d1117] border-b border-[#30363d] text-gray-400">
                            <tr>
                                <th className="p-4 border-r border-[#30363d]">Sem</th>
                                <th className="p-4 border-r border-[#30363d]">Credits</th>
                                <th className="p-4 border-r border-[#30363d]">Back Logs</th>
                                <th className="p-4">Fail Subjects</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d] text-[#58a6ff] font-bold">
                            <tr className="hover:bg-[#1f2937]/30 transition-colors"><td className="p-4 border-r border-[#30363d] text-gray-300 font-normal">III - I</td><td className="p-4 border-r border-[#30363d] text-[#3fb950]">20 / 20</td><td className="p-4 border-r border-[#30363d]">Nil</td><td className="p-4">Nil</td></tr>
                            <tr className="hover:bg-[#1f2937]/30 transition-colors"><td className="p-4 border-r border-[#30363d] text-gray-300 font-normal">II - II</td><td className="p-4 border-r border-[#30363d] text-[#3fb950]">20 / 20</td><td className="p-4 border-r border-[#30363d]">Nil</td><td className="p-4">Nil</td></tr>
                            <tr className="hover:bg-[#1f2937]/30 transition-colors"><td className="p-4 border-r border-[#30363d] text-gray-300 font-normal">II - I</td><td className="p-4 border-r border-[#30363d] text-[#3fb950]">20 / 20</td><td className="p-4 border-r border-[#30363d]">Nil</td><td className="p-4">Nil</td></tr>
                        </tbody>
                    </table>
                    </div>

                    {/* III - I Sem Results */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-[#1f2937]/50 text-center py-3 font-bold text-gray-200 border-b border-[#30363d] tracking-widest uppercase">III-I Sem (Roll No. {authId})</div>
                    <table className="w-full text-center border-collapse">
                        <thead className="bg-[#0d1117] border-b border-[#30363d] text-gray-400">
                            <tr>
                                <th className="p-4 border-r border-[#30363d]">Code</th>
                                <th className="p-4 border-r border-[#30363d] text-left">Subject Name</th>
                                <th className="p-4 border-r border-[#30363d]">G</th>
                                <th className="p-4 border-r border-[#30363d]">GP</th>
                                <th className="p-4 border-r border-[#30363d]">C</th>
                                <th className="p-4">Results</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#30363d]">
                            {synthSemResults.map((r, i) => (
                                <tr key={i} className="hover:bg-[#1f2937]/30 font-semibold transition-colors">
                                <td className="p-3 border-r border-[#30363d] text-gray-400">{r.code}</td>
                                <td className="p-3 border-r border-[#30363d] text-left font-normal text-xs">{r.name}</td>
                                <td className="p-3 border-r border-[#30363d] font-bold text-[#3fb950]">{r.g}</td>
                                <td className="p-3 border-r border-[#30363d] text-[#58a6ff]">{r.gp}</td>
                                <td className="p-3 border-r border-[#30363d]">{r.c.toFixed(2)}</td>
                                <td className="p-3 text-gray-300">{r.res}</td>
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

export default Marks;
