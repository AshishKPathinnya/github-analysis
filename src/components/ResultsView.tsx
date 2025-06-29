import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { AnalysisData } from '../types';

interface Props {
  analysis: AnalysisData;
}

const ResultsView: React.FC<Props> = ({ analysis }) => {
  const [sortKey, setSortKey] = useState<keyof GitHubRepo | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedContribOps = [...analysis.contrib_ops].sort((a, b) => {
    if (!sortKey) return 0;
    if (sortOrder === 'asc') return a[sortKey] - b[sortKey];
    return b[sortKey] - a[sortKey];
  });

  const handleSort = (key: keyof GitHubRepo) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleChartClick = (data: any) => {
    const filterValue = data.activePayload?.[0]?.payload.name || data.activeLabel;
    console.log('Filter by:', filterValue);
    // Implement filter logic if needed (e.g., update state to filter data)
  };

  return (
    <section id="results" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-indigo-200 hover:text-indigo-100 transition-colors duration-300">Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Detailed Stats */}
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-300">Summary Statistics</h3>
            <p className="text-gray-300">Total Repositories: {analysis.cleaned_data.length}</p>
            <p className="text-gray-300">Outliers (Issues {'>'} 2σ): {analysis.stats.outliers}</p>
            <p className="text-gray-300">Average Stars per Language: {analysis.language_stats.reduce((sum, l) => sum + l.stars_count, 0) / analysis.language_stats.length || 0}</p>
          </div>

          {/* Bar Chart for Top Contributors */}
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-300">Top 10 Contributors</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analysis.top_contributors} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="repositories" stroke="#E5E7EB" angle={-45} textAnchor="end" height={60} />
                <YAxis stroke="#E5E7EB" />
                <Tooltip />
                <Legend />
                <Bar dataKey="contributors" fill="#4B5EAA" label={{ position: 'top', fill: '#E5E7EB' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart for Issue Trends */}
          <div className="bg-card p-6 rounded-lg shadow-lg col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-300">Issue Trends by Rank (Top 20)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysis.issue_trends} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="rank" stroke="#E5E7EB" />
                <YAxis stroke="#E5E7EB" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="issues_count" stroke="#4B5EAA" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Table for Contribution Opportunities */}
          <div className="bg-card p-6 rounded-lg shadow-lg col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-300">Contribution Opportunities</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-2 px-4 border-b border-gray-600 text-gray-200 cursor-pointer" onClick={() => handleSort('repositories')}>Repository</th>
                  <th className="py-2 px-4 border-b border-gray-600 text-gray-200 cursor-pointer" onClick={() => handleSort('stars_count')}>Stars</th>
                  <th className="py-2 px-4 border-b border-gray-600 text-gray-200 cursor-pointer" onClick={() => handleSort('issues_count')}>Issues</th>
                  <th className="py-2 px-4 border-b border-gray-600 text-gray-200 cursor-pointer" onClick={() => handleSort('pull_requests')}>Pull Requests</th>
                </tr>
              </thead>
              <tbody>
                {sortedContribOps.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-700 transition-colors duration-200">
                    <td className="py-2 px-4 border-b border-gray-600">{row.repositories}</td>
                    <td className="py-2 px-4 border-b border-gray-600">{row.stars_count}</td>
                    <td className="py-2 px-4 border-b border-gray-600">{row.issues_count}</td>
                    <td className="py-2 px-4 border-b border-gray-600">{row.pull_requests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsView;