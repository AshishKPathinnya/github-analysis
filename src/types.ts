export interface GitHubRepo {
  repositories: string;
  stars_count: number;
  forks_count: number;
  issues_count: number;
  pull_requests: number;
  contributors: number;
  language: string;
}

export interface AnalysisData {
  stats: {
    mean_stars: number;
    median_issues: number;
    std_issues: number;
    outliers: number;
    corr_stars_forks: number;
  };
  language_stats: { language: string; repositories: number; stars_count: number }[];
  activity_levels: { name: string; count: number }[];
  contrib_ops: GitHubRepo[];
  cleaned_data: GitHubRepo[];
  top_contributors: { repositories: string; contributors: number }[];
  issue_trends: { rank: number; issues_count: number }[];
}