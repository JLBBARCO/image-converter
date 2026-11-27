export const getIcoDimensions = (width: number, height: number) => {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new RangeError("Image dimensions must be positive numbers");
  }

  const scale = Math.min(1, 256 / width, 256 / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
};

export const createIcoBlob = (pngBlob: Blob, width: number, height: number) => {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1 ||
    width > 256 ||
    height > 256
  ) {
    throw new RangeError("ICO image dimensions must be between 1 and 256");
  }

  const header = new ArrayBuffer(22);
  const view = new DataView(header);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);
  view.setUint8(6, width === 256 ? 0 : width);
  view.setUint8(7, height === 256 ? 0 : height);
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, pngBlob.size, true);
  view.setUint32(18, 22, true);

  return new Blob([header, pngBlob], { type: "image/x-icon" });
};
