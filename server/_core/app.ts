import express from "express";
import { type Server } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { registerOAuthRoutes } from "./oauth";
import { serveStatic, setupVite } from "./vite";

type ExpressApp = ReturnType<typeof express>;

type CreateAppOptions =
  | { mode: "standalone"; server: Server }
  | { mode: "serverless" };

export async function createApp(
  options: CreateAppOptions
): Promise<ExpressApp> {
  const app = express();

  // Support larger payloads for image upload/processing requests.
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerOAuthRoutes(app);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (options.mode === "standalone") {
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, options.server);
    } else {
      serveStatic(app);
    }
  }

  return app;
}
