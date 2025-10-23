import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// Transform string to Date object
			date: z.coerce.date(),
			description: z.string().optional(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).optional(),
			category: z.string().optional(),
			heroImage: image().optional(),
		}),
});

export const collections = { blog };
