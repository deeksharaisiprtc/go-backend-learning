import type { Express } from "express";
import { createServer, type Server } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Proxy /api requests to the Go backend server
  const GO_BACKEND_URL = process.env.GO_BACKEND_URL || "http://localhost:8080";
  
  app.use(
    "/api",
    createProxyMiddleware({
      target: GO_BACKEND_URL,
      changeOrigin: true,
      logLevel: "silent",
      onError: (err, req, res) => {
        console.error("Proxy error:", err.message);
        res.writeHead(503, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            error: "Go backend server is not available. Please start the Go backend server.",
            details: "Run: cd go-backend && go run main.go",
          })
        );
      },
    })
  );

  return httpServer;
}
