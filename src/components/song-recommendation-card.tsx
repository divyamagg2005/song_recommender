
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Youtube, Music, Disc3, Mic2 } from "lucide-react";

type SongRecommendationCardProps = {
  songTitle: string;
  songArtist: string;
  catchyLyric: string;
  reasoning: string;
};

export default function SongRecommendationCard({ songTitle, songArtist, catchyLyric, reasoning }: SongRecommendationCardProps) {
  
  const searchTerms = encodeURIComponent(`${songTitle}${songArtist ? ` ${songArtist}` : ''}`);

  const platformLinks = [
    { name: "Spotify", url: `https://open.spotify.com/search/${searchTerms}`, icon: Disc3, color: "text-green-500" },
    { name: "Apple Music", url: `https://music.apple.com/us/search?term=${searchTerms}`, icon: Music, color: "text-pink-500" },
    { name: "YouTube", url: `https://www.youtube.com/results?search_query=${searchTerms}`, icon: Youtube, color: "text-red-500" },
  ];

  return (
    <Card className="w-full shadow-xl rounded-xl bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader className="text-center pt-8 pb-4">
        <CardTitle className="text-3xl font-bold text-primary drop-shadow-md">{songTitle}</CardTitle>
        {songArtist && <CardDescription className="text-xl text-muted-foreground mt-1">{songArtist}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-8 px-6 py-6">
        {catchyLyric && (
          <div className="text-center border-2 border-dashed border-accent p-6 rounded-lg bg-accent/10 shadow-inner">
            <Mic2 className="h-8 w-8 mx-auto mb-3 text-accent" />
            <p className="text-2xl font-semibold text-accent-foreground italic">&ldquo;{catchyLyric}&rdquo;</p>
            <p className="text-sm text-muted-foreground mt-2 tracking-wide">(Perfect lyric for your story!)</p>
          </div>
        )}
        
        <div className="bg-background/50 p-6 rounded-lg shadow-md border border-border">
          <h3 className="font-semibold text-foreground mb-2 text-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-secondary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
            Why this song?
            </h3>
          <p className="text-muted-foreground text-lg italic leading-relaxed">&quot;{reasoning}&quot;</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-foreground mb-3 text-center text-xl">Listen on:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {platformLinks.map((platform) => (
              <Button key={platform.name} variant="outline" asChild className="justify-start text-left py-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-primary/30 hover:border-primary">
                <a href={platform.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
                  <platform.icon className={`h-7 w-7 ${platform.color}`} />
                  <span className="text-lg font-medium">{platform.name}</span>
                </a>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6">
        <AdPlaceholder type="in-feed" className="w-full h-28 mt-4 rounded-lg" hint="advertisement music platforms" />
      </CardFooter>
    </Card>
  );
}
