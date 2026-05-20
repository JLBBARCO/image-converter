import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import fs from "fs";
import { type Server } from "http";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import type { Application } from "express";

export async function setupVite(app: Application, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });
  const serveIndex = async (req: Request, res: Response) => {
    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      const template = await fs.promises.readFile(clientTemplate, "utf-8");
      const html = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error) {
      console.error("Error serving index:", error);
      res.status(500).end("Internal server error");
    }
  };

  app.get(/^\/(?:$|index\.html|converter|batch|documentation)$/, serveIndex);

  // Serve Vite middleware for assets and modules (HMR, module resolution)
  app.use(vite.middlewares);

  // Optional request logging in dev to help diagnose routing
  if (process.env.NODE_ENV === "development") {
    app.use((req: Request, _res: Response, next: NextFunction) => {
      // Log only navigation and asset requests to avoid noise
      console.log(`[dev] ${req.method} ${req.originalUrl}`);
      next();
    });
  }
}

export function serveStatic(app: Application) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req: Request, res: Response) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
