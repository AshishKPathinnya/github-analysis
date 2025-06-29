from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from scipy.stats import pearsonr

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/data")
async def get_data():
    df = pd.read_csv('github_dataset.csv')
    raw_data = df.to_dict(orient='records')
    
    # Cleaning data
    df = df.drop_duplicates(subset=['repositories'])
    df['language'] = df['language'].replace('NULL', 'Unknown')
    df['contributors'] = df['contributors'].replace('NULL', 0).astype(int)
    numeric_cols = ['stars_count', 'forks_count', 'issues_count', 'pull_requests']
    df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors='coerce').fillna(0).astype(int)
    cleaned_data = df.to_dict(orient='records')
    
    # Statistical analysis
    mean_stars = df['stars_count'].mean()
    median_issues = df['issues_count'].median()
    std_issues = df['issues_count'].std()
    z_scores = (df['issues_count'] - mean_issues) / std_issues
    outliers = len(df[z_scores.abs() > 2])
    corr_stars_forks, _ = pearsonr(df['stars_count'], df['forks_count'])
    
    # Language analysis
    language_stats = df.groupby('language').agg({
        'repositories': 'count',
        'stars_count': 'mean'
    }).reset_index().sort_values('repositories', ascending=False).head(10).to_dict(orient='records')
    
    # Activity levels
    activity_levels = [
        {'name': 'Low (<50 issues)', 'count': len(df[df['issues_count'] < 50])},
        {'name': 'Medium (50-100 issues)', 'count': len(df[(df['issues_count'] >= 50) & (df['issues_count'] <= 100)])},
        {'name': 'High (>100 issues)', 'count': len(df[df['issues_count'] > 100])},
    ]
    
    # Contribution opportunities
    contrib_ops = df[(df['issues_count'] > 50) & (df['pull_requests'] < 10)][['repositories', 'issues_count', 'pull_requests']].head(5).to_dict(orient='records')
    
    return {
        'raw_data': raw_data,
        'cleaned_data': cleaned_data,
        'analysis': {
            'stats': {
                'mean_stars': mean_stars,
                'median_issues': median_issues,
                'std_issues': std_issues,
                'outliers': outliers,
                'corr_stars_forks': corr_stars_forks
            },
            'language_stats': language_stats,
            'activity_levels': activity_levels,
            'contrib_ops': contrib_ops
        }
    }