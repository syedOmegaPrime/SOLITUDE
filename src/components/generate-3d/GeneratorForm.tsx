"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect, type ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { Loader2, Shapes, Download } from "lucide-react";
import { generateSimple3DAsset, type Generate3DAssetInput, type Generate3DAssetOutput } from "@/ai/flows/generate-3d-asset-flow";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

const formSchema = z.object({
  prompt: z.string().min(3, { message: "Prompt must be at least 3 characters." }).max(50, {message: "Prompt must be 50 characters or less."}),
});

interface AssetDisplayProps {
  assetOutput: Generate3DAssetOutput | null;
}

function AssetDisplay({ assetOutput }: AssetDisplayProps) {
  const { toast } = useToast();

  if (!assetOutput) {
    return null;
  }

  const handleDownload = () => {
    if (assetOutput.stlContent && assetOutput.fileName) {
      const blob = new Blob([assetOutput.stlContent], { type: 'model/stl' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = assetOutput.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); 
      toast({ title: "Download Started", description: `Downloading ${assetOutput.fileName}` });
    } else {
      toast({ title: "Download Failed", description: "No STL content available to download.", variant: "destructive" });
    }
  };
  
  return (
    <Card className="mt-8 shadow-md border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Generated Asset Details</CardTitle>
            <CardDescription>
              {assetOutput.message || `Details for the generated ${assetOutput.objectType}.`}
              {assetOutput.scaleApplied && ` Scale: ${assetOutput.scaleApplied.toFixed(2)}.`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p><span className="font-semibold">Object Type:</span> {assetOutput.objectType}</p>
        {assetOutput.fileName && <p><span className="font-semibold">Filename:</span> {assetOutput.fileName}</p>}
      </CardContent>
      {assetOutput.stlContent && assetOutput.fileName && assetOutput.objectType !== "unsupported" && (
        <CardFooter>
          <Button onClick={handleDownload} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Download className="mr-2 h-4 w-4" />
            Download {assetOutput.fileName}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}


export default function GeneratorForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAsset, setGeneratedAsset] = useState<Generate3DAssetOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedAsset(null); 
    try {
      const input: Generate3DAssetInput = { prompt: values.prompt };
      const result = await generateSimple3DAsset(input);
      setGeneratedAsset(result);

      if (result.objectType !== "unsupported") {
        toast({
          title: "Asset Processed",
          description: result.message || `Successfully processed prompt for ${result.objectType}.`,
        });
      } else {
         toast({
          title: "Unsupported Shape",
          description: result.message || "The requested shape is not supported.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating 3D asset:", error);
      toast({
        title: "Generation Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>3D Asset Prompt</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., a cube, sphere, pyramid, cylinder, 2d square" {...field} />
                </FormControl>
                <FormDescription>
                  Describe a simple shape like &quot;cube&quot;, &quot;sphere&quot;, &quot;pyramid&quot;, &quot;cylinder&quot;, &quot;square&quot; (for a flat 2D-like square), or &quot;circle&quot; (for a flat 2D-like circle). 
                  Each generated asset will have a random size.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Shapes className="mr-2 h-5 w-5" />
            )}
            Generate STL
          </Button>
        </form>
      </Form>
      <AssetDisplay assetOutput={generatedAsset} />
    </>
  );
}
