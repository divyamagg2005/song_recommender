import AdPlaceholder from '@/components/AdPlaceholder';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<string>("...."); // Default to a placeholder

  useEffect(() => {
    // Set the current year only on the client-side after hydration
    setCurrentYear(new Date().getFullYear().toString());
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <footer className="bg-card shadow-t-md mt-auto">
      <AdPlaceholder type="banner" className="w-full h-24 md:h-16" hint="advertisement banner footer" />
      <div className="container mx-auto px-4 py-4 text-center text-muted-foreground">
        <p>&copy; {currentYear} StoryMuse. All rights reserved.</p>
        <p className="text-xs mt-1">Crafting perfect soundtracks for your stories.</p>
      </div>
    </footer>
  );
}
