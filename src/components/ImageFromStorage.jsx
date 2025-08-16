import React from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage, STORAGE_FOLDER } from "../firebase.js";

export async function resolveStorageImageUrl(slug, folder = STORAGE_FOLDER) {
  const exts = ["webp", "jpg", "png"];
  for (const ext of exts) {
    try {
      const r = ref(storage, `${folder}/${slug}.${ext}`);
      const url = await getDownloadURL(r);
      if (url) return url;
    } catch {
    }
  }
  return null;
}

export default function ImageFromStorage({
  slug,
  alt = "",
  className = "",
  width = 1280,
  height = 720
}) {
  const [src, setSrc] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    resolveStorageImageUrl(slug).then((url) => {
      if (!active) return;
      setSrc(url);
      setLoading(false);
    });
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <div
        className={`bg-slate-200/50 dark:bg-slate-800/50 animate-pulse ${className}`}
        style={{ aspectRatio: `${width}/${height}` }}
      />
    );
  }

  if (!src) {
    return (
      <div
        className={`grid place-items-center ${className}`}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="opacity-40"
        >
          <path
            fill="currentColor"
            d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14zm-2-2H5V5h14zM8.5 13l2.5 3l3.5-4.5l4 6H6zM8 8a2 2 0 1 0 0 4a2 2 0 0 0 0-4"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width={width}
      height={height}
      className={className}
    />
  );
}
