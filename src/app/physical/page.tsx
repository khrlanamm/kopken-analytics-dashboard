"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Star } from 'lucide-react';

interface AspectData {
  aspect: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface RankedStore {
  store: string;
  score: number;
}

interface MapsReview {
  id: string;
  source: string;
  date: string;
  rating: number;
  sentiment_class: 'Positive' | 'Neutral' | 'Negative';
  review_text: string;
  nama_gerai?: string;
}

interface PhysicalPageData {
  mapsAspectData: AspectData[];
  storePerformance: {
    top: RankedStore[];
    bottom: RankedStore[];
  };
  reviewsTable: MapsReview[];
}

function PhysicalSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-muted rounded"></div>
        <div className="h-4 w-48 bg-muted rounded mt-2"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="h-5 w-48 bg-muted rounded"></div>
          </CardHeader>
          <CardContent className="h-[350px] bg-muted/20 rounded m-6"></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-5 w-64 bg-muted rounded"></div>
          </CardHeader>
          <CardContent className="h-[350px] bg-muted/20 rounded m-6"></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="h-5 w-48 bg-muted rounded"></div>
        </CardHeader>
        <CardContent className="h-[300px] bg-muted/20 rounded m-6"></CardContent>
      </Card>
    </div>
  );
}

export default function PhysicalStorePage() {
  const [data, setData] = useState<PhysicalPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dashboard/physical.json');
      if (!response.ok) {
        throw new Error(`Gagal mengambil data dari server (${response.status})`);
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data gerai fisik.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <PhysicalSkeleton />;
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

  const combinedPerformance = [
    ...data.storePerformance.top.map(store => ({ ...store, type: 'Top 5' })),
    ...data.storePerformance.bottom.map(store => ({ ...store, type: 'Bottom 5' })),
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Physical Store Analytics</h1>
        <p className="text-muted-foreground">Analisis Sentimen Google Maps Jabodetabek (Real ABSA Output)</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Physical Aspects Overview (Positive Sentiment %)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.mapsAspectData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="aspect" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Positive Sentiment" dataKey="positive" stroke="#8b0000" fill="#8b0000" fillOpacity={0.6} />
                  <RechartsTooltip formatter={(v) => [`${v}%`, 'Positive']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Store Performance Ranking (Top & Bottom)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={combinedPerformance}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="store" type="category" width={180} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{ fill: 'transparent' }} formatter={(v) => [`${v}%`, 'Positive Sentiment Score']} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {combinedPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.type === 'Top 5' ? 'var(--color-positive, #16a34a)' : 'var(--color-negative, #dc2626)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Google Maps Reviews (Jabodetabek Outlets)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[500px] overflow-y-auto pr-2 border rounded-md">
            <Table>
              <TableHeader className="bg-muted/40 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[180px]">Outlet Name</TableHead>
                  <TableHead className="w-[100px]">Rating</TableHead>
                  <TableHead>Review Text</TableHead>
                  <TableHead className="text-right w-[100px]">Sentiment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.reviewsTable.map((review, idx) => (
                  <TableRow key={review.id || idx} className="hover:bg-accent/5">
                    <TableCell className="font-semibold text-xs text-primary max-w-[180px] truncate">{review.nama_gerai || 'Kopi Kenangan'}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-muted/40'}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm max-w-lg truncate hover:text-clip hover:whitespace-normal py-3">
                      &quot;{review.review_text}&quot;
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={
                        review.sentiment_class === 'Positive' ? 'bg-green-600 hover:bg-green-700 text-white text-[10px]' :
                        review.sentiment_class === 'Negative' ? 'bg-red-600 hover:bg-red-700 text-white text-[10px]' :
                        'bg-gray-500 hover:bg-gray-600 text-white text-[10px]'
                      }>
                        {review.sentiment_class}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {data.reviewsTable.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                      Tidak ada ulasan Google Maps yang ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

