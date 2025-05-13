
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdPlaceholder from "@/components/AdPlaceholder";
import { Youtube, Music, Disc3 } from "lucide-react"; // Music for Apple Music, Disc3 as generic for Spotify

type SongRecommendationCardProps = {
  songRecommendation: string;
  reasoning: string;
};

export default function SongRecommendationCard({ songRecommendation, reasoning }: SongRecommendationCardProps) {
  const [songTitle, songArtist] = songRecommendation.includes(" - ") 
    ? songRecommendation.split(" - ") 
    : songRecommendation.includes(" by ")
    ? songRecommendation.split(" by ")
    : [songRecommendation, ""];

  const searchTerms = encodeURIComponent(`${songTitle}${songArtist ? ` ${songArtist}` : ''}`);

  const platformLinks = [
    { name: "Spotify", url: `https://open.spotify.com/search/${searchTerms}`, icon: Disc3, color: "text-green-500" },
    { name: "Apple Music", url: `https://music.apple.com/us/search?term=${searchTerms}`, icon: Music, color: "text-pink-500" },
    { name: "YouTube", url: `https://www.youtube.com/results?search_query=${searchTerms}`, icon: Youtube, color: "text-red-500" },
  ];

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-primary">{songTitle}</CardTitle>
        {songArtist && <CardDescription className="text-lg text-muted-foreground">{songArtist}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-foreground mb-1">Why this song?</h3>
          <p className="text-muted-foreground italic">"{reasoning}"</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-foreground mb-2 text-center">Listen on:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {platformLinks.map((platform) => (
              <Button key={platform.name} variant="outline" asChild className="justify-start text-left">
                <a href={platform.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <platform.icon className={`h-5 w-5 ${platform.color}`} />
                  <span>{platform.name}</span>
                </a>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <AdPlaceholder type="in-feed" className="w-full h-20 mt-4" hint="advertisement song card" />
      </CardFooter>
    </Card>
  );
}

