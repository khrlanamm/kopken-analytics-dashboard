export const kpiData = {
  totalReviews: 6842,
  appRating: 4.2,
  mapsRating: 4.5,
  sentimentDistribution: [
    { name: 'Positive', value: 4105, fill: 'var(--color-positive)' },
    { name: 'Neutral', value: 1711, fill: 'var(--color-neutral)' },
    { name: 'Negative', value: 1026, fill: 'var(--color-negative)' },
  ],
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const years = ['2023', '2024', '2025'];

export const trendData = years.flatMap((year) =>
  months.map((month) => ({
    name: `${month} ${year}`,
    app_sentiment: Math.floor(Math.random() * (85 - 60 + 1)) + 60, // Random score between 60 and 85
    maps_sentiment: Math.floor(Math.random() * (95 - 75 + 1)) + 75, // Random score between 75 and 95
  }))
);

export const appAspectData = [
  { aspect: 'UI/UX', positive: 65, neutral: 20, negative: 15 },
  { aspect: 'Transaction/Payment', positive: 50, neutral: 25, negative: 25 },
  { aspect: 'App Performance', positive: 55, neutral: 15, negative: 30 },
  { aspect: 'Features', positive: 70, neutral: 20, negative: 10 },
];

export const mapsAspectData = [
  { aspect: 'Service Speed', positive: 80, neutral: 10, negative: 10 },
  { aspect: 'Cleanliness', positive: 85, neutral: 10, negative: 5 },
  { aspect: 'Barista Friendliness', positive: 90, neutral: 5, negative: 5 },
  { aspect: 'Taste', positive: 95, neutral: 3, negative: 2 },
];

export const recentReviews = [
  {
    id: 'R1',
    source: 'Play Store',
    date: '2026-06-01',
    rating: 5,
    sentiment_class: 'Positive',
    review_text: 'Aplikasi sekarang jauh lebih smooth. Kemarin sempet ngelag pas mau bayar pake gopay, tapi update terbaru udah oke bgt! Mantap kopken.',
  },
  {
    id: 'R2',
    source: 'Google Maps',
    date: '2026-05-30',
    rating: 4,
    sentiment_class: 'Positive',
    review_text: 'Tempatnya cozy buat wfc, baristanya juga ramah2 bgt. Mantan mantul pokoknya!',
  },
  {
    id: 'R3',
    source: 'Play Store',
    date: '2026-05-28',
    rating: 2,
    sentiment_class: 'Negative',
    review_text: 'Sering banget force close pas lagi milih menu. Tolong dong min dibenerin, padahal lagi pengen banget pesen kopi.',
  },
  {
    id: 'R4',
    source: 'Google Maps',
    date: '2026-05-25',
    rating: 3,
    sentiment_class: 'Neutral',
    review_text: 'Kopinya standar enak kaya biasa, tapi tempatnya agak kotor pas saya dateng sore. Mungkin karyawannya kurang orang.',
  },
  {
    id: 'R5',
    source: 'Play Store',
    date: '2026-05-20',
    rating: 5,
    sentiment_class: 'Positive',
    review_text: 'Banyak promo menarik di app! Lebih untung pesen lewat sini daripada beli langsung di store.',
  },
  {
    id: 'R6',
    source: 'Google Maps',
    date: '2026-05-18',
    rating: 1,
    sentiment_class: 'Negative',
    review_text: 'Pelayanannya lama bgt! Nunggu satu es kopi kenangan mantan aja ampe 30 menit. Kacau.',
  },
  {
    id: 'R7',
    source: 'Play Store',
    date: '2026-05-15',
    rating: 3,
    sentiment_class: 'Neutral',
    review_text: 'UI nya udah lumayan bagus, tapi kadang susah nyari outlet terdekat kalo gps nya ngaco dikit.',
  },
  {
    id: 'R8',
    source: 'Google Maps',
    date: '2026-05-12',
    rating: 5,
    sentiment_class: 'Positive',
    review_text: 'Cabang paling mantap se-Jaksel! Tempat luas, wifi kenceng, kopi konsisten rasanya.',
  },
  {
    id: 'R9',
    source: 'Play Store',
    date: '2026-05-10',
    rating: 4,
    sentiment_class: 'Positive',
    review_text: 'Overall bagus aplikasinya. Cuma saran aja mungkin fiturnya bisa ditambah kaya tracking point yg lebih jelas.',
  },
  {
    id: 'R10',
    source: 'Google Maps',
    date: '2026-05-08',
    rating: 2,
    sentiment_class: 'Negative',
    review_text: 'AC nya ga dingin sama sekali woi. Gerah parah nongkrong di sini siang2.',
  },
];

export const storePerformance = {
  top: [
    { store: 'KopKen Kemang Raya', score: 92 },
    { store: 'KopKen Senopati', score: 90 },
    { store: 'KopKen Bintaro Sektor 7', score: 88 },
    { store: 'KopKen Grand Indonesia', score: 87 },
    { store: 'KopKen Kelapa Gading', score: 85 },
  ],
  bottom: [
    { store: 'KopKen Depok Margonda', score: 45 },
    { store: 'KopKen Blok M Plaza', score: 48 },
    { store: 'KopKen Bekasi Cyber Park', score: 50 },
    { store: 'KopKen Pamulang', score: 52 },
    { store: 'KopKen Stasiun Manggarai', score: 55 },
  ],
};
