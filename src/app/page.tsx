"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Star, Smartphone, Store, Users, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';



interface TrendItem {
  name: string;
  app_sentiment: number;
  maps_sentiment: number;
}

interface RecentReview {
  id: string;
  source: 'Play Store' | 'Google Maps';
  date: string;
  rating: number;
  sentiment_class: 'Positive' | 'Neutral' | 'Negative';
  review_text: string;
}

interface DashboardData {
  totalReviews: number;
  appRating: number;
  mapsRating: number;
  sentimentDistribution: { name: string; value: number; fill: string }[];
  trendData: TrendItem[];
  recentReviews: RecentReview[];
}

function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-muted rounded"></div>
        <div className="h-4 w-64 bg-muted rounded mt-2"></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded mb-2"></div>
              <div className="h-3 w-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <div className="h-5 w-48 bg-muted rounded"></div>
        </CardHeader>
        <CardContent className="h-[350px] bg-muted/20 rounded m-6"></CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="h-5 w-32 bg-muted rounded"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted/20 rounded border"></div>
            ))}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <div className="h-5 w-48 bg-muted rounded"></div>
          </CardHeader>
          <CardContent className="h-[300px] bg-muted/20 rounded m-6"></CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dashboard/overview.json');
      if (!response.ok) {
        throw new Error(`Gagal mengambil data dari server (${response.status})`);
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <OverviewSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-6 items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md p-6 border rounded-lg bg-card">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto animate-bounce" />
          <h2 className="text-2xl font-bold text-destructive">Terjadi Kesalahan</h2>
          <p className="text-muted-foreground">{error || 'Data gagal dimuat.'}</p>
          <button 
            onClick={fetchData} 
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const positivePercent = data.totalReviews > 0 
    ? Math.round((data.sentimentDistribution.find(d => d.name === 'Positive')?.value || 0) / data.totalReviews * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Overview</h1>
        <p className="text-muted-foreground">Analisis Sentimen Keseluruhan: Aplikasi & Gerai Fisik</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalReviews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Dari Play Store & Google Maps</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">App Rating</CardTitle>
            <Smartphone className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.appRating} <span className="text-muted-foreground text-lg">/ 5.0</span></div>
            <p className="text-xs text-muted-foreground">Google Play Store</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maps Rating</CardTitle>
            <Store className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.mapsRating} <span className="text-muted-foreground text-lg">/ 5.0</span></div>
            <p className="text-xs text-muted-foreground">Google Maps (Jabodetabek)</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
            <Star className="h-4 w-4 text-green-600 fill-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{positivePercent}%</div>
            <p className="text-xs text-muted-foreground">Rasio sentimen positif keseluruhan</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sentiment Trend (Digital App vs Physical Stores)</CardTitle>
          <Badge variant="outline" className="text-xs font-normal border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400">
            Real Data Timeline
          </Badge>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b0000" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b0000" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMaps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Legend />
                <Area type="monotone" dataKey="app_sentiment" name="App Sentiment Score (Positive %)" stroke="#8b0000" strokeWidth={2} fillOpacity={1} fill="url(#colorApp)" />
                <Area type="monotone" dataKey="maps_sentiment" name="Maps Sentiment Score (Positive %)" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#colorMaps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
              {data.recentReviews.map((review) => (
                <div key={review.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{review.source}</span>
                        <Badge variant="secondary" className="text-[10px]">{review.date}</Badge>
                      </div>
                      <Badge className={
                        review.sentiment_class === 'Positive' ? 'bg-green-600 hover:bg-green-700 text-white' :
                        review.sentiment_class === 'Negative' ? 'bg-red-600 hover:bg-red-700 text-white' :
                        'bg-gray-500 hover:bg-gray-600 text-white'
                      }>
                        {review.sentiment_class}
                      </Badge>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-muted'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 italic">&quot;{review.review_text}&quot;</p>
                  </div>
                </div>
              ))}
              {data.recentReviews.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Tidak ada ulasan terbaru.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.sentimentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.sentimentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value ? Number(value).toLocaleString() : '0', 'Reviews']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-600"></div> Positive</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div> Neutral</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-600"></div> Negative</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

