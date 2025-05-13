"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { analyzeImageDescription, type AnalyzeImageDescriptionOutput } from "@/ai/flows/analyze-image-description";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Wand2 } from "lucide-react";

const songTypeOptions = [
  { value: "latest hits", label: "Latest Hits" },
  { value: "timeless classics", label: "Timeless Classics" },
  { value: "upbeat pop", label: "Upbeat Pop" },
  { value: "chill vibes", label: "Chill Vibes" },
  { value: "energetic rock", label: "Energetic Rock" },
  { value: "hip-hop beats", label: "Hip-Hop Beats" },
  { value: "electronic dance", label: "Electronic/Dance" },
  { value: "folk acoustic", label: "Folk/Acoustic" },
  { value: "moody indie", label: "Moody Indie" },
  { value: "cinematic score", label: "Cinematic Score" },
];

const formSchema = z.object({
  imageDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, { message: "Description must be at most 500 characters."}),
  songType: z.string().min(1, { message: "Please select a song type." }),
  imageFile: z.custom<FileList>().optional(),
});

type SongInputFormProps = {
  onRecommendation: (data: AnalyzeImageDescriptionOutput | null, loading: boolean, error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
};

export default function SongInputForm({ onRecommendation, setIsLoading }: SongInputFormProps) {
  const { toast } = useToast();
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageDescription: "",
      songType: "",
    },
  });

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "Image too large",
          description: "Please upload an image smaller than 5MB.",
        });
        form.setValue("imageFile", undefined);
        setImagePreview(null);
        setImageDataUri(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setImageDataUri(null);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onRecommendation(null, true, null);
    try {
      const input = {
        imageDescription: values.imageDescription,
        songType: values.songType,
        ...(imageDataUri && { imageDataUri }),
      };
      const result = await analyzeImageDescription(input);
      onRecommendation(result, false, null);
    } catch (error) {
      console.error("Error generating recommendation:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      onRecommendation(null, false, errorMessage);
      toast({
        variant: "destructive",
        title: "Recommendation Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-primary">Describe Your Scene</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="imageDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., A sunny beach with friends laughing, a quiet rainy day by the window, a vibrant cityscape at night..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The more detail, the better the recommendation!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="songType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Song Vibe</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a song vibe or genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {songTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image (Optional)</FormLabel>
                  <FormControl>
                     <Input 
                        type="file" 
                        accept="image/png, image/jpeg, image/gif, image/webp"
                        onChange={(e) => {
                            field.onChange(e.target.files);
                            handleImageChange(e);
                        }}
                     />
                  </FormControl>
                  <FormDescription>
                    Show us the vibe! Max 5MB. (JPG, PNG, GIF, WEBP)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {imagePreview && (
              <div className="mt-4 border border-muted p-2 rounded-md  flex justify-center">
                <Image
                  src={imagePreview}
                  alt="Image preview"
                  width={200}
                  height={200}
                  className="rounded-md object-contain max-h-[200px]"
                />
              </div>
            )}

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
              <Wand2 className="mr-2 h-5 w-5" />
              Get Song Recommendation
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
