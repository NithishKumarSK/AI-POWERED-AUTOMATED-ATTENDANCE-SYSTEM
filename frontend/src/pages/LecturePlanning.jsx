import React from 'react';
import Sidebar from '../components/Sidebar';
import { BookOpen, Construction } from 'lucide-react';

const LecturePlanning = () => {
    return (
       <div className="min-h-screen bg-[#0b0e14] text-gray-200 flex font-sans">
           <Sidebar />
           <div className="ml-64 flex-1 p-12 overflow-y-auto">
               <div className="max-w-[1000px] mx-auto space-y-6">
                   <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl flex items-center gap-4">
                       <BookOpen className="w-8 h-8 text-[#2ea043]" />
                       <div>
                          <h1 className="text-2xl font-bold text-gray-100">Lecture Planning</h1>
                          <p className="text-gray-400 text-sm">Syllabus progression and target pacing module.</p>
                       </div>
                   </div>

                   <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-20 flex flex-col items-center justify-center text-center shadow-sm">
                       <Construction className="w-16 h-16 text-gray-600 mb-4" />
                       <h2 className="text-2xl font-bold text-gray-400">Module Isolated</h2>
                       <p className="text-gray-500 mt-3 max-w-lg">
                          The core TKREC syllabus progression engine is currently segregated pending direct authorization from the Head of Department. 
                       </p>
                   </div>
               </div>
           </div>
       </div>
    );
};

export default LecturePlanning;
