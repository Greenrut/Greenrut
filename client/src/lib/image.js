const CLOUDINARY_UPLOAD_PATH =
  /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload)(?:\/([^/]+))?(\/.*)$/i;

export function getImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image === "object") {
    return image.url || image.src || image.secureUrl || image.path || "";
  }
  return "";
}

export function getCloudinaryOptimizedUrl(url, options = {}) {
  if (!url || typeof url !== "string") return url;
  const match = url.match(CLOUDINARY_UPLOAD_PATH);
  if (!match) return url;

  const existingSegment = match[2] || "";
  const remainingPath = match[3] || "";
  const hasExistingTransform =
    existingSegment && !/^v\d+$/.test(existingSegment);
  const pathAfterUpload = hasExistingTransform
    ? remainingPath
    : `/${existingSegment}${remainingPath}`;

  const transformation = [
    options.width ? `w_${options.width}` : null,
    options.height ? `h_${options.height}` : null,
    options.crop ? `c_${options.crop}` : null,
    options.quality !== false ? "q_auto" : null,
    options.fetchFormat !== false ? "f_auto" : null,
    options.dpr ? `dpr_${options.dpr}` : null,
  ]
    .filter(Boolean)
    .join(",");

  if (!transformation) return url;
  return `${match[1]}/${transformation}${pathAfterUpload}`;
}

export function getImageSource(image, options = {}) {
  const url = getImageUrl(image);
  return getCloudinaryOptimizedUrl(url, options);
}
