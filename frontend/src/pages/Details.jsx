import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { UserCircle, Terminal, Key, ShieldCheck } from 'lucide-react';

const Details = () => {
  const authRole = localStorage.getItem('auth_role') || 'student';
  const authId = localStorage.getItem('auth_id') || 'GUEST';

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (authRole === 'student') {
      fetch(`http://127.0.0.1:5000/api/students/${authId}/stats`)
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(err => console.error(err));
    } else {
      setProfile({
         full_name: 'Dr. Professor Admin',
         class_id: 'All Hubs',
         rank: 'Senior AI System Administrator',
         access_level: 'Level 5 (Override Privileges)'
      });
    }
  }, [authId, authRole]);

  // Utility to generate a synthetic name snippet based on Student Name
  const genLastName = (name) => name ? name.split(' ')[0] : 'Unknown';

  if (authRole === 'staff') {
    return (
       <div className="min-h-screen bg-[#0b0e14] font-sans text-gray-200 flex text-[13px]">
          <Sidebar />
          <div className="ml-64 flex-1 p-12 overflow-y-auto w-full">
            <div className="max-w-[700px] mx-auto bg-[#161b22] border border-[#30363d] rounded-2xl p-8 relative shadow-sm">
               <div className="flex flex-col gap-6 items-center text-center">
                  <div className="w-32 h-32 bg-[#0d1117] rounded-full border-4 border-[#30363d] flex items-center justify-center">
                     <ShieldCheck className="w-16 h-16 text-blue-500" />
                  </div>
                  <div>
                     <span className="bg-[#1f2937] text-blue-400 border border-[#30363d] px-3 py-1 rounded text-xs tracking-widest font-bold">STAFF CLEARANCE</span>
                     <h1 className="text-3xl font-bold text-gray-100 mt-4">{profile?.full_name}</h1>
                     <p className="text-gray-400 font-mono mt-2">{authId}</p>
                  </div>
               </div>
            </div>
          </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] font-sans text-gray-200 flex text-[13px]">
      <Sidebar />
      <div className="ml-64 flex-1 p-6 overflow-y-auto w-full">
         
         <div className="max-w-[1400px] mx-auto space-y-4">
            
            {/* TKREC AUTHENTIC HEADER (Dark Mode Adaptation) */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col items-center justify-center py-6 px-4 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-[#ff7b72] opacity-30"></div>
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#0d1117] border border-[#30363d] shadow-inner flex items-center justify-center text-2xl group relative overflow-hidden">
                      <span className="z-10">🏫</span>
                      <div className="absolute inset-0 bg-[#3fb950] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  </div>
                  <div className="text-center">
                     <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-[#ff7b72] uppercase" style={{fontFamily: "Arial, sans-serif"}}>
                        TEEGALA KRISHNA REDDY ENGINEERING COLLEGE
                     </h1>
                     <h2 className="text-xs font-bold text-gray-400 mt-1 tracking-widest uppercase">(UGC-AUTONOMOUS)</h2>
                     <p className="text-[10px] text-gray-500 mt-1 uppercase">
                        (Sponsored by TKR Educational Society, Approved by AICTE, Affiliated to JNTUH Accredited by NAAC & NBA)
                     </p>
                     <p className="text-[10px] text-gray-500 uppercase">Medbowli, Meerpet, Balapur(M), Hyderabad, Telangana - 500097</p>
                  </div>
               </div>
            </div>

            {/* ADMISSION BANNER */}
            <div className="w-full bg-[#1f2937]/50 border border-[#30363d] rounded-lg py-2 text-center text-sm font-bold text-[#58a6ff]">
               {profile?.full_name || 'Loading Name...'} - Admission Details (AY: 2023-24) - {authId} - B.Tech - CSE
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
               
               {/* LEFT COLUMN */}
               <div className="space-y-4">
                  
                  {/* Personal Details */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-sm">
                     <div className="bg-[#4d1618]/30 py-2 border-b border-[#30363d] text-center font-bold text-[#ff7b72] tracking-widest uppercase text-xs">
                        Personal Details
                     </div>
                     <div className="p-4 flex flex-col sm:flex-row gap-6">
                        <div className="flex-1">
                           <table className="w-full text-left text-xs">
                              <tbody className="divide-y divide-[#30363d]">
                                 <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right w-1/3">Student Name :</td><td className="py-2 pl-4 text-gray-100 font-bold">{profile?.full_name}</td></tr>
                                 <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Father Name :</td><td className="py-2 pl-4 text-gray-200">{genLastName(profile?.full_name)} Krishna Goud</td></tr>
                                 <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Mother Name :</td><td className="py-2 pl-4 text-gray-200">{genLastName(profile?.full_name)} Madhavi</td></tr>
                                 <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Date of Birth :</td><td className="py-2 pl-4 text-gray-200 font-mono">20-09-2005</td></tr>
                                 <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Gender :</td><td className="py-2 pl-4 text-gray-200">Male</td></tr>
                                 <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Parent Mobile :</td><td className="py-2 pl-4 text-gray-200 font-mono">9705874657</td></tr>
                                 <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Student Mobile :</td><td className="py-2 pl-4 text-gray-200 font-mono">7672086205</td></tr>
                                 <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Caste :</td><td className="py-2 pl-4 text-gray-200">BC-B</td></tr>
                                 <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Religion :</td><td className="py-2 pl-4 text-gray-200">Hindu</td></tr>
                                 <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Aadhaar Number :</td><td className="py-2 pl-4 text-gray-200 font-mono">XXXX-XXXX-3456</td></tr>
                                 <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Email :</td><td className="py-2 pl-4 text-[#58a6ff] hover:underline cursor-pointer">{authId.toLowerCase()}@tkrec.ac.in</td></tr>
                              </tbody>
                           </table>
                        </div>
                        <div className="flex flex-col items-center justify-start">
                           <div className="w-[120px] h-[150px] bg-[#0d1117] border border-[#30363d] overflow-hidden flex items-center justify-center rounded cursor-pointer relative group">
                              <span className="text-5xl opacity-30 z-0">🧑‍🎓</span>
                              {/* If you have physical photos loaded in the public folder, they will render here natively */}
                              <img src={`/profiles/${authId}.jpg`} onError={(e) => { e.target.style.display = 'none'; }} className="w-full h-full object-cover absolute top-0 left-0 z-10" alt="Student Profile" />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Address for Communication */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-sm">
                     <div className="bg-[#4d1618]/30 py-2 border-b border-[#30363d] text-center font-bold text-[#ff7b72] tracking-widest uppercase text-xs">
                        Address for Communication
                     </div>
                     <div className="p-4 grid grid-cols-2 gap-4">
                        <table className="w-full text-left text-xs">
                           <tbody className="divide-y divide-[#30363d]">
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right w-1/2">Door No :</td><td className="py-2 pl-4 text-gray-200">11-92</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Street :</td><td className="py-2 pl-4 text-gray-200">Main Road</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Mandal :</td><td className="py-2 pl-4 text-gray-200">Saroornagar</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">State :</td><td className="py-2 pl-4 text-gray-200">Telangana</td></tr>
                           </tbody>
                        </table>
                        <table className="w-full text-left text-xs">
                           <tbody className="divide-y divide-[#30363d]">
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right w-1/2">Town / Village :</td><td className="py-2 pl-4 text-gray-200">Hyderabad</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">District :</td><td className="py-2 pl-4 text-gray-200">Ranga Reddy</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Pincode :</td><td className="py-2 pl-4 text-gray-200 font-mono">500035</td></tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

               </div>

               {/* RIGHT COLUMN */}
               <div className="space-y-4">
                  
                  {/* Educational Details */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-sm">
                     <div className="bg-[#4d1618]/30 py-2 border-b border-[#30363d] text-center font-bold text-[#ff7b72] tracking-widest uppercase text-xs">
                        Educational Details
                     </div>
                     <div className="p-4 grid grid-cols-2 gap-4">
                        <table className="w-full text-left text-xs">
                           <tbody className="divide-y divide-[#30363d]">
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right w-1/2">SSC Hallticket No :</td><td className="py-2 pl-4 text-gray-200 font-mono">182910484</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Inter Hallticket No :</td><td className="py-2 pl-4 text-gray-200 font-mono">205839212</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Degree Hallticket No :</td><td className="py-2 pl-4 text-gray-200">-</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">UG Hallticket No :</td><td className="py-2 pl-4 text-gray-200">-</td></tr>
                           </tbody>
                        </table>
                        <table className="w-full text-left text-xs">
                           <tbody className="divide-y divide-[#30363d]">
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right w-1/2">SSC CGP / GP :</td><td className="py-2 pl-4 text-gray-100 font-bold">9.8</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Inter CGP / GP :</td><td className="py-2 pl-4 text-gray-100 font-bold">965</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">Degree CGP / GP :</td><td className="py-2 pl-4 text-gray-200">-</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">UG CGP / GP :</td><td className="py-2 pl-4 text-gray-200">-</td></tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  {/* Admission Details */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-sm">
                     <div className="bg-[#4d1618]/30 py-2 border-b border-[#30363d] text-center font-bold text-[#ff7b72] tracking-widest uppercase text-xs">
                        Admission Details
                     </div>
                     <div className="p-4 grid grid-cols-2 gap-4">
                        <table className="w-full text-left text-xs">
                           <tbody className="divide-y divide-[#30363d]">
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right w-1/2">Admitted Under :</td><td className="py-2 pl-4 text-[#3fb950] font-bold">Convener</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">CET Rollno :</td><td className="py-2 pl-4 text-gray-200 font-mono">2223L8121</td></tr>
                           </tbody>
                        </table>
                        <table className="w-full text-left text-xs">
                           <tbody className="divide-y divide-[#30363d]">
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right w-1/2">CET :</td><td className="py-2 pl-4 text-gray-200 font-bold">EAMCET</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right">CET Rank :</td><td className="py-2 pl-4 text-[#58a6ff] font-bold font-mono">24102</td></tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

                  {/* Documents uploaded */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-sm">
                     <div className="bg-[#4d1618]/30 py-2 border-b border-[#30363d] text-center font-bold text-[#ff7b72] tracking-widest uppercase text-xs">
                        Documents uploaded
                     </div>
                     <div className="p-4 grid grid-cols-2 gap-4">
                        <table className="w-full text-left text-xs">
                           <tbody className="divide-y divide-[#30363d]">
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right w-1/2 flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> 6th to 10th Bonafide :</td><td className="py-2 pl-4 font-light text-gray-500">No</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span> Inter Long Memo :</td><td className="py-2 pl-4 font-bold text-[#3fb950]">Yes</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span> Latest TC :</td><td className="py-2 pl-4 font-bold text-[#3fb950]">Yes</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> ROC :</td><td className="py-2 pl-4 font-light text-gray-500">No</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span> Allotment Order :</td><td className="py-2 pl-4 font-bold text-[#3fb950]">Yes</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span> CET Rank Card :</td><td className="py-2 pl-4 font-bold text-[#3fb950]">Yes</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Income Certificate :</td><td className="py-2 pl-4 font-light text-gray-500">No</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span> Passport Size Photo :</td><td className="py-2 pl-4 font-bold text-[#3fb950]">Yes</td></tr>
                           </tbody>
                        </table>
                        <table className="w-full text-left text-xs">
                           <tbody className="divide-y divide-[#30363d]">
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right w-1/2 flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span> SSC Long Memo :</td><td className="py-2 pl-4 font-bold text-[#3fb950]">Yes</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span> Inter Bonafide :</td><td className="py-2 pl-4 font-bold text-[#3fb950]">Yes</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span> Caste Certificate :</td><td className="py-2 pl-4 font-bold text-[#3fb950]">Yes</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span> Joing Recept :</td><td className="py-2 pl-4 font-bold text-[#3fb950]">Yes</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span> CET Hall Ticket :</td><td className="py-2 pl-4 font-bold text-[#3fb950]">Yes</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> EWS Certificate :</td><td className="py-2 pl-4 font-light text-gray-500">No</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span> Aadhar Card :</td><td className="py-2 pl-4 font-bold text-[#3fb950]">Yes</td></tr>
                              <tr><td className="py-2 pr-4 font-bold text-gray-400 text-right flex items-center justify-end gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Signature :</td><td className="py-2 pl-4 font-light text-gray-500">No</td></tr>
                           </tbody>
                        </table>
                     </div>
                  </div>

               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default Details;
