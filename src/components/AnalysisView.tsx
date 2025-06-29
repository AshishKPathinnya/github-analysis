import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Scatter,
} from 'recharts';
import { AnalysisData } from '../types';

const COLORS = ['#4B5EAA', '#6B7280', '#9CA3AF'];

const AnalysisView: React.FC<Props> = ({ analysis }) => {
  // Prepare data for stacked bar (contributors vs pull requests)
  const stackedData = analysis.cleaned_data.map(row => ({
    repositories: row.repositories,
    contributors: row.contributors,
    pull_requests: row.pull_requests,
  })).slice(0, 10); // Limit to top 10 for clarity

  // Prepare data for bubble chart (stars vs issues)
  const bubbleData = analysis.cleaned_data.map(row => ({
    stars: row.stars_count,
    issues: row.issues_count,
    size: row.forks_count, // Use forks as bubble size
  })).slice(0, 50); // Limit to 50 for performance

  return (
    <section id="analysis" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-indigo-200 hover:text-indigo-100 transition-colors duration-300">Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Stats Summary */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-gray-300">Mean Stars: {analysis.stats.mean_stars.toFixed(2)}</p>
            <p className="text-gray-300">Median Issues: {analysis.stats.median_issues}</p>
            <p className="text-gray-300">Correlation (Stars vs Forks): {analysis.stats.corr_stars_forks.toFixed(2)}</p>
          </div>

          {/* Bar Chart for Language Stats */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-300">Top Languages by Repositories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analysis.language_stats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="language" stroke="#E5E7EB" angle={-45} textAnchor="end" height={60} />
                <YAxis stroke="#E5E7EB" />
                <Tooltip />
                <Legend />
                <Bar dataKey="repositories" fill="#4B5EAA" barSize={20} label={{ position: 'top', fill: '#E5E7EB' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart for Activity Levels */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-300">Activity Levels</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={analysis.activity_levels}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                >
                  {analysis.activity_levels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stacked Bar Chart for Contributors vs Pull Requests */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-300">Contributors vs Pull Requests (Top 10)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stackedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="repositories" stroke="#E5E7EB" angle={-45} textAnchor="end" height={60} />
                <YAxis stroke="#E5E7EB" />
                <Tooltip />
                <Legend />
                <Bar dataKey="contributors" stackId="a" fill="#6B7280" label={{ position: 'top', fill: '#E5E7EB' }} />
                <Bar dataKey="pull_requests" stackId="a" fill="#9CA3AF" label={{ position: 'top', fill: '#E5E7EB' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bubble Chart for Stars vs Issues */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-300">Stars vs Issues (Top 50)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis type="number" dataKey="stars" name="Stars" stroke="#E5E7EB" />
                <YAxis type="number" dataKey="issues" name="Issues" stroke="#E5E7EB" />
                <Tooltip />
                <Legend />
                <Scatter data={bubbleData} fill="#4B5EAA" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisView;