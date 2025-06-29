import React, { useState } from 'react';

const MethodologyView: React.FC = () => {
  const [showCode, setShowCode] = useState(false);

  return (
    <section id="methodology" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-indigo-200 hover:text-indigo-100 transition-colors duration-300">Methodology</h2>
        <p className="text-gray-300 mb-4">Data analysis steps performed on the GitHub repository dataset.</p>
        <button
          onClick={() => setShowCode(!showCode)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300 mb-4"
        >
          {showCode ? 'Hide Analysis Code' : 'Show Analysis Code'}
        </button>
        {showCode && (
          <div className="bg-card p-6 rounded-lg shadow-lg overflow-x-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {`# Importing required libraries
import pandas as pd
import numpy as np

# Step 1: Loading the dataset
def load_data(file_path):
    df = pd.read_csv(file_path)
    return df

# Step 2: Cleaning the data
def clean_data(df):
    # Remove duplicates based on repository name
    df_cleaned = df.drop_duplicates(subset=['repositories'])
    # Convert NULL values to defaults
    df_cleaned['language'] = df_cleaned['language'].replace('NULL', 'Unknown')
    df_cleaned['contributors'] = df_cleaned['contributors'].replace('NULL', 0).astype(float)
    df_cleaned[['stars_count', 'forks_count', 'issues_count', 'pull_requests']] = df_cleaned[['stars_count', 'forks_count', 'issues_count', 'pull_requests']].apply(pd.to_numeric, errors='coerce').fillna(0)
    return df_cleaned

# Step 3: Calculating basic statistics
def calculate_stats(df):
    mean_stars = df['stars_count'].mean()
    issues_sorted = df['issues_count'].sort_values()
    median_issues = issues_sorted.iloc[len(issues_sorted) // 2]
    mean_issues = df['issues_count'].mean()
    std_issues = np.sqrt(((df['issues_count'] - mean_issues) ** 2).mean())
    z_scores = (df['issues_count'] - mean_issues) / (std_issues or 1)
    outliers = len(df[abs(z_scores) > 2])
    mean_forks = df['forks_count'].mean()
    corr_stars_forks = df['stars_count'].corr(df['forks_count'])
    return {
        'mean_stars': mean_stars,
        'median_issues': median_issues,
        'std_issues': std_issues,
        'outliers': outliers,
        'corr_stars_forks': corr_stars_forks
    }

# Step 4: Language statistics
def language_stats(df):
    lang_stats = df.groupby('language').agg({'repositories': 'count', 'stars_count': 'mean'}).reset_index()
    return lang_stats.sort_values('repositories', ascending=False).head(10)

# Step 5: Activity levels
def activity_levels(df):
    levels = [
        ('Low (<50 issues)', len(df[df['issues_count'] < 50])),
        ('Medium (50-100 issues)', len(df[(df['issues_count'] >= 50) & (df['issues_count'] <= 100)])),
        ('High (>100 issues)', len(df[df['issues_count'] > 100]))
    ]
    return [{'name': name, 'count': count} for name, count in levels]

# Main execution
if __name__ == "__main__":
    file_path = 'github_dataset.csv'
    df = load_data(file_path)
    df_cleaned = clean_data(df)
    stats = calculate_stats(df_cleaned)
    lang_stats = language_stats(df_cleaned)
    activity = activity_levels(df_cleaned)
    print("Stats:", stats)
    print("Language Stats:", lang_stats)
    print("Activity Levels:", activity)`}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};

export default MethodologyView;