
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, type ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { generateStorySoundtrack, type GenerateStorySoundtrackOutput } from "@/ai/flows/generate-story-soundtrack";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Camera, Smile, Languages, Send, CalendarClock } from 'lucide-react';

const pictureTypeOptions = [
  "Selfie", "Group Photo", "Landscape", "Cityscape", "Food", "Pet", "Fashion", "Travel", "Event/Party", "Artistic/Abstract", "Meme/Funny", "Product", "Behind the Scenes", "Other"
];
const moodOptions = [
  "Happy/Joyful", "Excited/Energetic", "Chill/Relaxed", "Nostalgic/Sentimental", "Adventurous/Exploring", "Romantic/Loving", "Focused/Productive", "Party/Celebratory", "Peaceful/Serene", "Funny/Playful", "Mysterious/Intriguing", "Powerful/Confident", "Dreamy/Ethereal", "Other"
];
const platformOptions = [
  "Instagram Story", "Instagram Reel", "TikTok", "YouTube Short", "Snapchat Story", "Facebook Story", "Other"
];
const recencyOptions = [
  "Latest Hits (Trending Now)", "Recent (Last Few Months)", "Modern (Last 1-2 Years)", "Throwbacks (5-10 Years Old)", "Classics (10+ Years Old)", "Any Era"
];


const formSchema = z.object({
  imageFile: z.custom<FileList>().optional(),
  pictureType: z.string().min(1, { message: "Please select a picture type." }),
  pictureDescription: z.string().max(300, { message: "Description must be at most 300 characters." }).optional(),
  mood: z.string().min(1, { message: "Please select a mood." }),
  moodDescription: z.string().max(300, { message: "Description must be at most 300 characters." }).optional(),
  preferredLanguage: z.enum(["Any", "English", "Specify"], { required_error: "Please select a language preference."}),
  otherLanguage: z.string().max(50, { message: "Language must be at most 50 characters." }).optional(),
  postingPlatform: z.string().min(1, { message: "Please select a posting platform." }),
  songRecency: z.string().min(1, { message: "Please select song recency." }),
}).refine(data => {
  if (data.preferredLanguage === "Specify" && (!data.otherLanguage || data.otherLanguage.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Please specify the language if 'Specify' is selected.",
  path: ["otherLanguage"],
});

type StorySoundtrackFormProps = {
  onRecommendation: (data: GenerateStorySoundtrackOutput | null, loading: boolean, error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
};

export default function StorySoundtrackForm({ onRecommendation, setIsLoading }: StorySoundtrackFormProps) {
  const { toast } = useToast();
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pictureType: "",
      pictureDescription: "",
      mood: "",
      moodDescription: "",
      preferredLanguage: "Any",
      otherLanguage: "",
      postingPlatform: "Instagram Story",
      songRecency: "",
    },
  });

  const preferredLanguageValue = form.watch("preferredLanguage");

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
        ...values,
        imageDataUri: imageDataUri,
      };
      // console.log("Submitting to AI:", input);
      const result = await generateStorySoundtrack(input);
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
        <CardTitle className="text-center text-2xl text-primary flex items-center justify-center gap-2">
          <Wand2 /> 🎵 Find Your Perfect Story Song
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div>
              <FormLabel className="text-lg font-semibold flex items-center gap-2 mb-2"><Camera /> 🖼️ Use actual image analysis for better recommendations (Optional)</FormLabel>
              <FormField
                control={form.control}
                name="imageFile"
                render={({ field }) => (
                  <FormItem>
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
                      Max 5MB. (JPG, PNG, GIF, WEBP)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {imagePreview && (
                <div className="mt-4 border border-muted p-2 rounded-md flex justify-center">
                  <Image
                    src={imagePreview}
                    alt="Image preview"
                    width={200}
                    height={200}
                    className="rounded-md object-contain max-h-[200px]"
                  />
                </div>
              )}
            </div>

            <div>
              <FormLabel className="text-lg font-semibold flex items-center gap-2 mb-2">📸 What's in your picture?</FormLabel>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="pictureType"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="-- Select a picture type --" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pictureTypeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
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
                  name="pictureDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="📝 Describe your picture (optional) e.g., Sunset with palm trees, vintage tone..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div>
              <FormLabel className="text-lg font-semibold flex items-center gap-2 mb-2"><Smile /> 🎭 What's the mood or vibe?</FormLabel>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="-- Select a mood --" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {moodOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
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
                  name="moodDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="📝 Describe your mood (optional) e.g., Feeling grateful, chill Sunday vibes..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <FormLabel className="text-lg font-semibold flex items-center gap-2 mb-2"><Languages /> 🌍 Preferred language of the song?</FormLabel>
              <FormField
                control={form.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Any" />
                          </FormControl>
                          <FormLabel className="font-normal">Any</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="English" />
                          </FormControl>
                          <FormLabel className="font-normal">English</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Specify" />
                          </FormControl>
                          <FormLabel className="font-normal">Specify</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {preferredLanguageValue === "Specify" && (
                <FormField
                  control={form.control}
                  name="otherLanguage"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <Input placeholder="📝 Other language (if any) e.g., Spanish, Malayalam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div>
              <FormLabel className="text-lg font-semibold flex items-center gap-2 mb-2"><Send /> 📱 Where are you posting this story?</FormLabel>
              <FormField
                control={form.control}
                name="postingPlatform"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="-- Select a platform --" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {platformOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="text-lg font-semibold flex items-center gap-2 mb-2"><CalendarClock /> ⏳ How recent should the song be?</FormLabel>
              <FormField
                control={form.control}
                name="songRecency"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="-- Choose one --" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {recencyOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6" disabled={form.formState.isSubmitting}>
              <Wand2 className="mr-2 h-5 w-5" />
              🔍 Get My Song & Lyric
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```