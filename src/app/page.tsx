"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { kpiData, trendData, recentReviews } from "@/lib/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Star, Smartphone, Store, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Analisis Sentimen Keseluruhan: Aplikasi & Gerai Fisik</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalReviews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Target: &gt; 6,000 ulasan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">App Rating</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.appRating} <span className="text-muted-foreground text-lg">/ 5.0</span></div>
            <p className="text-xs text-muted-foreground">Google Play Store</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maps Rating</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.mapsRating} <span className="text-muted-foreground text-lg">/ 5.0</span></div>
            <p className="text-xs text-muted-foreground">Google Maps (Jabodetabek)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
            <Star className="h-4 w-4 text-positive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((kpiData.sentimentDistribution[0].value / kpiData.totalReviews) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Dari total ulasan</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Sentiment Trend (2023 - 2025)</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b0000" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b0000" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMaps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="app_sentiment" name="App Sentiment Score" stroke="#8b0000" fillOpacity={1} fill="url(#colorApp)" />
                <Area type="monotone" dataKey="maps_sentiment" name="Maps Sentiment Score" stroke="#2563eb" fillOpacity={1} fill="url(#colorMaps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews.slice(0, 5).map((review) => (
                <div key={review.id} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{review.source}</span>
                        <Badge variant="outline">{review.date}</Badge>
                      </div>
                      <Badge className={
                        review.sentiment_class === 'Positive' ? 'bg-green-600 hover:bg-green-700' :
                        review.sentiment_class === 'Negative' ? 'bg-red-600 hover:bg-red-700' :
                        'bg-gray-500 hover:bg-gray-600'
                      }>
                        {review.sentiment_class}
                      </Badge>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-muted'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">&quot;{review.review_text}&quot;</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kpiData.sentimentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {kpiData.sentimentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-600"></div> Positive</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-400"></div> Neutral</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-600"></div> Negative</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
