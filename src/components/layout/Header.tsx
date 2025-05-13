
import Link from 'next/link';
import { Music2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
          <Music2 size={28} />
          StoryMuse
        </Link>
        <div className="mt-2 sm:mt-0">
          {/* Placeholder for potential navigation or user actions */}
        </div>
      </div>
      {/* AdPlaceholder removed from here */}
    </header>
  );
}
