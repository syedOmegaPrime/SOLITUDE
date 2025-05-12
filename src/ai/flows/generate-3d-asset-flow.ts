'use server';
/**
 * @fileOverview A simple 3D asset generator flow.
 *
 * - generateSimple3DAsset - A function that "generates" STL for simple shapes with random sizes.
 * - Generate3DAssetInput - The input type.
 * - Generate3DAssetOutput - The return type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// --- STL Generation Functions ---

function generateCubeStl(scale: number): string {
  const s = scale; // half-length for centered cube from -s to +s
  return `solid cube
facet normal 0.0 0.0 -1.0
  outer loop
    vertex ${-s} ${-s} ${-s}
    vertex ${s} ${-s} ${-s}
    vertex ${s} ${s} ${-s}
  endloop
endfacet
facet normal 0.0 0.0 -1.0
  outer loop
    vertex ${-s} ${-s} ${-s}
    vertex ${s} ${s} ${-s}
    vertex ${-s} ${s} ${-s}
  endloop
endfacet
facet normal 0.0 0.0 1.0
  outer loop
    vertex ${-s} ${-s} ${s}
    vertex ${-s} ${s} ${s}
    vertex ${s} ${s} ${s}
  endloop
endfacet
facet normal 0.0 0.0 1.0
  outer loop
    vertex ${-s} ${-s} ${s}
    vertex ${s} ${s} ${s}
    vertex ${s} ${-s} ${s}
  endloop
endfacet
facet normal 0.0 -1.0 0.0
  outer loop
    vertex ${-s} ${-s} ${-s}
    vertex ${-s} ${-s} ${s}
    vertex ${s} ${-s} ${s}
  endloop
endfacet
facet normal 0.0 -1.0 0.0
  outer loop
    vertex ${-s} ${-s} ${-s}
    vertex ${s} ${-s} ${s}
    vertex ${s} ${-s} ${-s}
  endloop
endfacet
facet normal 0.0 1.0 0.0
  outer loop
    vertex ${-s} ${s} ${-s}
    vertex ${s} ${s} ${-s}
    vertex ${s} ${s} ${s}
  endloop
endfacet
facet normal 0.0 1.0 0.0
  outer loop
    vertex ${-s} ${s} ${-s}
    vertex ${s} ${s} ${s}
    vertex ${-s} ${s} ${s}
  endloop
endfacet
facet normal -1.0 0.0 0.0
  outer loop
    vertex ${-s} ${-s} ${-s}
    vertex ${-s} ${s} ${-s}
    vertex ${-s} ${s} ${s}
  endloop
endfacet
facet normal -1.0 0.0 0.0
  outer loop
    vertex ${-s} ${-s} ${-s}
    vertex ${-s} ${s} ${s}
    vertex ${-s} ${-s} ${s}
  endloop
endfacet
facet normal 1.0 0.0 0.0
  outer loop
    vertex ${s} ${-s} ${-s}
    vertex ${s} ${-s} ${s}
    vertex ${s} ${s} ${s}
  endloop
endfacet
facet normal 1.0 0.0 0.0
  outer loop
    vertex ${s} ${-s} ${-s}
    vertex ${s} ${s} ${s}
    vertex ${s} ${s} ${-s}
  endloop
endfacet
endsolid cube`;
}

function generateFlatSquareStl(scale: number): string {
  const s = scale;
  const thickness = scale * 0.05; // Very thin
  return `solid flat_square
facet normal 0.0 0.0 -1.0
  outer loop
    vertex ${-s} ${-s} ${-thickness/2}
    vertex ${s} ${-s} ${-thickness/2}
    vertex ${s} ${s} ${-thickness/2}
  endloop
endfacet
facet normal 0.0 0.0 -1.0
  outer loop
    vertex ${-s} ${-s} ${-thickness/2}
    vertex ${s} ${s} ${-thickness/2}
    vertex ${-s} ${s} ${-thickness/2}
  endloop
endfacet
facet normal 0.0 0.0 1.0
  outer loop
    vertex ${-s} ${-s} ${thickness/2}
    vertex ${s} ${s} ${thickness/2}
    vertex ${s} ${-s} ${thickness/2}
  endloop
endfacet
facet normal 0.0 0.0 1.0
  outer loop
    vertex ${-s} ${-s} ${thickness/2}
    vertex ${-s} ${s} ${thickness/2}
    vertex ${s} ${s} ${thickness/2}
  endloop
endfacet
facet normal 0.0 -1.0 0.0
  outer loop
    vertex ${-s} ${-s} ${-thickness/2}
    vertex ${-s} ${-s} ${thickness/2}
    vertex ${s} ${-s} ${thickness/2}
  endloop
endfacet
facet normal 0.0 -1.0 0.0
  outer loop
    vertex ${-s} ${-s} ${-thickness/2}
    vertex ${s} ${-s} ${thickness/2}
    vertex ${s} ${-s} ${-thickness/2}
  endloop
endfacet
facet normal 0.0 1.0 0.0
  outer loop
    vertex ${-s} ${s} ${-thickness/2}
    vertex ${s} ${s} ${thickness/2}
    vertex ${-s} ${s} ${thickness/2}
  endloop
endfacet
facet normal 0.0 1.0 0.0
  outer loop
    vertex ${-s} ${s} ${-thickness/2}
    vertex ${s} ${s} ${-thickness/2}
    vertex ${s} ${s} ${thickness/2}
  endloop
endfacet
facet normal -1.0 0.0 0.0
  outer loop
    vertex ${-s} ${-s} ${-thickness/2}
    vertex ${-s} ${s} ${-thickness/2}
    vertex ${-s} ${s} ${thickness/2}
  endloop
endfacet
facet normal -1.0 0.0 0.0
  outer loop
    vertex ${-s} ${-s} ${-thickness/2}
    vertex ${-s} ${s} ${thickness/2}
    vertex ${-s} ${-s} ${thickness/2}
  endloop
endfacet
facet normal 1.0 0.0 0.0
  outer loop
    vertex ${s} ${-s} ${-thickness/2}
    vertex ${s} ${s} ${thickness/2}
    vertex ${s} ${s} ${-thickness/2}
  endloop
endfacet
facet normal 1.0 0.0 0.0
  outer loop
    vertex ${s} ${-s} ${-thickness/2}
    vertex ${s} ${-s} ${thickness/2}
    vertex ${s} ${s} ${thickness/2}
  endloop
endfacet
endsolid flat_square`;
}


function generateSphereStl(scale: number, segments: number = 8): string {
  // Using an octahedron as a very simple sphere approximation, scaled.
  // More segments would make it smoother but also much longer STL.
  let stl = `solid sphere_approx\n`;
  const radius = scale;

  // Vertices of a basic octahedron
  const vertices = [
    [radius, 0, 0], [-radius, 0, 0],
    [0, radius, 0], [0, -radius, 0],
    [0, 0, radius], [0, 0, -radius]
  ];

  // Faces of the octahedron (indices into vertices array)
  const faces = [
    [0, 2, 4], [0, 4, 3], [0, 3, 5], [0, 5, 2], // Top pyramid
    [1, 2, 5], [1, 5, 3], [1, 3, 4], [1, 4, 2]  // Bottom pyramid
  ];

  for (const face of faces) {
    const v1 = vertices[face[0]];
    const v2 = vertices[face[1]];
    const v3 = vertices[face[2]];

    // Simple normal calculation (average of vertices, not accurate for non-flat faces but ok for this approx)
    // A more robust method would be cross product of two edges.
    const normal = [
        (v1[0]+v2[0]+v3[0])/3,
        (v1[1]+v2[1]+v3[1])/3,
        (v1[2]+v2[2]+v3[2])/3
    ];
    const len = Math.sqrt(normal[0]*normal[0] + normal[1]*normal[1] + normal[2]*normal[2]);
    if (len > 0) {
        normal[0] /= len; normal[1] /= len; normal[2] /= len;
    }


    stl += `facet normal ${normal[0].toFixed(6)} ${normal[1].toFixed(6)} ${normal[2].toFixed(6)}\n`;
    stl += `  outer loop\n`;
    stl += `    vertex ${v1[0].toFixed(6)} ${v1[1].toFixed(6)} ${v1[2].toFixed(6)}\n`;
    stl += `    vertex ${v2[0].toFixed(6)} ${v2[1].toFixed(6)} ${v2[2].toFixed(6)}\n`;
    stl += `    vertex ${v3[0].toFixed(6)} ${v3[1].toFixed(6)} ${v3[2].toFixed(6)}\n`;
    stl += `  endloop\n`;
    stl += `endfacet\n`;
  }

  stl += `endsolid sphere_approx\n`;
  return stl;
}

function generatePyramidStl(scale: number): string {
  const s = scale; // half base length
  const h = scale * 1.5; // height
  return `solid pyramid
facet normal 0.0 ${-h/Math.sqrt(s*s + h*h)} ${-s/Math.sqrt(s*s + h*h)} 
  outer loop
    vertex 0.0 0.0 ${h}
    vertex ${-s} ${-s} 0.0
    vertex ${s} ${-s} 0.0
  endloop
endfacet
facet normal ${h/Math.sqrt(s*s + h*h)} 0.0 ${-s/Math.sqrt(s*s + h*h)} 
  outer loop
    vertex 0.0 0.0 ${h}
    vertex ${s} ${-s} 0.0
    vertex ${s} ${s} 0.0
  endloop
endfacet
facet normal 0.0 ${h/Math.sqrt(s*s + h*h)} ${-s/Math.sqrt(s*s + h*h)} 
  outer loop
    vertex 0.0 0.0 ${h}
    vertex ${s} ${s} 0.0
    vertex ${-s} ${s} 0.0
  endloop
endfacet
facet normal ${-h/Math.sqrt(s*s + h*h)} 0.0 ${-s/Math.sqrt(s*s + h*h)} 
  outer loop
    vertex 0.0 0.0 ${h}
    vertex ${-s} ${s} 0.0
    vertex ${-s} ${-s} 0.0
  endloop
endfacet
facet normal 0.0 0.0 -1.0
  outer loop
    vertex ${-s} ${-s} 0.0
    vertex ${-s} ${s} 0.0
    vertex ${s} ${s} 0.0
  endloop
endfacet
facet normal 0.0 0.0 -1.0
  outer loop
    vertex ${-s} ${-s} 0.0
    vertex ${s} ${s} 0.0
    vertex ${s} ${-s} 0.0
  endloop
endfacet
endsolid pyramid`;
}

function generateCylinderStl(scale: number, segments: number = 12): string {
  const radius = scale;
  const height = scale * 2;
  let stl = `solid cylinder\n`;

  const halfHeight = height / 2;

  // Top and bottom center points
  const topCenter = [0, 0, halfHeight];
  const bottomCenter = [0, 0, -halfHeight];

  // Generate vertices for top and bottom circles
  const topVertices = [];
  const bottomVertices = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    topVertices.push([x, y, halfHeight]);
    bottomVertices.push([x, y, -halfHeight]);
  }

  // Top cap
  for (let i = 0; i < segments; i++) {
    const v1 = topCenter;
    const v2 = topVertices[i];
    const v3 = topVertices[(i + 1) % segments];
    stl += `facet normal 0.0 0.0 1.0\n  outer loop\n`;
    stl += `    vertex ${v1[0].toFixed(6)} ${v1[1].toFixed(6)} ${v1[2].toFixed(6)}\n`;
    stl += `    vertex ${v2[0].toFixed(6)} ${v2[1].toFixed(6)} ${v2[2].toFixed(6)}\n`;
    stl += `    vertex ${v3[0].toFixed(6)} ${v3[1].toFixed(6)} ${v3[2].toFixed(6)}\n`;
    stl += `  endloop\nendfacet\n`;
  }

  // Bottom cap
  for (let i = 0; i < segments; i++) {
    const v1 = bottomCenter;
    const v2 = bottomVertices[(i + 1) % segments]; // Reversed order for correct normal
    const v3 = bottomVertices[i];
    stl += `facet normal 0.0 0.0 -1.0\n  outer loop\n`;
    stl += `    vertex ${v1[0].toFixed(6)} ${v1[1].toFixed(6)} ${v1[2].toFixed(6)}\n`;
    stl += `    vertex ${v2[0].toFixed(6)} ${v2[1].toFixed(6)} ${v2[2].toFixed(6)}\n`;
    stl += `    vertex ${v3[0].toFixed(6)} ${v3[1].toFixed(6)} ${v3[2].toFixed(6)}\n`;
    stl += `  endloop\nendfacet\n`;
  }

  // Sides
  for (let i = 0; i < segments; i++) {
    const tv1 = topVertices[i];
    const tv2 = topVertices[(i + 1) % segments];
    const bv1 = bottomVertices[i];
    const bv2 = bottomVertices[(i + 1) % segments];

    // Side face 1
    let normal = [ (tv1[0]+tv2[0])/2, (tv1[1]+tv2[1])/2, 0]; // Approximate normal
    let len = Math.sqrt(normal[0]*normal[0] + normal[1]*normal[1]);
    if(len > 0) { normal[0] /= len; normal[1] /= len; }

    stl += `facet normal ${normal[0].toFixed(6)} ${normal[1].toFixed(6)} 0.0\n  outer loop\n`;
    stl += `    vertex ${tv1[0].toFixed(6)} ${tv1[1].toFixed(6)} ${tv1[2].toFixed(6)}\n`;
    stl += `    vertex ${bv1[0].toFixed(6)} ${bv1[1].toFixed(6)} ${bv1[2].toFixed(6)}\n`;
    stl += `    vertex ${bv2[0].toFixed(6)} ${bv2[1].toFixed(6)} ${bv2[2].toFixed(6)}\n`;
    stl += `  endloop\nendfacet\n`;

    // Side face 2
    stl += `facet normal ${normal[0].toFixed(6)} ${normal[1].toFixed(6)} 0.0\n  outer loop\n`;
    stl += `    vertex ${tv1[0].toFixed(6)} ${tv1[1].toFixed(6)} ${tv1[2].toFixed(6)}\n`;
    stl += `    vertex ${bv2[0].toFixed(6)} ${bv2[1].toFixed(6)} ${bv2[2].toFixed(6)}\n`;
    stl += `    vertex ${tv2[0].toFixed(6)} ${tv2[1].toFixed(6)} ${tv2[2].toFixed(6)}\n`;
    stl += `  endloop\nendfacet\n`;
  }
  stl += `endsolid cylinder\n`;
  return stl;
}

function generateFlatCircleStl(scale: number, segments: number = 12): string {
  const radius = scale;
  const thickness = scale * 0.05; // Very thin
  let stl = `solid flat_circle\n`;

  const halfThickness = thickness / 2;

  // Top and bottom center points
  const topCenter = [0, 0, halfThickness];
  const bottomCenter = [0, 0, -halfThickness];

  const topVertices = [];
  const bottomVertices = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    topVertices.push([x, y, halfThickness]);
    bottomVertices.push([x, y, -halfThickness]);
  }

  // Top cap
  for (let i = 0; i < segments; i++) {
    const v1 = topCenter;
    const v2 = topVertices[i];
    const v3 = topVertices[(i + 1) % segments];
    stl += `facet normal 0.0 0.0 1.0\n  outer loop\n`;
    stl += `    vertex ${v1[0].toFixed(6)} ${v1[1].toFixed(6)} ${v1[2].toFixed(6)}\n`;
    stl += `    vertex ${v2[0].toFixed(6)} ${v2[1].toFixed(6)} ${v2[2].toFixed(6)}\n`;
    stl += `    vertex ${v3[0].toFixed(6)} ${v3[1].toFixed(6)} ${v3[2].toFixed(6)}\n`;
    stl += `  endloop\nendfacet\n`;
  }

  // Bottom cap
  for (let i = 0; i < segments; i++) {
    const v1 = bottomCenter;
    const v2 = bottomVertices[(i + 1) % segments];
    const v3 = bottomVertices[i];
    stl += `facet normal 0.0 0.0 -1.0\n  outer loop\n`;
    stl += `    vertex ${v1[0].toFixed(6)} ${v1[1].toFixed(6)} ${v1[2].toFixed(6)}\n`;
    stl += `    vertex ${v2[0].toFixed(6)} ${v2[1].toFixed(6)} ${v2[2].toFixed(6)}\n`;
    stl += `    vertex ${v3[0].toFixed(6)} ${v3[1].toFixed(6)} ${v3[2].toFixed(6)}\n`;
    stl += `  endloop\nendfacet\n`;
  }

  // Sides
  for (let i = 0; i < segments; i++) {
    const tv1 = topVertices[i];
    const tv2 = topVertices[(i + 1) % segments];
    const bv1 = bottomVertices[i];
    const bv2 = bottomVertices[(i + 1) % segments];
    
    let normal = [ (tv1[0]+tv2[0])/2, (tv1[1]+tv2[1])/2, 0];
    let len = Math.sqrt(normal[0]*normal[0] + normal[1]*normal[1]);
    if(len > 0) { normal[0] /= len; normal[1] /= len; }

    stl += `facet normal ${normal[0].toFixed(6)} ${normal[1].toFixed(6)} 0.0\n  outer loop\n`;
    stl += `    vertex ${tv1[0].toFixed(6)} ${tv1[1].toFixed(6)} ${tv1[2].toFixed(6)}\n`;
    stl += `    vertex ${bv1[0].toFixed(6)} ${bv1[1].toFixed(6)} ${bv1[2].toFixed(6)}\n`;
    stl += `    vertex ${bv2[0].toFixed(6)} ${bv2[1].toFixed(6)} ${bv2[2].toFixed(6)}\n`;
    stl += `  endloop\nendfacet\n`;

    stl += `facet normal ${normal[0].toFixed(6)} ${normal[1].toFixed(6)} 0.0\n  outer loop\n`;
    stl += `    vertex ${tv1[0].toFixed(6)} ${tv1[1].toFixed(6)} ${tv1[2].toFixed(6)}\n`;
    stl += `    vertex ${bv2[0].toFixed(6)} ${bv2[1].toFixed(6)} ${bv2[2].toFixed(6)}\n`;
    stl += `    vertex ${tv2[0].toFixed(6)} ${tv2[1].toFixed(6)} ${tv2[2].toFixed(6)}\n`;
    stl += `  endloop\nendfacet\n`;
  }
  stl += `endsolid flat_circle\n`;
  return stl;
}


const Generate3DAssetInputSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty.").describe("A simple prompt describing the 3D asset, e.g., 'cube', 'sphere', 'pyramid', 'cylinder', '2d square', 'flat circle'."),
});
export type Generate3DAssetInput = z.infer<typeof Generate3DAssetInputSchema>;

const Generate3DAssetOutputSchema = z.object({
  objectType: z.string().describe("The type of object generated, e.g., 'cube', 'sphere', or 'unsupported'."),
  stlContent: z.string().describe("The STL content of the generated 3D model. Empty if unsupported."),
  fileName: z.string().describe("The suggested filename for the STL file. Empty if unsupported."),
  message: z.string().optional().describe("A message about the generation process, e.g., if the shape is unsupported."),
  scaleApplied: z.number().optional().describe("The random scale factor applied to the object."),
});
export type Generate3DAssetOutput = z.infer<typeof Generate3DAssetOutputSchema>;


async function generateAssetLogic(input: Generate3DAssetInput): Promise<Generate3DAssetOutput> {
  const promptText = input.prompt.trim().toLowerCase();
  const randomScale = Math.random() * 1.5 + 0.5; // Scale between 0.5 and 2.0

  let stlContent = "";
  let objectType = "unsupported";
  let fileName = "";
  let message = "";

  if (promptText.includes("cube")) {
    objectType = "cube";
    stlContent = generateCubeStl(randomScale);
    fileName = `cube_scaled_${randomScale.toFixed(2)}.stl`;
    message = `Generated a cube with scale ${randomScale.toFixed(2)}.`;
  } else if (promptText.includes("sphere")) {
    objectType = "sphere";
    stlContent = generateSphereStl(randomScale);
    fileName = `sphere_scaled_${randomScale.toFixed(2)}.stl`;
    message = `Generated a sphere (octahedron approximation) with scale ${randomScale.toFixed(2)}.`;
  } else if (promptText.includes("pyramid")) {
    objectType = "pyramid";
    stlContent = generatePyramidStl(randomScale);
    fileName = `pyramid_scaled_${randomScale.toFixed(2)}.stl`;
    message = `Generated a pyramid with scale ${randomScale.toFixed(2)}.`;
  } else if (promptText.includes("cylinder")) {
    objectType = "cylinder";
    stlContent = generateCylinderStl(randomScale);
    fileName = `cylinder_scaled_${randomScale.toFixed(2)}.stl`;
    message = `Generated a cylinder with scale ${randomScale.toFixed(2)}.`;
  } else if (promptText.includes("square") || promptText.includes("2d square") || promptText.includes("flat square")) {
    objectType = "flat_square";
    stlContent = generateFlatSquareStl(randomScale);
    fileName = `flat_square_scaled_${randomScale.toFixed(2)}.stl`;
    message = `Generated a flat square with scale ${randomScale.toFixed(2)}.`;
  } else if (promptText.includes("circle") || promptText.includes("2d circle") || promptText.includes("flat circle")) {
    objectType = "flat_circle";
    stlContent = generateFlatCircleStl(randomScale);
    fileName = `flat_circle_scaled_${randomScale.toFixed(2)}.stl`;
    message = `Generated a flat circle with scale ${randomScale.toFixed(2)}.`;
  }
  else {
    message = "Sorry, I can only generate 'cube', 'sphere', 'pyramid', 'cylinder', 'square', or 'circle' for now. More complex shapes are not supported.";
    return {
      objectType: "unsupported",
      stlContent: "",
      fileName: "",
      message: message,
    };
  }

  return {
    objectType,
    stlContent,
    fileName,
    message,
    scaleApplied: randomScale,
  };
}

const generateSimple3DAssetFlow = ai.defineFlow(
  {
    name: 'generateSimple3DAssetFlow',
    inputSchema: Generate3DAssetInputSchema,
    outputSchema: Generate3DAssetOutputSchema,
  },
  async (input) => {
    return generateAssetLogic(input);
  }
);

export async function generateSimple3DAsset(input: Generate3DAssetInput): Promise<Generate3DAssetOutput> {
  return generateSimple3DAssetFlow(input);
}

