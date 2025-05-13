
'use client';

import { useState, useEffect } from 'react';
import StorySoundtrackForm from '@/components/story-soundtrack-form';
import SongRecommendationCard from '@/components/song-recommendation-card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { GenerateStorySoundtrackOutput } from '@/ai/flows/generate-story-soundtrack';
import { getTopTracks, type GetTopTracksOutput, type Track } from '@/ai/flows/get-top-tracks';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Music, ListMusic, Info, ServerCrash, Music2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import AdPlaceholder from '@/components/AdPlaceholder';
import { Button } from '@/components/ui/button';


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
    <Card className="w-full shadow-lg rounded-xl">
      <CardHeader className="text-center p-6">
        <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-10 w-full" />
         <Skeleton className="h-20 w-full mt-4" />
      </CardContent>
       <CardFooter className="p-6">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
  
  const TopTracksSection = () => (
    <Card className="w-full shadow-xl rounded-xl border border-primary/20 bg-card/90 backdrop-blur-md">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-3">
          <ListMusic className="text-accent h-7 w-7" /> Top Tracks This Month
        </CardTitle>
        <CardDescription className="text-md text-muted-foreground pt-1">Popular on Instagram for this month till date.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {isTopTracksLoading && [1, 2, 3].map(i => (
          <div key={i} className="flex items-center space-x-4 p-4 border-b border-border last:border-b-0 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors shadow-sm">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        ))}
        {!isTopTracksLoading && topTracksError && (
           <Alert variant="destructive" className="shadow-md rounded-lg">
            <ServerCrash className="h-5 w-5" />
            <AlertTitle>Error Fetching Top Tracks</AlertTitle>
            <AlertDescription>
              Could not load top tracks: {topTracksError}. Please check your connection or try again later.
            </AlertDescription>
          </Alert>
        )}
        {!isTopTracksLoading && !topTracksError && topTracks && topTracks.length > 0 && (
          topTracks.map((track, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border-b border-border last:border-b-0 rounded-lg bg-card hover:bg-muted/30 transition-colors duration-200 ease-in-out shadow-sm hover:shadow-md">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Music2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0"> {/* Added min-w-0 for truncation to work */}
                <p className="font-semibold text-lg text-foreground truncate">{track.title}</p>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>
               <Button variant="ghost" size="sm" className="text-accent hover:text-accent-foreground hover:bg-accent/20 rounded-md whitespace-nowrap" onClick={() => window.open(`https://open.spotify.com/search/${encodeURIComponent(track.title + " " + track.artist)}`, "_blank")}>
                Listen
              </Button>
            </div>
          ))
        )}
        {!isTopTracksLoading && !topTracksError && (!topTracks || topTracks.length === 0) && (
            <Alert variant="default" className="mt-4 border-primary/30 bg-primary/5 rounded-lg">
            <Info className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary font-semibold">No Tracks Found</AlertTitle>
            <AlertDescription className="text-primary/80">
                We couldn&apos;t find any top tracks at the moment. Please check back later.
            </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans antialiased">
      <Header />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
          
          <aside className="hidden lg:block lg:col-span-2 xl:col-span-3 order-1 lg:order-none sticky top-8 self-start max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
            <AdPlaceholder type="square" className="w-full max-w-[250px] mx-auto lg:mx-0 mb-6" hint="advertisement creative" />
             <AdPlaceholder type="square" className="w-full max-w-[250px] mx-auto lg:mx-0" hint="advertisement music" />
          </aside>

          <div className="lg:col-span-8 xl:col-span-6 w-full max-w-3xl mx-auto lg:mx-0 space-y-12 order-2 lg:order-none">
            <section aria-labelledby="main-title" className="text-center">
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4 shadow-md">
                 <Music size={48} className="mx-auto text-primary" />
              </div>
              <h1 id="main-title" className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl drop-shadow-sm">
                Story Soundtrack
              </h1>
              <p className="mt-4 text-xl text-muted-foreground sm:mt-5 sm:text-2xl lg:text-xl max-w-2xl mx-auto">
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
            
            <hr className="border-border my-12" />

            <section aria-labelledby="form-section-title" className="w-full">
              <h2 id="form-section-title" className="text-3xl font-bold text-primary mb-8 text-center">
                Let&apos;s find your perfect song
              </h2>
              {clientLoaded ? (
                <StorySoundtrackForm onRecommendation={handleRecommendation} setIsLoading={setIsLoading} />
              ) : (
                <Card className="w-full shadow-xl rounded-2xl">
                  <CardHeader className="p-6">
                    <CardTitle className="text-center text-3xl font-bold text-primary drop-shadow-lg flex items-center justify-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full bg-primary/30" /> 🎵 Find Your Perfect Story Song
                    </CardTitle>
                     <CardDescription className="text-center text-md text-muted-foreground pt-2">
                      Loading form... please wait a moment.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
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
                  <Alert variant="destructive" className="shadow-lg rounded-xl">
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

          <aside className="hidden lg:block lg:col-span-2 xl:col-span-3 order-3 lg:order-none sticky top-8 self-start max-h-[calc(100vh-4rem)] overflow-y-auto pl-2">
            <AdPlaceholder type="square" className="w-full max-w-[250px] mx-auto lg:mx-0 mb-6" hint="advertisement lifestyle" />
            <AdPlaceholder type="square" className="w-full max-w-[250px] mx-auto lg:mx-0" hint="advertisement travel" />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
