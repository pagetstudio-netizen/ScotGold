import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { applyRequestSocialMetadata } from "./request-social-meta";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, { index: false }));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", async (req, res, next) => {
    try {
      const indexHtml = await fs.promises.readFile(path.resolve(distPath, "index.html"), "utf-8");
      const origin = `${req.protocol}://${req.get("host")}`;
      res.status(200).type("html").send(
        applyRequestSocialMetadata(indexHtml, origin, req.path),
      );
    } catch (error) {
      next(error);
    }
  });
}
