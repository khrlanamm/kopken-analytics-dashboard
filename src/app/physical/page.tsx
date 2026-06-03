"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mapsAspectData, storePerformance, recentReviews } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function PhysicalStorePage() {
  const mapsReviews = recentReviews.filter(r => r.source === 'Google Maps');

  const combinedPerformance = [
    ...storePerformance.top.map(store => ({ ...store, type: 'Top 5' })),
    ...storePerformance.bottom.map(store => ({ ...store, type: 'Bottom 5' })),
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Physical Store Analytics</h1>
        <p className="text-muted-foreground">Analisis Sentimen Google Maps Jabodetabek</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Physical Aspects Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mapsAspectData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="aspect" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Positive Sentiment" dataKey="positive" stroke="#8b0000" fill="#8b0000" fillOpacity={0.6} />
                  <RechartsTooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Performance Ranking (Top & Bottom)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={combinedPerformance}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="store" type="category" width={150} tick={{ fontSize: 12 }} />
                  <RechartsTooltip cursor={{ fill: 'transparent' }} />
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

      <Card>
        <CardHeader>
          <CardTitle>Google Maps Reviews (Jabodetabek)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead className="text-right">Sentiment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mapsReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium whitespace-nowrap">{review.date}</TableCell>
                  <TableCell>{review.rating} / 5</TableCell>
                  <TableCell className="max-w-md">{review.review_text}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={
                      review.sentiment_class === 'Positive' ? 'bg-green-600 hover:bg-green-700 text-white' :
                      review.sentiment_class === 'Negative' ? 'bg-red-600 hover:bg-red-700 text-white' :
                      'bg-gray-500 hover:bg-gray-600 text-white'
                    }>
                      {review.sentiment_class}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {mapsReviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                    No maps reviews found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
