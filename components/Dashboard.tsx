
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { AttendanceRecord, AttendanceStatus, AttendanceStats } from '../types';

interface DashboardProps {
  records: AttendanceRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const stats: AttendanceStats = records.reduce((acc, curr) => {
    acc.total++;
    if (curr.status === AttendanceStatus.PRESENT) acc.present++;
    if (curr.status === AttendanceStatus.LATE) acc.late++;
    if (curr.status === AttendanceStatus.LEAVE) acc.onLeave++;
    return acc;
  }, { total: 0, present: 0, late: 0, onLeave: 0 });

  const pieData = [
    { name: 'Present', value: stats.present, color: '#10b981' },
    { name: 'Late', value: stats.late, color: '#f59e0b' },
    { name: 'Leave', value: stats.onLeave, color: '#ef4444' },
    { name: 'Others', value: stats.total - (stats.present + stats.late + stats.onLeave), color: '#6366f1' },
  ].filter(d => d.value > 0);

  // Daily trend calculation
  const dailyData = Array.from(new Set(records.map(r => r.date))).sort().slice(-7).map(date => ({
    date,
    count: records.filter(r => r.date === date).length
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records', value: stats.total, color: 'blue' },
          { label: 'Present Today', value: stats.present, color: 'emerald' },
          { label: 'Late Entries', value: stats.late, color: 'amber' },
          { label: 'On Leave', value: stats.onLeave, color: 'rose' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-sm text-slate-500 font-medium">{item.label}</p>
            <p className={`text-3xl font-bold text-${item.color}-600`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Status Distribution</h3>
          {records.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity (Last 7 Sessions)</h3>
          {records.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
