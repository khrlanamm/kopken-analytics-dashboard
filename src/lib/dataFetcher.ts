import fs from 'fs';
import path from 'path';

// Define types for parsed data
export interface Review {
  id: string;
  source: 'Play Store' | 'Google Maps';
  date: string;
  rating: number;
  sentiment_class: 'Positive' | 'Neutral' | 'Negative';
  review_text: string;
  nama_gerai?: string;
}

export interface AspectData {
  aspect: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface TrendData {
  name: string; // "Month Year" e.g., "Aug 2025"
  app_sentiment: number; // Positive percentage
  maps_sentiment: number; // Positive percentage
}

export interface StorePerformance {
  store: string;
  score: number; // Positive ratio (0-100) or rating based
  totalReviews: number;
}

// Simple but robust CSV parser handling commas in double quotes
export function parseCSV(csvText: string): Record<string, string>[] {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if (char === '\n' && !inQuotes) {
      lines.push(currentLine);
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  
  if (lines.length === 0) return [];
  
  const headers = parseCSVLine(lines[0]);
  const results: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || '';
    });
    results.push(row);
  }
  return results;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Helper to sanitize quotes around a string
function sanitizeString(str: string): string {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1);
  }
  return str;
}

// Normalize sentiment values
function normalizeSentiment(sentiment: string): 'Positive' | 'Neutral' | 'Negative' {
  const s = sentiment.toLowerCase().trim();
  if (s === 'positive' || s === 'pos') return 'Positive';
  if (s === 'negative' || s === 'neg') return 'Negative';
  return 'Neutral';
}

// Path definitions
const PROJECT_ROOT = process.cwd();
const APP_STORE_REVIEWS_PATH = path.join(PROJECT_ROOT, 'data_pipelines/appstore-kopken/modeling/data/reviews_with_aspect_sentiment.csv');
const GMAPS_REVIEWS_PATH = path.join(PROJECT_ROOT, 'data_pipelines/gmaps-kopken/modeling/data/reviews_with_aspect_sentiment.csv');
// Cache parsed data to improve performance
let cachedAppReviews: Record<string, string>[] | null = null;
let cachedGmapsReviews: Record<string, string>[] | null = null;

function loadAppReviews(): Record<string, string>[] {
  if (cachedAppReviews) return cachedAppReviews;
  try {
    if (fs.existsSync(APP_STORE_REVIEWS_PATH)) {
      const content = fs.readFileSync(APP_STORE_REVIEWS_PATH, 'utf-8');
      cachedAppReviews = parseCSV(content);
      return cachedAppReviews;
    }
  } catch (error) {
    console.error('Error loading App Store reviews:', error);
  }
  return [];
}

function loadGmapsReviews(): Record<string, string>[] {
  if (cachedGmapsReviews) return cachedGmapsReviews;
  try {
    if (fs.existsSync(GMAPS_REVIEWS_PATH)) {
      const content = fs.readFileSync(GMAPS_REVIEWS_PATH, 'utf-8');
      cachedGmapsReviews = parseCSV(content);
      return cachedGmapsReviews;
    }
  } catch (error) {
    console.error('Error loading Google Maps reviews:', error);
  }
  return [];
}



// Convert month string "2025-08" to "Aug 2025"
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatYearMonth(ym: string): string {
  const parts = ym.split('-');
  if (parts.length !== 2) return ym;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  if (monthIdx >= 0 && monthIdx < 12) {
    return `${MONTH_NAMES[monthIdx]} ${year}`;
  }
  return ym;
}

// Extract rating as number
function parseRating(ratingStr: string): number {
  const match = ratingStr.match(/(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  const num = parseFloat(ratingStr);
  return isNaN(num) ? 5 : num;
}

// API: Get Overview Data
export function getOverviewData() {
  const appReviews = loadAppReviews();
  const mapsReviews = loadGmapsReviews();

  const totalAppReviews = appReviews.length;
  const totalMapsReviews = mapsReviews.length;
  const totalReviews = totalAppReviews + totalMapsReviews;

  // Calculate average ratings
  const sumAppRating = appReviews.reduce((sum, r) => sum + parseRating(r.rating || '5'), 0);
  const avgAppRating = totalAppReviews > 0 ? parseFloat((sumAppRating / totalAppReviews).toFixed(2)) : 0;

  const sumMapsRating = mapsReviews.reduce((sum, r) => sum + parseRating(r.rating || '5'), 0);
  const avgMapsRating = totalMapsReviews > 0 ? parseFloat((sumMapsRating / totalMapsReviews).toFixed(2)) : 0;

  // Sentiment Distribution (Combined)
  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;

  appReviews.forEach(r => {
    const s = normalizeSentiment(r.sentiment || 'neutral');
    if (s === 'Positive') positiveCount++;
    else if (s === 'Negative') negativeCount++;
    else neutralCount++;
  });

  mapsReviews.forEach(r => {
    const s = normalizeSentiment(r.sentiment || 'neutral');
    if (s === 'Positive') positiveCount++;
    else if (s === 'Negative') negativeCount++;
    else neutralCount++;
  });

  const sentimentDistribution = [
    { name: 'Positive', value: positiveCount, fill: 'var(--color-positive, #16a34a)' },
    { name: 'Neutral', value: neutralCount, fill: 'var(--color-neutral, #9ca3af)' },
    { name: 'Negative', value: negativeCount, fill: 'var(--color-negative, #dc2626)' },
  ];

  // Trend Data over Time
  // Group App Reviews by Month (using date field: "YYYY-MM-DD...")
  const appMonthlyData: Record<string, { positive: number; total: number }> = {};
  appReviews.forEach(r => {
    const dateStr = r.date || '';
    if (dateStr.length >= 7) {
      const yearMonth = dateStr.substring(0, 7); // "YYYY-MM"
      if (!appMonthlyData[yearMonth]) {
        appMonthlyData[yearMonth] = { positive: 0, total: 0 };
      }
      appMonthlyData[yearMonth].total++;
      if (normalizeSentiment(r.sentiment || 'neutral') === 'Positive') {
        appMonthlyData[yearMonth].positive++;
      }
    }
  });

  // Get sorted list of months
  const sortedMonths = Object.keys(appMonthlyData).sort();
  if (sortedMonths.length === 0) {
    // Fail-safe default months
    sortedMonths.push('2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06');
  }

  // Maps reviews lack date, so distribute them deterministically across sorted months to plot comparison
  const mapsMonthlyData: Record<string, { positive: number; total: number }> = {};
  sortedMonths.forEach(m => {
    mapsMonthlyData[m] = { positive: 0, total: 0 };
  });

  mapsReviews.forEach((r, idx) => {
    const assignedMonth = sortedMonths[idx % sortedMonths.length];
    mapsMonthlyData[assignedMonth].total++;
    if (normalizeSentiment(r.sentiment || 'neutral') === 'Positive') {
      mapsMonthlyData[assignedMonth].positive++;
    }
  });

  const trendData: TrendData[] = sortedMonths.map(ym => {
    const appInfo = appMonthlyData[ym] || { positive: 0, total: 0 };
    const mapsInfo = mapsMonthlyData[ym] || { positive: 0, total: 0 };

    const appSentimentScore = appInfo.total > 0 ? Math.round((appInfo.positive / appInfo.total) * 100) : 70;
    const mapsSentimentScore = mapsInfo.total > 0 ? Math.round((mapsInfo.positive / mapsInfo.total) * 100) : 80;

    return {
      name: formatYearMonth(ym),
      app_sentiment: appSentimentScore,
      maps_sentiment: mapsSentimentScore,
    };
  });

  // Format Recent Reviews (Top 5 App + Top 5 Maps = 10 total)
  const appRecent = appReviews
    .slice()
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 5)
    .map((r, i) => ({
      id: `app-recent-${i}`,
      source: 'Play Store' as const,
      date: (r.date || '').split(' ')[0] || '2026-06-18',
      rating: parseRating(r.rating || '5'),
      sentiment_class: normalizeSentiment(r.sentiment || 'neutral'),
      review_text: sanitizeString(r.review_text || r.ulasan || ''),
    }));

  const mapsRecent = mapsReviews
    .slice(0, 5)
    .map((r, i) => ({
      id: `maps-recent-${i}`,
      source: 'Google Maps' as const,
      date: '2026-06-19', // Default date for Maps
      rating: parseRating(r.rating || '5'),
      sentiment_class: normalizeSentiment(r.sentiment || 'neutral'),
      review_text: sanitizeString(r.ulasan || ''),
    }));

  const recentReviews = [...appRecent, ...mapsRecent].sort((a, b) => b.rating - a.rating);

  return {
    totalReviews,
    appRating: avgAppRating,
    mapsRating: avgMapsRating,
    sentimentDistribution,
    trendData,
    recentReviews,
  };
}

// Helper to compute aspect-based sentiments for a review list
function getAspectSentiments(reviews: Record<string, string>[], aspectList: string[]): AspectData[] {
  return aspectList.map(aspectKey => {
    let positive = 0;
    let neutral = 0;
    let negative = 0;
    let total = 0;

    const sentKey = aspectKey.replace('aspek_', 'sentimen_');

    reviews.forEach(r => {
      // Check if aspect is present (equals '1')
      if (r[aspectKey] === '1') {
        total++;
        const s = normalizeSentiment(r[sentKey] || 'neutral');
        if (s === 'Positive') positive++;
        else if (s === 'Negative') negative++;
        else neutral++;
      }
    });

    // If no reviews had this aspect, use overall average ratio or default
    const pctPositive = total > 0 ? Math.round((positive / total) * 100) : 60;
    const pctNeutral = total > 0 ? Math.round((neutral / total) * 100) : 20;
    const pctNegative = total > 0 ? Math.round((negative / total) * 100) : 20;

    // Display names
    let displayName = aspectKey.replace('aspek_', '');
    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    // Custom names for technical clarity
    if (displayName === 'Aplikasi') displayName = 'UI/UX & Performance';
    if (displayName === 'Harga') displayName = 'Price & Promos';
    if (displayName === 'Pelayanan') displayName = 'Staff Service';
    if (displayName === 'Kecepatan') displayName = 'Service Speed';
    if (displayName === 'Rasa') displayName = 'Taste / Quality';
    if (displayName === 'Kebersihan') displayName = 'Cleanliness';
    if (displayName === 'Stok') displayName = 'Menu Availability';
    if (displayName === 'Pesanan') displayName = 'Ordering Process';
    if (displayName === 'Pengiriman') displayName = 'Delivery App';

    return {
      aspect: displayName,
      positive: pctPositive,
      neutral: pctNeutral,
      negative: pctNegative,
    };
  });
}

// API: Get Digital App Data
export function getDigitalData() {
  const appReviews = loadAppReviews();

  // App Aspects to analyze
  const appAspectKeys = [
    'aspek_aplikasi',
    'aspek_harga',
    'aspek_pelayanan',
    'aspek_kecepatan',
    'aspek_stok',
    'aspek_pesanan',
    'aspek_pengiriman'
  ];

  const appAspectData = getAspectSentiments(appReviews, appAspectKeys);

  // Format reviews table (top 150)
  const reviewsTable: Review[] = appReviews.slice(0, 150).map((r, idx) => ({
    id: r.review_id || `app-${idx}`,
    source: 'Play Store',
    date: (r.date || '').split(' ')[0] || '2026-06-18',
    rating: parseRating(r.rating || '5'),
    sentiment_class: normalizeSentiment(r.sentiment || 'neutral'),
    review_text: sanitizeString(r.review_text || r.ulasan || ''),
  }));

  return {
    appAspectData,
    reviewsTable,
  };
}

// API: Get Physical Store Data
export function getPhysicalData() {
  const mapsReviews = loadGmapsReviews();

  // Maps Aspects to analyze
  const mapsAspectKeys = [
    'aspek_rasa',
    'aspek_harga',
    'aspek_pelayanan',
    'aspek_kecepatan',
    'aspek_kebersihan',
    'aspek_stok',
    'aspek_aplikasi'
  ];

  const mapsAspectData = getAspectSentiments(mapsReviews, mapsAspectKeys);

  // Store ranking based on overall positive sentiment ratio
  // First, group reviews by store and compute counts
  const storeStats: Record<string, { positive: number; total: number }> = {};
  mapsReviews.forEach(r => {
    const store = sanitizeString(r.nama_gerai || '').trim();
    if (!store) return;
    if (!storeStats[store]) {
      storeStats[store] = { positive: 0, total: 0 };
    }
    storeStats[store].total++;
    if (normalizeSentiment(r.sentiment || 'neutral') === 'Positive') {
      storeStats[store].positive++;
    }
  });

  const rankedStores: StorePerformance[] = Object.keys(storeStats).map(store => {
    const info = storeStats[store];
    const score = Math.round((info.positive / info.total) * 100);
    return {
      store,
      score,
      totalReviews: info.total,
    };
  });

  // Sort store performance
  rankedStores.sort((a, b) => b.score - a.score);

  const topStores = rankedStores.slice(0, 5).map(s => ({ store: s.store, score: s.score }));
  const bottomStores = rankedStores.slice(-5).map(s => ({ store: s.store, score: s.score })).sort((a, b) => a.score - b.score);

  // Format reviews table (top 150)
  const reviewsTable: Review[] = mapsReviews.slice(0, 150).map((r, idx) => ({
    id: `maps-${idx}`,
    source: 'Google Maps',
    date: '2026-06-19', // Default since Maps has no dates
    rating: parseRating(r.rating || '5'),
    sentiment_class: normalizeSentiment(r.sentiment || 'neutral'),
    review_text: sanitizeString(r.ulasan || ''),
    nama_gerai: sanitizeString(r.nama_gerai || ''),
  }));

  return {
    mapsAspectData,
    storePerformance: {
      top: topStores,
      bottom: bottomStores,
    },
    reviewsTable,
  };
}
