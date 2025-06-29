import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Header, Home, DataView, AnalysisView, MethodologyView, ResultsView } from './components';
import { GitHubRepo, AnalysisData } from './types';

const App: React.FC = () => {
  const [rawData, setRawData] = useState<GitHubRepo[]>([]);
  const [cleanedData, setCleanedData] = useState<GitHubRepo[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisData>({
    stats: { mean_stars: 0, median_issues: 0, std_issues: 0, outliers: 0, corr_stars_forks: 0 },
    language_stats: [],
    activity_levels: [],
    contrib_ops: [],
    cleaned_data: [],
    top_contributors: [],
    issue_trends: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Papa.parse<GitHubRepo>('/github_dataset.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const data = result.data as GitHubRepo[];
        console.log('Total Raw Rows:', data.length);
        const cleaned = data
          .filter((row, index, self) => index === self.findIndex((t) => t.repositories === row.repositories))
          .map((row) => ({
            ...row,
            language: row.language === 'NULL' ? 'Unknown' : row.language,
            contributors: row.contributors === 'NULL' ? 0 : Number(row.contributors),
            stars_count: Number(row.stars_count) || 0,
            forks_count: Number(row.forks_count) || 0,
            issues_count: Number(row.issues_count) || 0,
            pull_requests: Number(row.pull_requests) || 0,
          }));
        console.log('Total Cleaned Rows:', cleaned.length);
        console.log('Raw Data Sample:', data.slice(0, 5));
        console.log('Cleaned Data Sample:', cleaned.slice(0, 5));

        // Calculate statistics
        const mean_stars = cleaned.reduce((sum, row) => sum + row.stars_count, 0) / cleaned.length || 0;
        const issues_sorted = cleaned.map((row) => row.issues_count).sort((a, b) => a - b);
        const median_issues = issues_sorted[Math.floor(issues_sorted.length / 2)] || 0;
        const mean_issues = cleaned.reduce((sum, row) => sum + row.issues_count, 0) / cleaned.length || 0;
        const std_issues = Math.sqrt(
          cleaned.reduce((sum, row) => sum + Math.pow(row.issues_count - mean_issues, 2), 0) / cleaned.length
        ) || 0;
        const z_scores = cleaned.map((row) => (row.issues_count - mean_issues) / (std_issues || 1));
        const outliers = cleaned.filter((_, i) => Math.abs(z_scores[i]) > 2).length || 0;
        const mean_forks = cleaned.reduce((sum, row) => sum + row.forks_count, 0) / cleaned.length || 0;
        const numerator = cleaned.reduce((sum, row) => sum + (row.stars_count - mean_stars) * (row.forks_count - mean_forks), 0);
        const denominator = Math.sqrt(
          cleaned.reduce((sum, row) => sum + Math.pow(row.stars_count - mean_stars, 2), 0) *
          cleaned.reduce((sum, row) => sum + Math.pow(row.forks_count - mean_forks, 2), 0)
        );
        const corr_stars_forks = denominator !== 0 ? numerator / denominator : 0;

        // Calculate language statistics
        const language_stats = Object.entries(
          cleaned.reduce((acc: Record<string, { repositories: number; stars_count: number }>, row) => {
            acc[row.language] = acc[row.language] || { repositories: 0, stars_count: 0 };
            acc[row.language].repositories += 1;
            acc[row.language].stars_count += row.stars_count;
            return acc;
          }, {})
        )
          .map(([language, stats]) => ({
            language,
            repositories: stats.repositories,
            stars_count: stats.stars_count / stats.repositories,
          }))
          .sort((a, b) => b.repositories - a.repositories)
          .slice(0, 10);

        // Calculate activity levels
        const activity_levels = [
          { name: 'Low (<50 issues)', count: cleaned.filter((row) => row.issues_count < 50).length },
          { name: 'Medium (50-100 issues)', count: cleaned.filter((row) => row.issues_count >= 50 && row.issues_count <= 100).length },
          { name: 'High (>100 issues)', count: cleaned.filter((row) => row.issues_count > 100).length },
        ];

        // Identify contribution opportunities
        const contrib_ops = cleaned.filter((row) => row.issues_count > 50 && row.pull_requests < 10).slice(0, 5);

        // Calculate top contributors
        const top_contributors = [...cleaned]
          .sort((a, b) => b.contributors - a.contributors)
          .slice(0, 10)
          .map(row => ({ repositories: row.repositories, contributors: row.contributors }));

        // Calculate issue trends by rank
        const issue_trends = cleaned
          .sort((a, b) => b.issues_count - a.issues_count)
          .map((row, index) => ({ rank: index + 1, issues_count: row.issues_count }))
          .slice(0, 20); // Top 20 for clarity

        setRawData(data);
        setCleanedData(cleaned);
        setAnalysis({
          stats: { mean_stars, median_issues, std_issues, outliers, corr_stars_forks },
          language_stats,
          activity_levels,
          contrib_ops,
          cleaned_data: cleaned,
          top_contributors,
          issue_trends,
        });
        setLoading(false);
      },
      error: (err) => {
        console.error('Error parsing CSV:', err);
        setError('Failed to load data. Please check if github_dataset.csv is in the public folder.');
        setLoading(false);
      },
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Home />
      <DataView rawData={rawData} cleanedData={cleanedData} />
      <AnalysisView analysis={analysis} />
      <MethodologyView />
      <ResultsView analysis={analysis} />
    </div>
  );
};

export default App;