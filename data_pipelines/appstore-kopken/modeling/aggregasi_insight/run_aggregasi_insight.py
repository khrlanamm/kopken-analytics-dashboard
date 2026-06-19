import os
import pandas as pd
import numpy as np

def run_aggregation():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, "..", "data", "reviews_with_aspect_sentiment.csv")
    
    print(f"Loading sentiment data from {dataset_path}...")
    df = pd.read_csv(dataset_path)
    print(f"Loaded {len(df)} rows.")
    
    aspect_cols = ['aspek_rasa', 'aspek_harga', 'aspek_aplikasi', 'aspek_pelayanan', 'aspek_kecepatan', 'aspek_stok', 'aspek_pengiriman', 'aspek_pesanan']
    
    # 1. Fill NaN app versions
    df['app_version'] = df['app_version'].fillna('Unknown')
    
    # 2. Extract monthly period
    df['date_dt'] = pd.to_datetime(df['date'])
    df['year_month'] = df['date_dt'].dt.to_period('M').astype(str)
    
    # Helper to calculate aspect counts and negative sentiment ratios
    def aggregate_by_dim(dim_col):
        # Base stats
        base = df.groupby(dim_col).agg(
            total_review=('review_text', 'count'),
            avg_rating=('rating', 'mean')
        ).reset_index()
        
        # Aspect frequencies
        aspects = df.groupby(dim_col)[aspect_cols].sum().reset_index()
        
        # Negative sentiment ratios
        def calc_neg_ratios(group):
            ratios = {}
            for aspect in aspect_cols:
                sentiment_col = aspect.replace('aspek_', 'sentimen_')
                aspect_mentions = group[aspect].sum()
                neg_mentions = (group[sentiment_col] == 'negative').sum()
                ratios[aspect.replace('aspek_', 'neg_ratio_')] = neg_mentions / aspect_mentions if aspect_mentions > 0 else 0.0
            return pd.Series(ratios)
            
        neg_ratios = df.groupby(dim_col).apply(calc_neg_ratios).reset_index()
        
        # Merge
        merged = pd.merge(base, aspects, on=dim_col)
        merged = pd.merge(merged, neg_ratios, on=dim_col)
        return merged

    print("Aggregating by app version...")
    agg_version = aggregate_by_dim('app_version')
    
    print("Aggregating by month...")
    agg_month = aggregate_by_dim('year_month')
    
    # Save outputs
    data_dir = os.path.join(base_dir, "..", "data")
    os.makedirs(data_dir, exist_ok=True)
    
    agg_version.to_csv(os.path.join(data_dir, 'aggregated_insight_per_version.csv'), index=False)
    agg_month.to_csv(os.path.join(data_dir, 'aggregated_insight_per_month.csv'), index=False)
    
    # Save a master table with all data + aspect sentiment columns
    df.to_csv(os.path.join(data_dir, 'aspect_analysis_app.csv'), index=False)
    
    print("\n=== TOP 5 APP VERSIONS BY REVIEW COUNT ===")
    print(agg_version.sort_values(by='total_review', ascending=False).head(5)[['app_version', 'total_review', 'avg_rating', 'aspek_aplikasi', 'neg_ratio_aplikasi']])
    
    print("\n=== TOP 5 MONTHS BY REVIEW COUNT ===")
    print(agg_month.sort_values(by='total_review', ascending=False).head(5)[['year_month', 'total_review', 'avg_rating', 'aspek_aplikasi', 'neg_ratio_aplikasi']])
    
    print(f"\nSaved aggregation files to modeling/data.")

if __name__ == "__main__":
    run_aggregation()
