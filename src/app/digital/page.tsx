"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appAspectData, recentReviews } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DigitalAppPage() {
  const appReviews = recentReviews.filter(r => r.source === 'Play Store');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Digital App Analytics</h1>
        <p className="text-muted-foreground">Analisis Sentimen Google Play Store</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment by Technical Aspect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={appAspectData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="aspect" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                <Legend />
                <Bar dataKey="positive" name="Positive (%)" stackId="a" fill="var(--color-positive, #16a34a)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="neutral" name="Neutral (%)" stackId="a" fill="var(--color-neutral, #9ca3af)" />
                <Bar dataKey="negative" name="Negative (%)" stackId="a" fill="var(--color-negative, #dc2626)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Play Store Reviews</CardTitle>
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
              {appReviews.map((review) => (
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
              {appReviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                    No app reviews found.
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
