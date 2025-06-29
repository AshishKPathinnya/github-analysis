import React, { useState } from 'react';
import { GitHubRepo } from '../types';

interface Props {
  rawData: GitHubRepo[];
  cleanedData: GitHubRepo[];
}

const DataView: React.FC<Props> = ({ rawData, cleanedData }) => {
  const [showTable, setShowTable] = useState(false);

  console.log('Rendering DataView with', cleanedData.length, 'rows');

  const downloadCSV = () => {
    const headers = ['repositories,stars_count,forks_count,issues_count,pull_requests,contributors,language'];
    const rows = cleanedData.map(row =>
      `${row.repositories},${row.stars_count},${row.forks_count},${row.issues_count},${row.pull_requests},${row.contributors},${row.language}`
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'github_dataset_cleaned.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <section id="data" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-indigo-200 hover:text-indigo-100 transition-colors duration-300">Data</h2>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setShowTable(!showTable)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
          >
            {showTable ? 'Hide Repositories' : 'Show Repositories'}
          </button>
          <button
            onClick={downloadCSV}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300"
          >
            Download CSV
          </button>
        </div>
        {showTable && (
          <>
            <h3 className="text-2xl font-semibold mb-4 text-gray-300 hover:text-gray-200 transition-colors duration-300">Cleaned Data</h3>
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full bg-gray-800 border border-gray-700">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="py-3 px-6 border-b border-gray-600 text-left text-gray-200">Repository</th>
                    <th className="py-3 px-6 border-b border-gray-600 text-left text-gray-200">Stars</th>
                    <th className="py-3 px-6 border-b border-gray-600 text-left text-gray-200">Forks</th>
                    <th className="py-3 px-6 border-b border-gray-600 text-left text-gray-200">Issues</th>
                    <th className="py-3 px-6 border-b border-gray-600 text-left text-gray-200">Pull Requests</th>
                    <th className="py-3 px-6 border-b border-gray-600 text-left text-gray-200">Contributors</th>
                    <th className="py-3 px-6 border-b border-gray-600 text-left text-gray-200">Language</th>
                  </tr>
                </thead>
                <tbody>
                  {cleanedData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-700 transition-colors duration-200">
                      <td className="py-3 px-6 border-b border-gray-600">{row.repositories}</td>
                      <td className="py-3 px-6 border-b border-gray-600">{row.stars_count}</td>
                      <td className="py-3 px-6 border-b border-gray-600">{row.forks_count}</td>
                      <td className="py-3 px-6 border-b border-gray-600">{row.issues_count}</td>
                      <td className="py-3 px-6 border-b border-gray-600">{row.pull_requests}</td>
                      <td className="py-3 px-6 border-b border-gray-600">{row.contributors}</td>
                      <td className="py-3 px-6 border-b border-gray-600">{row.language}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default DataView;