export type Box = { top: number; left: number; width: number; height: number };

/** Grown frame is centered and larger. Rest frame is the image's own box. */
export function zoomFrame(
  origin: Box,
  grown: boolean,
  viewport: { w: number; h: number },
) {
  const maxW = Math.min(origin.width * 1.75, Math.max(viewport.w - 64, origin.width));
  const scale = grown ? maxW / origin.width : 1;
  const tx = grown ? viewport.w / 2 - (origin.left + origin.width / 2) : 0;
  const ty = grown ? viewport.h / 2 - (origin.top + origin.height / 2) : 0;
  return { scale, tx, ty };
}
