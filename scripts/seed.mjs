import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import admin from "firebase-admin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!serviceAccountPath) {
  console.error("ERROR: Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.");
  process.exit(1);
}

const serviceAccount = await fs.readFile(serviceAccountPath, "utf8").then(JSON.parse);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

const dataPath = path.resolve(__dirname, "../data/sample-newarticles.json");
const raw = await fs.readFile(dataPath, "utf8");
const items = JSON.parse(raw);

const collectionName = process.env.FIRESTORE_COLLECTION || "newarticles";
const storageFolder = process.env.STORAGE_FOLDER || "newimages";

console.log(`Seeding ${items.length} docs into '${collectionName}'…`);

for (const doc of items) {
  const id = doc.id || doc.slug;
  if (!id) {
    console.warn("Skipped an item without slug/id");
    continue;
  }
  await db.collection(collectionName).doc(id).set(doc, { merge: true });
  if (doc._demo_image_base64 && doc.slug) {
    const buf = Buffer.from(doc._demo_image_base64, "base64");
    const dest = `${storageFolder}/${doc.slug}.webp`;
    const file = bucket.file(dest);
    await file.save(buf, {
      resumable: false,
      contentType: "image/webp",
      public: true,
      metadata: { cacheControl: "public,max-age=31536000,immutable" }
    });
    console.log(`Uploaded demo image → gs://${bucket.name}/${dest}`);
  }
}

console.log("Done.");
