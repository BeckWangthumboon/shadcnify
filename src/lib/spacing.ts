export const spacingMin = 0.125;
export const spacingMax = 1;
export const spacingStep = 0.025;

export const radiusMin = 0;
export const radiusMax = 2;
export const radiusStep = 0.05;

export const formatRem = (value: number) =>
  `${value.toFixed(3).replace(/\.?0+$/, "")}rem`;

export const clampSpacing = (value: number) =>
  Math.min(
    spacingMax,
    Math.max(spacingMin, Number.isFinite(value) ? value : spacingMin),
  );

export const clampRadius = (value: number) =>
  Math.min(
    radiusMax,
    Math.max(radiusMin, Number.isFinite(value) ? value : radiusMin),
  );
