import { marked, Tokens } from "https://deno.land/x/marked@1.0.2/mod.ts";

const renderer = new marked.Renderer();

// Override link renderer with TypeScript types
renderer.link = function ({ href, title, text }: Tokens.Link): string {
  // Check if href exists and is external
  if (href && (href.startsWith("http") || href.startsWith("https"))) {
    // Create link with target="_blank"
    const link = `<a href="${href}" target="_blank" rel="noopener noreferrer"`;

    // Add title if it exists
    if (title) {
      return `${link} title="${title}">${text}</a>`;
    }

    return `${link}>${text}</a>`;
  }

  // For internal links, use default behavior
  if (title) {
    return `<a href="${href}" title="${title}">${text}</a>`;
  }
  return `<a href="${href}">${text}</a>`;
};

marked.setOptions({
  renderer: renderer,
});

export async function page(content: string) {
  return await marked(content);
}
