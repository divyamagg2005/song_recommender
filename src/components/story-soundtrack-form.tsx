
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Camera, Smile, Languages, Send, CalendarClock, UploadCloud, Palette, Filter, HelpCircle, Type, Globe, Clock } from 'lucide-react';

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
      // Ensure optional fields are not undefined, but rather null or empty string if not provided
      if (!input.pictureDescription) input.pictureDescription = "";
      if (!input.moodDescription) input.moodDescription = "";
      if (!input.otherLanguage) input.otherLanguage = "";

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
    <Card className="w-full shadow-xl rounded-2xl border border-primary/20 bg-card/90 backdrop-blur-md">
      <CardHeader className="p-6">
        <CardTitle className="text-center text-3xl font-bold text-primary drop-shadow-lg flex items-center justify-center gap-3">
          <Palette size={32} className="text-accent" />
          <span>Craft Your Vibe</span>
          <Wand2 size={32} className="text-accent" />
        </CardTitle>
        <CardDescription className="text-center text-md text-muted-foreground pt-2">
        Tell us about your moment, and we&apos;ll find the perfect song to match!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            
            <div className="px-6 py-8 rounded-lg border-2 border-dashed border-accent/50 bg-accent/10 shadow-inner min-h-[250px]">
              <FormLabel className="text-xl font-semibold flex items-center gap-3 mb-3 text-accent-foreground">
                <UploadCloud size={28} /> 🖼️ Visual Spark (Optional)
              </FormLabel>
              <FormDescription className="mb-4 text-sm text-accent-foreground/80">
                Use actual image analysis for better recommendations. Max 1MB (JPG, PNG, GIF, WEBP).
              </FormDescription>
              <FormField
                control={form.control}
                name="imageFile"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                       <Input 
                          type="file" 
                          accept="image/png, image/jpeg, image/gif, image/webp"
                          className="h-11 file:text-primary file:font-semibold file:bg-primary/10 hover:file:bg-primary/20 file:rounded-lg file:border-0 file:px-4 file:py-2 file:mr-4"
                          onChange={(e) => {
                              field.onChange(e.target.files);
                              handleImageChange(e);
                          }}
                       />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {imagePreview && (
                <div className="mt-6 border-2 border-primary/30 p-3 rounded-lg bg-background/50 flex justify-center items-center shadow-md">
                  <Image
                    src={imagePreview}
                    alt="Selected image preview"
                    width={250}
                    height={250}
                    className="rounded-md object-contain max-h-[250px] shadow-lg"
                  />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <FormLabel className="text-xl font-semibold flex items-center gap-3 text-primary">
                <Camera size={28} /> 📸 What&apos;s in your picture?
                </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="pictureType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-md font-medium text-foreground/90"><Type size={20}/>Picture Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input/80">
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
                       <FormLabel className="flex items-center gap-2 text-md font-medium text-foreground/90"><HelpCircle size={20}/>Describe your picture (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Sunset with palm trees, vintage tone..."
                          className="resize-none bg-input/80"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <FormLabel className="text-xl font-semibold flex items-center gap-3 text-primary">
                <Smile size={28} /> 🎭 What&apos;s the mood or vibe?
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-md font-medium text-foreground/90"><Filter size={20}/>Select Mood</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input/80">
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
                      <FormLabel className="flex items-center gap-2 text-md font-medium text-foreground/90"><HelpCircle size={20}/>Describe your mood (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Feeling grateful, chill Sunday vibes..."
                          className="resize-none bg-input/80"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <FormLabel className="text-xl font-semibold flex items-center gap-3 text-primary">
                <Globe size={28} /> 🌍 Preferred language of the song?
                </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2 text-md font-medium text-foreground/90"><Languages size={20}/>Song Language</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2 pt-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Any" />
                          </FormControl>
                          <FormLabel className="font-normal text-foreground/90">Any</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="English" />
                          </FormControl>
                          <FormLabel className="font-normal text-foreground/90">English</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Specify" />
                          </FormControl>
                          <FormLabel className="font-normal text-foreground/90">Specify other...</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                     {preferredLanguageValue === "Specify" && (
                        <FormField
                          control={form.control}
                          name="otherLanguage"
                          render={({ field: langField }) => ( 
                            <FormItem className="mt-2">
                              <FormLabel className="text-xs text-muted-foreground">Other language (if any)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Spanish, Malayalam" {...langField} className="bg-input/80" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="postingPlatform"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel className="flex items-center gap-2 text-md font-medium text-foreground/90"><Send size={20}/>Where are you posting this story?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input/80">
                            <SelectValue placeholder="-- Select platform --" />
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
            </div>


            <div className="space-y-6">
              <FormLabel className="text-xl font-semibold flex items-center gap-3 text-primary">
                <CalendarClock size={28} /> ⏳ How recent should the song be?
              </FormLabel>
                <FormField
                  control={form.control}
                  name="songRecency"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel className="flex items-center gap-2 text-md font-medium text-foreground/90"><Clock size={20}/>Song Recency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input/80">
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

            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-xl py-7 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105" 
              disabled={form.formState.isSubmitting}
            >
              <Wand2 className="mr-3 h-6 w-6" />
              🔍 Get My Song & Lyric
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
