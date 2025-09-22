import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BloodPressureReading } from '../types';

interface HistoryChartProps {
  readings: BloodPressureReading[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ readings }) => {
  if (readings.length < 2) {
    return (
      <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-lg h-[300px] flex items-center justify-center">
        <p className="text-slate-500">Ajoutez au moins deux mesures pour voir le graphique des tendances.</p>
      </div>
    );
  }

  const chartData = [...readings]
    .sort((a, b) => a.timestamp - b.timestamp) // Sort chronologically
    .map(r => ({
      name: new Date(r.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      systolic: r.systolic,
      diastolic: r.diastolic,
      pulse: r.pulse,
    }));

  return (
    <div className="w-full h-[320px] p-4 bg-slate-50/50 rounded-xl border border-slate-200 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            data={chartData}
            margin={{
                top: 5,
                right: 20,
                left: -10,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} domain={['dataMin - 10', 'dataMax + 10']} tickLine={false} axisLine={false} />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    padding: '8px 12px'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                itemStyle={{ paddingTop: '2px', paddingBottom: '2px' }}
            />
            <Legend wrapperStyle={{fontSize: "14px", paddingTop: "20px"}}/>
            <Line type="monotone" dataKey="systolic" name="Systolique" stroke="#f97316" strokeWidth={2.5} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }} />
            <Line type="monotone" dataKey="diastolic" name="Diastolique" stroke="#64748b" strokeWidth={2.5} dot={{ r: 4, fill: '#64748b' }} activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}/>
            <Line type="monotone" dataKey="pulse" name="Pouls" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;