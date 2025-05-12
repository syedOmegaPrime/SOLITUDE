import GeneratorForm from '@/components/generate-3d/GeneratorForm';
import { Shapes } from 'lucide-react';

export default function Generate3DPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <header className="text-center mb-10">
        <Shapes className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-primary">Generate Simple 3D & 2D Assets</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Describe a simple shape (e.g., &quot;cube&quot;, &quot;sphere&quot;, &quot;pyramid&quot;, &quot;cylinder&quot;, &quot;square&quot;, &quot;circle&quot;) and get an STL file. Assets are generated with random sizes.
        </p>
      </header>
      <div className="p-8 bg-card shadow-xl rounded-lg border">
        <GeneratorForm />
      </div>
    </div>
  );
}