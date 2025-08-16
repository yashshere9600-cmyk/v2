// PixelRippleCanvas.jsx
import React, { useEffect, useRef } from "react";

/**
 * Canvas-based pixelation ripple over an image.
 *
 * Props:
 * - src: string (required) — image URL/import
 * - className: string — wrapper classes (size this element; canvas fills it)
 * - coverage: number — fraction of image to pixelate (0..1). Default 0.5
 * - pixelBlock: number — base pixel block size in px (smaller => finer). Default 3
 * - speedMultiplier: number — animation speed (1 = normal, 3 = 3× faster). Default 3
 * - rippleAmplitude: number — 0..0.25 fraction of radius for pulsing. Default 0.06
 * - cycleSeconds: number — seconds per “hop” to a new random spot (before speed). Default 2.2
 */
export default function PixelRippleCanvas({
  src,
  className = "",
  coverage = 0.5,
  pixelBlock = 3,
  speedMultiplier = 3,
  rippleAmplitude = 0.06,
  cycleSeconds = 2.2,
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; // ok for same-origin; helps with some setups
    imgRef.current = img;

    let ready = false;
    let width = 0;
    let height = 0;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    // Offscreen canvas to create pixelated frame efficiently
    const off = document.createElement("canvas");
    const octx = off.getContext("2d", { alpha: false });

    // Handle sizing & DPR
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.clientWidth || 1;
      const h = wrapRef.current.clientHeight || 1;

      // Canvas CSS size
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // Canvas backing size
      width = Math.max(1, Math.floor(w * dpr));
      height = Math.max(1, Math.floor(h * dpr));
      canvas.width = width;
      canvas.height = height;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
      ctx.imageSmoothingEnabled = true;   // for base image
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrapRef.current);

    // Animation state
    let startTs = 0;
    let cycleDur = Math.max(0.8, cycleSeconds / Math.max(0.001, speedMultiplier)) * 1000;
    let center = { x: 0.5, y: 0.5 }; // normalized (0..1), will randomize on first frame
    let baseRadius = 0;              // pixels (backing coords)

    // Choose a new random center (normalized)
    const randomCenter = () => ({
      x: 0.15 + Math.random() * 0.70, // keep away from extreme edges a bit
      y: 0.15 + Math.random() * 0.70,
    });

    // Compute radius for ~coverage of the rectangular image:
    // pi * R^2 ≈ coverage * W * H  ->  R = sqrt(coverage * W * H / pi)
    const computeBaseRadius = () => {
      baseRadius = Math.sqrt((coverage * width * height) / Math.PI);
    };

    // Draw base image to fill canvas while preserving aspect ratio (cover)
    const drawBaseImage = () => {
      const iw = img.naturalWidth || 1;
      const ih = img.naturalHeight || 1;
      const canvasAR = width / height;
      const imgAR = iw / ih;

      let dw, dh, dx, dy;
      if (imgAR > canvasAR) {
        // image is wider -> fit height, crop width
        dh = height;
        dw = ih ? Math.round(height * imgAR) : width;
        dx = Math.round((width - dw) / 2);
        dy = 0;
      } else {
        // image is taller -> fit width, crop height
        dw = width;
        dh = iw ? Math.round(width / imgAR) : height;
        dx = 0;
        dy = Math.round((height - dh) / 2);
      }
      ctx.drawImage(img, dx, dy, dw, dh);
      return { dx, dy, dw, dh }; // used for offscreen pixelation
    };

    // Prepares an offscreen pixelated frame for the same draw rect
    const drawPixelatedToOffscreen = ({ dx, dy, dw, dh }, pixelSize) => {
      // Compute downscale size (block size ~ pixelSize)
      const smallW = Math.max(1, Math.floor(dw / pixelSize));
      const smallH = Math.max(1, Math.floor(dh / pixelSize));

      off.width = smallW;
      off.height = smallH;

      // draw to offscreen small
      octx.imageSmoothingEnabled = true;
      octx.drawImage(img, 0, 0, smallW, smallH);

      // When drawing back large, disable smoothing to get crisp blocks
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, smallW, smallH, dx, dy, dw, dh);
      ctx.imageSmoothingEnabled = true;
    };

    const step = (ts) => {
      if (!ready) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      if (!startTs) startTs = ts;

      // Clear
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Base (clean) image
      const rect = drawBaseImage();

      // Compute current ripple radius (± rippleAmplitude of base)
      const t = ((ts - startTs) % cycleDur) / cycleDur; // 0..1 within cycle
      const r = baseRadius * (1 + rippleAmplitude * Math.sin(t * Math.PI * 2));

      // Pixel size (smallest pixels)
      const px = Math.max(1, pixelBlock);

      // Clip to circle, draw pixelated version, then restore
      ctx.save();
      const cx = Math.round(center.x * width);
      const cy = Math.round(center.y * height);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      drawPixelatedToOffscreen(rect, px);

      ctx.restore();

      // When a cycle completes, hop to a new random spot (keeps the loop alive)
      // Also: small random jitter each frame to keep it lively.
      if (t < 0.02 && ts - startTs > 50) {
        center = randomCenter();
      } else {
        // tiny wander for "organic" feel
        center.x = Math.min(0.98, Math.max(0.02, center.x + (Math.random() - 0.5) * 0.001));
        center.y = Math.min(0.98, Math.max(0.02, center.y + (Math.random() - 0.5) * 0.001));
      }

      rafRef.current = requestAnimationFrame(step);
    };

    const onImageLoad = () => {
      ready = true;
      resize();
      computeBaseRadius();
      center = randomCenter();
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(step);
    };

    const onImageError = () => {
      // Fallback: gray background
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    img.addEventListener("load", onImageLoad);
    img.addEventListener("error", onImageError);
    img.src = src;

    // Recompute radius on resize
    const onResize = () => {
      computeBaseRadius();
    };
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      img.removeEventListener("load", onImageLoad);
      img.removeEventListener("error", onImageError);
      cancelAnimationFrame(rafRef.current);
    };
  }, [src, coverage, pixelBlock, speedMultiplier, rippleAmplitude, cycleSeconds]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
