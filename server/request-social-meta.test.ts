import assert from "node:assert/strict";
import test from "node:test";
import { applyRequestSocialMetadata } from "./request-social-meta";

test("social cards and canonical links use the incoming request host and route", () => {
  const html = [
    '<meta property="og:url" content="/" />',
    '<meta property="og:image" content="/scotgold-og.jpg" />',
    '<meta name="twitter:image" content="/scotgold-og.jpg" />',
    '<link rel="canonical" href="/" />',
  ].join("\n");

  const result = applyRequestSocialMetadata(
    html,
    "https://scotgold.example",
    "/about",
  );

  assert.match(result, /property="og:url" content="https:\/\/scotgold\.example\/about"/);
  assert.match(result, /property="og:image" content="https:\/\/scotgold\.example\/scotgold-og\.jpg"/);
  assert.match(result, /name="twitter:image" content="https:\/\/scotgold\.example\/scotgold-og\.jpg"/);
  assert.match(result, /rel="canonical" href="https:\/\/scotgold\.example\/about"/);
});
