import { cn } from "@/lib/utils";
import Image from "next/image";

type AdPlaceholderProps = {
  type: "banner" | "square" | "in-feed";
  className?: string;
  hint?: string;
};

export default function AdPlaceholder({ type, className, hint = "advertisement" }: AdPlaceholderProps) {
  let dimensions = "h-60 w-full"; // Default for banner
  if (type === "square") dimensions = "h-60 w-60";
  if (type === "in-feed") dimensions = "h-24 w-full";

  return (
    <div
      className={cn(
        "border-2 border-dashed border-muted-foreground/50 bg-muted/30 flex flex-col items-center justify-center text-muted-foreground p-4 rounded-md shadow-inner",
        dimensions,
        className
      )}
      aria-label="Advertisement placeholder"
    >
      <Image 
        src={`https://picsum.photos/${type === 'square' ? '250/250' : '728/90'}?random=${Math.random()}`} // Use random to avoid caching same image
        alt="Ad placeholder image"
        width={type === 'square' ? 250 : (type === 'banner' ? 728 : 300)}
        height={type === 'square' ? 250 : (type === 'banner' ? 90 : 100)}
        className="opacity-50 object-cover rounded"
        data-ai-hint={hint}
      />
      <p className="text-sm mt-2 font-semibold">Advertisement</p>
      <p className="text-xs">{hint}</p>
    </div>
  );
}
