import os
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation
import joblib

def run_lda():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, "..", "..", "preprocessing", "cleaned_app_reviews.csv")
    
    print(f"Loading cleaned data from {dataset_path}...")
    df = pd.read_csv(dataset_path).dropna(subset=['text_clean'])
    print(f"Loaded {len(df)} rows.")
    
    # Vectorize
    vectorizer = TfidfVectorizer(
        max_features=5000, 
        ngram_range=(1, 2), 
        min_df=3, 
        max_df=0.9
    )
    tfidf_matrix = vectorizer.fit_transform(df['text_clean'])
    print(f"TF-IDF Matrix Shape: {tfidf_matrix.shape}")
    
    # Run LDA with 8 topics corresponding to our 8 aspects
    n_topics = 8
    print(f"Training LDA with {n_topics} components...")
    lda = LatentDirichletAllocation(
        n_components=n_topics, 
        max_iter=15, 
        learning_method='online', 
        random_state=42,
        n_jobs=-1
    )
    lda.fit(tfidf_matrix)
    print("LDA model training completed!")
    
    # Display top 15 words per topic
    feature_names = vectorizer.get_feature_names_out()
    for topic_idx, topic in enumerate(lda.components_):
        top_words_idx = topic.argsort()[:-15 - 1:-1]
        top_words = [feature_names[i] for i in top_words_idx]
        print(f"Topic #{topic_idx + 1}:")
        print(" | ".join(top_words))
        print("-" * 80)
        
    # Save model and results
    weights_dir = os.path.join(base_dir, "..", "weights")
    data_dir = os.path.join(base_dir, "..", "data")
    os.makedirs(weights_dir, exist_ok=True)
    os.makedirs(data_dir, exist_ok=True)
    
    topic_distributions = lda.transform(tfidf_matrix)
    df['predicted_topic'] = topic_distributions.argmax(axis=1)
    df['topic_probability'] = topic_distributions.max(axis=1)
    
    df.to_csv(os.path.join(data_dir, 'reviews_with_topics.csv'), index=False)
    joblib.dump(lda, os.path.join(weights_dir, 'lda_topic_model.pkl'))
    joblib.dump(vectorizer, os.path.join(weights_dir, 'tfidf_vectorizer_lda.pkl'))
    print(f"Saved outputs to modeling/data and modeling/weights.")

if __name__ == "__main__":
    run_lda()
