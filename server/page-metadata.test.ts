import assert from "node:assert/strict";
import test from "node:test";
import { getPageMetadata } from "../client/src/lib/page-metadata";

test("main user pages have short French titles and English descriptions", () => {
  assert.equal(getPageMetadata("/").title, "Accueil");
  assert.equal(getPageMetadata("/team").title, "Partager");
  assert.equal(getPageMetadata("/tasks").title, "Inviter");
  assert.equal(getPageMetadata("/withdrawal").title, "Retrait");

  for (const path of ["/", "/team", "/tasks", "/withdrawal"]) {
    const metadata = getPageMetadata(path);
    assert.ok(metadata.description.length > 0);
    assert.match(metadata.description, /Scottish gold exploration company/);
    assert.doesNotMatch(metadata.description, /société écossaise/i);
  }
});

test("metadata handles product details, admin routes, and query strings", () => {
  assert.equal(getPageMetadata("/products/12?from=home").title, "Détail du produit");
  assert.equal(getPageMetadata("/mgmt-1np5g23g12/users").title, "Administration");
  assert.equal(getPageMetadata("/history?tab=deposits").title, "Mon relevé");
});
