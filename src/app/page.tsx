
'use client';

import { useState, useEffect } from 'react';
import StorySoundtrackForm from '@/components/story-soundtrack-form';
import SongRecommendationCard from '@/components/song-recommendation-card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { GenerateStorySoundtrackOutput } from '@/ai/flows/generate-story-soundtrack';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Music, ListMusic, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import AdPlaceholder from '@/components/AdPlaceholder';


export default function HomePage() {
  const [recommendation, setRecommendation] = useState<GenerateStorySoundtrackOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientLoaded, setClientLoaded] = useState(false);

  useEffect(() => {
    setClientLoaded(true);
  }, []);

  const handleRecommendation = (data: GenerateStorySoundtrackOutput | null, loading: boolean, err: string | null) => {
    setRecommendation(data);
    setIsLoading(loading);
    setError(err);
  };

  const LoadingSkeleton = () => (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-10 w-full" />
         <Skeleton className="h-20 w-full mt-4" />
      </CardContent>
       <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
  
  const TopTracksPlaceholder = () => (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
          <ListMusic /> Top Tracks This Week
        </CardTitle>
        <CardDescription>This is a placeholder for future top track recommendations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center space-x-3 p-2 border-b border-border last:border-b-0">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
        <Alert variant="default" className="mt-4">
            <Info className="h-4 w-4" />
          <AlertTitle>Coming Soon!</AlertTitle>
          <AlertDescription>
            Personalized "Top Tracks" based on popular choices will appear here.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-x-8">
          {/* Left Ad Column */}
          <aside className="hidden lg:block w-[200px] xl:w-[250px] flex-shrink-0 order-1 lg:order-none">
            <AdPlaceholder type="square" className="sticky top-8 w-full" hint="advertisement side left" />
          </aside>

          {/* Center Content Column */}
          <div className="w-full max-w-2xl mx-auto lg:mx-0 flex-grow space-y-12 order-2 lg:order-none">
            <section aria-labelledby="main-title" className="text-center">
              <Music size={48} className="mx-auto text-primary mb-4" />
              <h1 id="main-title" className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                Story Soundtrack
              </h1>
              <p className="mt-3 text-xl text-muted-foreground sm:mt-5 sm:text-2xl lg:text-xl xl:text-2xl">
                Find Your Perfect Instagram Story Soundtrack Every Day!
              </p>
              <p className="mt-6 text-md text-foreground max-w-xl mx-auto">
                Looking for the perfect song to accompany your Instagram story? Whether you&apos;re feeling happy, adventurous, or nostalgic, we recommend the perfect tracks that align with your vibe. Simply choose a mood, and we&apos;ll provide you with a song suggestion along with a catchy lyric that perfectly matches your photo or video!
              </p>
            </section>

            <section aria-labelledby="top-tracks-title">
              <TopTracksPlaceholder />
              <p className="text-center text-muted-foreground mt-4">
                Your personalized recommendations will appear below after submitting the form.
              </p>
            </section>
            
            <hr className="border-border" />

            <section aria-labelledby="form-section-title" className="w-full">
              <h2 id="form-section-title" className="text-3xl font-bold text-primary mb-6 text-center">
                Let&apos;s get to know what kind of song you are looking for
              </h2>
              {clientLoaded ? (
                <StorySoundtrackForm onRecommendation={handleRecommendation} setIsLoading={setIsLoading} />
              ) : (
                <Card className="w-full shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl text-primary flex items-center justify-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" /> 🎵 Find Your Perfect Story Song
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-12 w-full bg-accent/50" />
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
                      We couldn&apos;t generate a recommendation: {error}. Please try again or simplify your request.
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
                  songTitle={recommendation.songTitle}
                  songArtist={recommendation.songArtist}
                  catchyLyric={recommendation.catchyLyric}
                  reasoning={recommendation.reasoning}
                />
              </section>
            )}
          </div>

          {/* Right Ad Column */}
          <aside className="hidden lg:block w-[200px] xl:w-[250px] flex-shrink-0 order-3 lg:order-none">
            <AdPlaceholder type="square" className="sticky top-8 w-full" hint="advertisement side right" />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
