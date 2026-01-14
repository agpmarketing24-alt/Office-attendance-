
import React, { useState } from 'react';
import { AttendanceStatus, AttendanceRecord } from '../types';

interface AttendanceFormProps {
  onSave: (record: AttendanceRecord) => void;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    inTime: '09:00',
    outTime: '18:00',
    status: AttendanceStatus.PRESENT,
    remarks: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: AttendanceRecord = {
      ...formData,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    onSave(newRecord);
    setFormData({
      ...formData,
      name: '',
      remarks: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Record</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Employee Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-2 text-sm outline-none transition-all"
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as AttendanceStatus })}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-2 text-sm outline-none"
            >
              <option value={AttendanceStatus.PRESENT}>Present</option>
              <option value={AttendanceStatus.LATE}>Late</option>
              <option value={AttendanceStatus.LEAVE}>Leave</option>
              <option value={AttendanceStatus.OTHERS}>Others</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">In Time</label>
            <input
              type="time"
              value={formData.inTime}
              onChange={(e) => setFormData({ ...formData, inTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Out Time</label>
            <input
              type="time"
              value={formData.outTime}
              onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-2 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Remarks</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-2 text-sm outline-none resize-none"
            rows={2}
            placeholder="Additional notes..."
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        >
          Save Attendance Record
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm;
