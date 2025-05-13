import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

type AdPlaceholderProps = {
  type: "banner" | "square" | "in-feed";
  className?: string;
  hint?: string;
};

export default function AdPlaceholder({ type, className, hint = "advertisement" }: AdPlaceholderProps) {
  let dimensions = "h-60 w-full"; // Default for banner
  if (type === "square") dimensions = "h-60 w-60";
  if (type === "in-feed") dimensions = "h-24 w-full";

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Determine image dimensions based on type
  const imageWidth = type === 'square' ? 250 : (type === 'banner' ? 728 : 300);
  const imageHeight = type === 'square' ? 250 : (type === 'banner' ? 90 : 100);

  useEffect(() => {
    // Generate the random part of the URL only on the client side
    // This ensures that server-rendered HTML and client-rendered HTML match initially
    const randomParam = Math.random();
    setImageUrl(`https://picsum.photos/${imageWidth}/${imageHeight}?random=${randomParam}`);
  }, [type, imageWidth, imageHeight]); // Depend on type and derived dimensions

  return (
    <div
      className={cn(
        "border-2 border-dashed border-muted-foreground/50 bg-muted/30 flex flex-col items-center justify-center text-muted-foreground p-4 rounded-md shadow-inner",
        dimensions,
        className
      )}
      aria-label="Advertisement placeholder"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Ad placeholder image"
          width={imageWidth}
          height={imageHeight}
          className="opacity-50 object-cover rounded"
          data-ai-hint={hint}
          key={imageUrl} // Add key to help React differentiate if src changes
        />
      ) : (
        // Placeholder for the image while imageUrl is being generated on the client
        <div
          className="opacity-50 object-cover rounded bg-muted/20 animate-pulse"
          style={{
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
          }}
          data-ai-hint={hint}
          aria-label="Loading advertisement image"
        />
      )}
      <p className="text-sm mt-2 font-semibold">Advertisement</p>
      <p className="text-xs">{hint}</p>
    </div>
  );
}
