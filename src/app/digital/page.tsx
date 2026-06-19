"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Star } from 'lucide-react';

interface AspectData {
  aspect: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface AppReview {
  id: string;
  source: string;
  date: string;
  rating: number;
  sentiment_class: 'Positive' | 'Neutral' | 'Negative';
  review_text: string;
}

interface DigitalPageData {
  appAspectData: AspectData[];
  reviewsTable: AppReview[];
}

function DigitalSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-muted rounded"></div>
        <div className="h-4 w-48 bg-muted rounded mt-2"></div>
      </div>
      <Card>
        <CardHeader>
          <div className="h-5 w-64 bg-muted rounded"></div>
        </CardHeader>
        <CardContent className="h-[400px] bg-muted/20 rounded m-6"></CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="h-5 w-48 bg-muted rounded"></div>
        </CardHeader>
        <CardContent className="h-[300px] bg-muted/20 rounded m-6"></CardContent>
      </Card>
    </div>
  );
}

export default function DigitalAppPage() {
  const [data, setData] = useState<DigitalPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dashboard/digital.json');
      if (!response.ok) {
        throw new Error(`Gagal mengambil data dari server (${response.status})`);
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data aplikasi digital.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <DigitalSkeleton />;
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Digital App Analytics</h1>
        <p className="text-muted-foreground">Analisis Sentimen Google Play Store (Real ABSA Output)</p>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sentiment by Technical & Operational Aspect</CardTitle>
          <Badge variant="outline" className="border-green-600/30 text-green-700 bg-green-50">ABSA Model</Badge>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.appAspectData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="aspect" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} formatter={(v) => [`${v}%`, '']} />
                <Legend />
                <Bar dataKey="positive" name="Positive (%)" stackId="a" fill="var(--color-positive, #16a34a)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="neutral" name="Neutral (%)" stackId="a" fill="var(--color-neutral, #9ca3af)" />
                <Bar dataKey="negative" name="Negative (%)" stackId="a" fill="var(--color-negative, #dc2626)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Play Store Reviews List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[500px] overflow-y-auto pr-2 border rounded-md">
            <Table>
              <TableHeader className="bg-muted/40 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[100px]">Rating</TableHead>
                  <TableHead>Review Text</TableHead>
                  <TableHead className="text-right w-[100px]">Sentiment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.reviewsTable.map((review) => (
                  <TableRow key={review.id} className="hover:bg-accent/5">
                    <TableCell className="font-medium whitespace-nowrap text-xs text-muted-foreground">{review.date}</TableCell>
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
                      Tidak ada ulasan aplikasi yang ditemukan.
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

