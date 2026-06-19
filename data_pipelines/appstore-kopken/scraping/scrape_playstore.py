import os
import time
import pandas as pd
from google_play_scraper import Sort, reviews

def scrape_playstore_reviews(app_id="com.kopikenangan", count_needed=5000):
    print(f"=== Starting Play Store Scraper for App ID: {app_id} ===")
    
    reviews_list = []
    continuation_token = None
    batch_size = 200
    
    # Initial batch fetch
    try:
        result, continuation_token = reviews(
            app_id,
            lang='id',
            country='id',
            sort=Sort.NEWEST,
            count=batch_size
        )
        reviews_list.extend(result)
        print(f"Fetched initial batch. Total reviews: {len(reviews_list)}")
    except Exception as e:
        print(f"Error during initial fetch: {e}")
        return
        
    # Pagination loop
    while len(reviews_list) < count_needed and continuation_token:
        try:
            print(f"Fetching next batch... Current count: {len(reviews_list)} / {count_needed}")
            time.sleep(1.5)  # Be polite to Google servers
            
            result, continuation_token = reviews(
                app_id,
                lang='id',
                country='id',
                sort=Sort.NEWEST,
                count=batch_size,
                continuation_token=continuation_token
            )
            
            if not result:
                print("No more reviews returned. Stopping pagination.")
                break
                
            reviews_list.extend(result)
        except Exception as e:
            print(f"Error during pagination fetch: {e}")
            print("Stopping pagination and saving what has been collected.")
            break
            
    print(f"=== Scraping Completed. Total reviews fetched: {len(reviews_list)} ===")
    
    # Convert to DataFrame
    df = pd.DataFrame(reviews_list)
    
    if df.empty:
        print("Scraped dataframe is empty. Nothing to save.")
        return
        
    # Map raw columns to the target schema:
    # review_id, username, review_text, rating, date, app_version, thumbs_up, platform
    df_mapped = pd.DataFrame({
        'review_id': df['reviewId'],
        'username': df['userName'],
        'review_text': df['content'],
        'rating': df['score'],
        'date': df['at'],
        'app_version': df['appVersion'],
        'thumbs_up': df['thumbsUpCount'],
        'platform': 'playstore'
    })
    
    # Create directory if it doesn't exist
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, "raw_app_reviews.csv")
    
    df_mapped.to_csv(output_path, index=False, encoding='utf-8')
    print(f"Saved {len(df_mapped)} reviews to: {output_path}")

if __name__ == "__main__":
    scrape_playstore_reviews(count_needed=5000)
