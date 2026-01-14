
import React, { useState, useEffect, useCallback } from 'react';
import { AttendanceRecord, AttendanceStatus } from './types';
import AttendanceForm from './components/AttendanceForm';
import Dashboard from './components/Dashboard';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'records' | 'insights'>('dashboard');
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('attendance_pro_records');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('attendance_pro_records', JSON.stringify(records));
  }, [records]);

  const handleSaveRecord = (newRecord: AttendanceRecord) => {
    setRecords(prev => [newRecord, ...prev]);
    setActiveTab('records');
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const generateAiInsights = async () => {
    if (records.length === 0) {
      alert("Add some records first for the AI to analyze!");
      return;
    }
    setIsAnalyzing(true);
    const report = await geminiService.analyzeAttendance(records);
    setAiReport(report);
    setIsAnalyzing(false);
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT: return 'bg-emerald-100 text-emerald-700';
      case AttendanceStatus.LATE: return 'bg-amber-100 text-amber-700';
      case AttendanceStatus.LEAVE: return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Attendify AI
              </h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'records' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Records
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'insights' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                AI Insights
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Area: Form */}
          <div className="lg:col-span-4 space-y-6">
            <AttendanceForm onSave={handleSaveRecord} />
            
            <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Smart Insights</h3>
                <p className="text-indigo-200 text-sm mb-4">Leverage Gemini to analyze your organization's attendance patterns instantly.</p>
                <button 
                  onClick={() => { setActiveTab('insights'); generateAiInsights(); }}
                  className="w-full bg-white text-indigo-900 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate Report</span>
                </button>
              </div>
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-500 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {activeTab === 'dashboard' && <Dashboard records={records} />}

            {activeTab === 'records' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-800">Attendance Log</h3>
                  <span className="text-xs text-slate-400 font-mono">ID: {records.length} items</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">In / Out</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {records.length > 0 ? records.map(record => (
                        <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-700">{record.name}</td>
                          <td className="px-6 py-4 text-slate-500">{record.date}</td>
                          <td className="px-6 py-4 text-slate-500">
                            <span className="inline-flex items-center space-x-1">
                              <span>{record.inTime}</span>
                              <span className="text-slate-300">→</span>
                              <span>{record.outTime}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDeleteRecord(record.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                            No attendance records found. Add one to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">AI Report Builder</h2>
                    <button 
                      onClick={generateAiInsights}
                      disabled={isAnalyzing}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors flex items-center space-x-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <span>Re-analyze Records</span>
                      )}
                    </button>
                  </div>

                  {aiReport ? (
                    <div className="prose prose-indigo max-w-none text-slate-600">
                      <div className="p-6 bg-slate-50 rounded-lg border border-slate-100 whitespace-pre-wrap leading-relaxed">
                        {aiReport}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <p className="text-center max-w-xs">
                        Click the button above to generate a smart attendance analysis report using AI.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          Attendify AI © {new Date().getFullYear()} - Professional Attendance Intelligence
        </div>
      </footer>
    </div>
  );
};

export default App;
