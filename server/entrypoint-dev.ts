import { serveFile } from "https://deno.land/std@0.223.0/http/file_server.ts";
import { corsHeaders } from "https://raw.githubusercontent.com/yjgaia/deno-module/refs/heads/main/api.ts";
import { page } from "./page.ts";

async function fileExists(path: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(path);
    return stat.isFile;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw error;
    }
  }
}

Deno.serve(async (req) => {
  const basePath = Deno.cwd() + "/public";
  const path = new URL(req.url).pathname;

  const mdPath = Deno.cwd() + "/docs" + (path === "/" ? "/index" : path) +
    ".md";
  if (await fileExists(mdPath)) {
    const md = await Deno.readTextFile(mdPath);
    return new Response(await page(md), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  }

  const filePath = basePath + path;

  const response = await serveFile(req, filePath);
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }
  return response;
});
