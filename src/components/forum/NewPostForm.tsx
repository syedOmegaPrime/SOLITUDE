"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useForum } from "@/contexts/ForumContext"; 

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
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import type { ForumPost } from "@/types";

const formSchema = z.object({
  title: z.string().min(10, { message: "Title must be at least 10 characters." }).max(100, { message: "Title must be 100 characters or less."}),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(1000, { message: "Description must be 1000 characters or less."}),
});

export default function NewPostForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { addPost, refreshForumData } = useForum(); 
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to post.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    
    const newPostData: Omit<ForumPost, 'id' | 'creationDate' | 'replies'> = {
        title: values.title,
        description: values.description,
        userId: user.id,
        userName: user.name || user.email.split('@')[0],
    };
    
    const result = await addPost(newPostData); 

    setIsLoading(false);

    if (result.success) {
        toast({
          title: "Post Created Successfully!",
          description: "Your asset request has been published to the forum.",
        });
        await refreshForumData(); // Refresh forum data
        form.reset();
        router.push("/forum"); 
    } else {
        toast({
            title: "Failed to Create Post",
            description: result.error || "Could not create post.",
            variant: "destructive",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Request: Animated 2D Character Sprite Sheet" {...field} />
              </FormControl>
              <FormDescription>
                A clear and concise title for your 2D or 3D asset request.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the 2D or 3D asset you're looking for in detail. Include style, format, specific elements, use case, etc."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
               <FormDescription>
                The more details you provide, the better others can understand your needs.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Send className="mr-2 h-5 w-5" />
          )}
          Submit Request
        </Button>
      </form>
    </Form>
  );
}
