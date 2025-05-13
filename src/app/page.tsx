
'use client';

import { useState, useEffect } from 'react';
import StorySoundtrackForm from '@/components/story-soundtrack-form';
import SongRecommendationCard from '@/components/song-recommendation-card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { GenerateStorySoundtrackOutput } from '@/ai/flows/generate-story-soundtrack';
import { getTopTracks, type GetTopTracksOutput, type Track } from '@/ai/flows/get-top-tracks';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Music, ListMusic, Info, WifiOff, ServerCrash, Music2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import AdPlaceholder from '@/components/AdPlaceholder';


export default function HomePage() {
  const [recommendation, setRecommendation] = useState<GenerateStorySoundtrackOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientLoaded, setClientLoaded] = useState(false);

  const [topTracks, setTopTracks] = useState<Track[] | null>(null);
  const [isTopTracksLoading, setIsTopTracksLoading] = useState(true);
  const [topTracksError, setTopTracksError] = useState<string | null>(null);

  useEffect(() => {
    setClientLoaded(true);

    const fetchTopTracks = async () => {
      setIsTopTracksLoading(true);
      setTopTracksError(null);
      try {
        const result = await getTopTracks({ platform: "Instagram", timePeriod: "this month till date", count: 3 });
        setTopTracks(result.tracks);
      } catch (err) {
        console.error("Error fetching top tracks:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while fetching top tracks.";
        setTopTracksError(errorMessage);
        setTopTracks(null);
      } finally {
        setIsTopTracksLoading(false);
      }
    };

    fetchTopTracks();
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
  
  const TopTracksSection = () => (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
          <ListMusic className="text-accent" /> Top Tracks This Month
        </CardTitle>
        <CardDescription>Popular on Instagram for this month till date.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isTopTracksLoading && [1, 2, 3].map(i => (
          <div key={i} className="flex items-center space-x-3 p-3 border-b border-border last:border-b-0 rounded-md bg-muted/20 hover:bg-muted/40 transition-colors">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
        {!isTopTracksLoading && topTracksError && (
           <Alert variant="destructive" className="shadow-md">
            <ServerCrash className="h-5 w-5" />
            <AlertTitle>Error Fetching Top Tracks</AlertTitle>
            <AlertDescription>
              Could not load top tracks: {topTracksError}. Please check your connection or try again later.
            </AlertDescription>
          </Alert>
        )}
        {!isTopTracksLoading && !topTracksError && topTracks && topTracks.length > 0 && (
          topTracks.map((track, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 border-b border-border last:border-b-0 rounded-md bg-card hover:bg-muted/30 transition-colors duration-200 ease-in-out shadow-sm hover:shadow-md">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Music2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg text-foreground truncate">{track.title}</p>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>
               <Button variant="ghost" size="sm" className="text-accent hover:text-accent-foreground hover:bg-accent/20" onClick={() => window.open(`https://open.spotify.com/search/${encodeURIComponent(track.title + " " + track.artist)}`, "_blank")}>
                Listen
              </Button>
            </div>
          ))
        )}
        {!isTopTracksLoading && !topTracksError && (!topTracks || topTracks.length === 0) && (
            <Alert variant="default" className="mt-4 border-primary/30 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">No Tracks Found</AlertTitle>
            <AlertDescription className="text-primary/80">
                We couldn&apos;t find any top tracks at the moment. Please check back later.
            </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Ad Column */}
          <aside className="hidden lg:block lg:col-span-2 xl:col-span-3 order-1 lg:order-none">
            <AdPlaceholder type="square" className="sticky top-8 w-full max-w-[250px] mx-auto lg:mx-0" hint="advertisement side left" />
          </aside>

          {/* Center Content Column */}
          <div className="lg:col-span-8 xl:col-span-6 w-full max-w-3xl mx-auto lg:mx-0 space-y-12 order-2 lg:order-none">
            <section aria-labelledby="main-title" className="text-center">
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                 <Music size={48} className="mx-auto text-primary" />
              </div>
              <h1 id="main-title" className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl xl:text-6xl">
                Story Soundtrack
              </h1>
              <p className="mt-4 text-xl text-muted-foreground sm:mt-5 sm:text-2xl lg:text-xl xl:text-2xl max-w-2xl mx-auto">
                Find Your Perfect Instagram Story Soundtrack Every Day!
              </p>
              <p className="mt-6 text-md text-foreground/90 max-w-xl mx-auto leading-relaxed">
                Looking for the perfect song to accompany your Instagram story? Whether you&apos;re feeling happy, adventurous, or nostalgic, we recommend the perfect tracks that align with your vibe. Simply choose a mood, and we&apos;ll provide you with a song suggestion along with a catchy lyric that perfectly matches your photo or video!
              </p>
            </section>

            <section aria-labelledby="top-tracks-title">
              <TopTracksSection />
              <p className="text-center text-muted-foreground mt-6 text-sm">
                Your personalized recommendations will appear below after submitting the form.
              </p>
            </section>
            
            <hr className="border-border" />

            <section aria-labelledby="form-section-title" className="w-full">
              <h2 id="form-section-title" className="text-3xl font-bold text-primary mb-8 text-center">
                Let&apos;s find your perfect song
              </h2>
              {clientLoaded ? (
                <StorySoundtrackForm onRecommendation={handleRecommendation} setIsLoading={setIsLoading} />
              ) : (
                <Card className="w-full shadow-xl">
                  <CardHeader className="p-6">
                    <CardTitle className="text-center text-2xl text-primary flex items-center justify-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" /> 🎵 Find Your Perfect Story Song
                    </CardTitle>
                     <CardDescription className="text-center text-muted-foreground pt-1">
                      Loading form...
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
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
                <h2 id="recommendation-section-title" className="text-3xl font-bold text-primary mb-8 text-center">
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
          <aside className="hidden lg:block lg:col-span-2 xl:col-span-3 order-3 lg:order-none">
            <AdPlaceholder type="square" className="sticky top-8 w-full max-w-[250px] mx-auto lg:mx-0" hint="advertisement side right" />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
