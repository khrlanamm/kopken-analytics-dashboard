import os
import re
import string
import json
import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory

# Initialize NLTK
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt_tab', quiet=True)

def load_resources():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(base_dir))
    
    # 1. Load baseline slang words from 2-gmaps-kopken-modeling/preprocessing
    gmaps_slang_path = os.path.join(project_root, "preprocessing", "combined_slang_words.txt")
    with open(gmaps_slang_path, 'r', encoding='utf-8') as f:
        slang_dict = json.load(f)
        
    # 2. Load and merge additional app slang
    app_slang_path = os.path.join(base_dir, "slang_tambahan_app.txt")
    with open(app_slang_path, 'r', encoding='utf-8') as f:
        app_slang = json.load(f)
    slang_dict.update(app_slang)
    print(f"Loaded slang dictionary with {len(slang_dict)} words total.")
    
    # 3. Load stop words
    gmaps_stop_path = os.path.join(project_root, "preprocessing", "combined_stop_words.txt")
    with open(gmaps_stop_path, 'r', encoding='utf-8') as f:
        stopword_indo = set([line.strip() for line in f if line.strip()])
    print(f"Loaded stopword dictionary with {len(stopword_indo)} words.")
    
    return slang_dict, stopword_indo

def clean_noise(text):
    if not isinstance(text, str):
        return ""
    text = re.sub(r'@[A-Za-z0-9_]+', '', text)
    text = re.sub(r'#[A-Za-z0-9_]+', '', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'\d+', '', text)
    text = text.replace('\n', ' ')
    text = text.encode('ascii', 'ignore').decode('ascii')
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = ' '.join(text.split())
    return text.lower()

# Caching stemmer for performance
stem_cache = {}
factory = StemmerFactory()
stemmer = factory.create_stemmer()

def get_cached_stem(word):
    if not word:
        return ""
    if word not in stem_cache:
        stem_cache[word] = stemmer.stem(word)
    return stem_cache[word]

def preprocess_review(text, slang_dict, stopword_indo):
    try:
        cleaned = clean_noise(text)
        if not cleaned:
            return ""
        tokens = word_tokenize(cleaned)
        normalized = [slang_dict.get(t, t) for t in tokens]
        filtered = [t for t in normalized if t not in stopword_indo]
        stemmed = [get_cached_stem(t) for t in filtered if t]
        return ' '.join(stemmed)
    except Exception as e:
        print(f"[ERROR] Failed to process review: {text[:50]}... - {e}")
        return ""

def map_rating_to_sentiment(stars):
    try:
        stars = int(stars)
        if stars >= 4:
            return 'positive'
        elif stars <= 2:
            return 'negative'
    except Exception:
        pass
    return 'neutral'

def run_preprocessing():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    raw_path = os.path.join(base_dir, "..", "scraping", "raw_app_reviews.csv")
    out_path = os.path.join(base_dir, "cleaned_app_reviews.csv")
    
    print(f"Loading raw reviews from {raw_path}...")
    df = pd.read_csv(raw_path)
    print(f"Loaded {len(df)} rows.")
    
    slang_dict, stopword_indo = load_resources()
    
    print("Running text preprocessing (this might take a few minutes due to stemming)...")
    df['text_clean'] = df['review_text'].apply(lambda x: preprocess_review(x, slang_dict, stopword_indo))
    print("Preprocessing completed!")
    
    # Tag sentiment based on rating
    df['sentiment'] = df['rating'].apply(map_rating_to_sentiment)
    
    # Calculate word count of clean text
    df['word_count'] = df['text_clean'].apply(lambda x: len(str(x).split()))
    
    # Filter out empty reviews (word_count >= 1)
    print(f"Shape before filtering: {df.shape}")
    df_filtered = df[df['word_count'] >= 1].copy()
    print(f"Shape after filtering empty reviews: {df_filtered.shape}")
    
    df_filtered.to_csv(out_path, index=False, encoding='utf-8')
    print(f"Successfully saved cleaned data to {out_path}")

if __name__ == "__main__":
    run_preprocessing()
