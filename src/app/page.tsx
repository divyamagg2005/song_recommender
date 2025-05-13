'use client';

import { useState, useEffect } from 'react';
import SongInputForm from '@/components/song-input-form';
import SongRecommendationCard from '@/components/song-recommendation-card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { AnalyzeImageDescriptionOutput } from '@/ai/flows/analyze-image-description';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Music } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardContent } from "@/components/ui/card";


export default function HomePage() {
  const [recommendation, setRecommendation] = useState<AnalyzeImageDescriptionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientLoaded, setClientLoaded] = useState(false);

  useEffect(() => {
    setClientLoaded(true);
  }, []);

  const handleRecommendation = (data: AnalyzeImageDescriptionOutput | null, loading: boolean, err: string | null) => {
    setRecommendation(data);
    setIsLoading(loading);
    setError(err);
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6 p-4 bg-card rounded-lg shadow-lg">
      <div className="text-center">
        <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-20 w-full mt-4" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-10">
          <section aria-labelledby="input-section-title" className="text-center">
            <Music size={48} className="mx-auto text-primary mb-4" />
            <h1 id="input-section-title" className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
              StoryMuse
            </h1>
            <p className="mt-3 text-lg text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Unearth the perfect melody for your visual tales. Describe your image, pick your vibe, and let AI compose your soundtrack.
            </p>
          </section>

          <section className="w-full">
            {clientLoaded ? (
              <SongInputForm onRecommendation={handleRecommendation} setIsLoading={setIsLoading} />
            ) : (
              <Card className="w-full shadow-xl">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mx-auto" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full bg-accent/50" />
                </CardContent>
              </Card>
            )}
          </section>

          {isLoading && (
             <section aria-live="polite" className="w-full">
                <h2 className="text-2xl font-semibold text-primary mb-4 text-center sr-only">Loading Recommendation</h2>
                <LoadingSkeleton />
             </section>
          )}

          {error && !isLoading && (
             <section aria-live="assertive" className="w-full">
                <Alert variant="destructive" className="shadow-lg">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>Oops! Something went wrong.</AlertTitle>
                  <AlertDescription>
                    We couldn't generate a recommendation: {error}. Please try again.
                  </AlertDescription>
                </Alert>
             </section>
          )}

          {recommendation && !isLoading && !error && (
            <section aria-labelledby="recommendation-section-title" className="w-full">
              <h2 id="recommendation-section-title" className="text-3xl font-bold text-primary mb-6 text-center">
                Your Sonic Match!
              </h2>
              <SongRecommendationCard
                songRecommendation={recommendation.songRecommendation}
                reasoning={recommendation.reasoning}
              />
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
