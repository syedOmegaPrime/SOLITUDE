"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { Asset } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useAssets } from '@/contexts/AssetContext';

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
import { Loader2, UploadCloud } from "lucide-react";
import { useState } from "react";
import { mockAssetCategories } from "@/data/mockData";

const formSchema = z.object({
  name: z.string().min(5, { message: "Asset name must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number or zero." }),
  tags: z.string().min(1, { message: "Please enter at least one tag, comma-separated." }),
  category: z.string().min(1, { message: "Please select a category." }),
  assetFile: z.custom<FileList>().refine(files => files && files.length > 0, "Asset file is required.")
    .refine(files => files && files[0]?.size <= 5 * 1024 * 1024, "Max file size is 5MB.") 
    .refine(files => files && ["image/png", "image/jpeg", "image/svg+xml", "application/zip"].includes(files[0]?.type), "Only PNG, JPG, SVG, or ZIP (for 3D models, etc.) files are allowed."),
});

export default function UploadForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addAsset, refreshAssets } = useAssets();
  const [isSubmitting, setIsSubmitting] = useState(false); // Renamed isLoading to isSubmitting for clarity
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      tags: "",
      category: "",
      assetFile: undefined,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      form.setValue("assetFile", files); 
      setFileName(file.name);

      if (["image/png", "image/jpeg", "image/svg+xml"].includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null); 
      }
    } else {
      form.setValue("assetFile", undefined);
      setFileName(null);
      setFilePreview(null);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to upload an asset.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    
    let imageUrl = `https://picsum.photos/seed/${encodeURIComponent(values.name.substring(0,10))}/600/400`; 

    const file = values.assetFile[0];
    let generatedFilePreview = filePreview;

    if (["image/png", "image/jpeg", "image/svg+xml"].includes(file.type)) {
      if(!generatedFilePreview) { // If preview wasn't set by handleFileChange (e.g. drag/drop not fully handled by state)
        try {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          imageUrl = dataUrl;
        } catch (error) {
          console.error("Error converting file to Data URI for preview:", error);
          // Keep default picsum imageUrl if conversion fails
        }
      } else {
        imageUrl = generatedFilePreview; // Use the already generated preview
      }
    }

    const assetDataForServer: Omit<Asset, 'id' | 'uploadDate'> = {
      name: values.name,
      description: values.description,
      price: values.price,
      tags: values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      imageUrl: imageUrl, 
      uploaderId: user.id,
      uploaderName: user.name || user.email.split('@')[0],
      category: values.category,
      fileType: file.type, 
      fileName: file.name,
    };
    
    const result = await addAsset(assetDataForServer); 

    if (result.success && result.asset) { // Check if asset was returned
        toast({
          title: "Asset Uploaded!",
          description: `${result.asset.name} has been added to the marketplace.`,
        });
        await refreshAssets(); 
        form.reset();
        setFileName(null);
        setFilePreview(null);
        router.push(`/marketplace/${result.asset.id}`); 
    } else {
        toast({
            title: "Upload Failed",
            description: result.error || "Could not upload asset.",
            variant: "destructive",
        });
    }
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Sci-Fi Robot 3D Model, Fantasy Character Sprite Sheet" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed description of your 2D/3D asset, its features, and usage suggestions."
                  className="min-h-[120px]"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (in BDT ৳)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 150.00 or 0 for free" {...field} value={field.value ?? 0} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value ?? ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category for your asset" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockAssetCategories.filter(c => c !== "All").map(cat => (
                       <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 3d model, character, sci-fi, low-poly, sprite, pixel art" {...field} value={field.value ?? ''}/>
              </FormControl>
              <FormDescription>
                Comma-separated tags. Helps users find your asset (e.g., 2d, 3d, character, environment).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assetFile"
          render={({ field: { onBlur, name, ref } }) => ( 
            <FormItem>
              <FormLabel>Asset File & Thumbnail Preview</FormLabel>
              <FormControl>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {filePreview ? (
                                <img src={filePreview} alt="Preview" className="max-h-32 mb-3 rounded-md object-contain" data-ai-hint="uploaded image preview" />
                            ) : (
                                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                            )}
                            {fileName ? (
                                <p className="mb-2 text-sm text-foreground"><span className="font-semibold">{fileName}</span></p>
                            ) : (
                                <>
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, SVG (for 2D/thumbnail) or ZIP (for 3D models, asset packs). Max 5MB.</p>
                                </>
                            )}
                        </div>
                        <Input 
                          id="dropzone-file" 
                          type="file" 
                          className="hidden"
                          onBlur={onBlur}
                          name={name}
                          ref={ref}
                          onChange={handleFileChange}
                          accept="image/png, image/jpeg, image/svg+xml, application/zip"
                        />
                    </label>
                </div> 
              </FormControl>
              <FormDescription>
                Upload your asset file. For images (PNG, JPG, SVG), this will also be the thumbnail. For ZIP files, a generic icon will be used as placeholder.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <UploadCloud className="mr-2 h-5 w-5" />
          )}
          Upload Asset
        </Button>
      </form>
    </Form>
  );
}
