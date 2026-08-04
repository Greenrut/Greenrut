import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { cloudinary } from "../config/cloudinary.js";
import { config } from "../config/env.js";
import { createHttpError } from "../utils/httpError.js";

function getExtension(filename = "", mimetype = "") {
  const ext = path.extname(filename).toLowerCase();
  if (ext) return ext;

  if (mimetype === "image/png") return ".png";
  if (mimetype === "image/webp") return ".webp";
  if (mimetype === "image/gif") return ".gif";
  return ".jpg";
}

function toUploadFile(file, index = 0) {
  if (!file) return null;

  if (Buffer.isBuffer(file)) {
    return {
      buffer: file,
      originalname: `upload-${index + 1}.jpg`,
      mimetype: "image/jpeg",
    };
  }

  if (file.buffer) {
    return file;
  }

  return null;
}

function buildLocalUrl(baseUrl, folder, filename) {
  const origin = String(
    baseUrl || "https://greenrut-vd7c.onrender.com",
  ).replace(/\/$/, "");
  const safeFolder = String(folder || "uploads").replace(/^\/+|\/+$/g, "");
  return `${origin}/uploads/${safeFolder}/${filename}`;
}

async function uploadToLocal(file, options = {}) {
  const folder = String(options.folder || "greenrut").replace(/^\/+|\/+$/g, "");
  const uploadRoot = path.resolve(process.cwd(), "uploads", folder);
  await mkdir(uploadRoot, { recursive: true });

  const filename = `${Date.now()}-${randomUUID()}${getExtension(file.originalname, file.mimetype)}`;
  const fullPath = path.join(uploadRoot, filename);
  await writeFile(fullPath, file.buffer);

  return {
    secure_url: buildLocalUrl(options.baseUrl, folder, filename),
    public_id: `${folder}/${filename}`,
    width: null,
    height: null,
    resource_type: "image",
    format: path.extname(filename).slice(1) || "jpg",
    provider: "local",
  };
}

function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resource_type || "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.on?.("error", reject);
    stream.end(buffer);
  });
}

async function uploadWithCloudinarySigned(file, options = {}) {
  const result = await uploadBuffer(file.buffer, {
    folder: options.folder,
    resource_type: "image",
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height,
    resource_type: result.resource_type,
    format: result.format,
    provider: "cloudinary",
  };
}

async function uploadWithCloudinaryUnsigned(file, options = {}) {
  const cloudName = config.cloudinary.cloudName;
  const uploadPreset =
    options.uploadPreset ||
    options.upload_preset ||
    config.cloudinary.uploadPreset ||
    process.env.CLOUDINARY_UPLOAD_PRESET ||
    "";

  if (!cloudName) {
    throw createHttpError(500, "Cloudinary cloud name is not configured");
  }

  if (!uploadPreset) {
    throw createHttpError(500, "Cloudinary upload preset is not configured");
  }

  const formData = new FormData();
  formData.append(
    "file",
    new Blob([file.buffer], {
      type: file.mimetype || "application/octet-stream",
    }),
    file.originalname || `upload-${Date.now()}`,
  );
  formData.append("upload_preset", uploadPreset);
  if (options.folder) {
    formData.append("folder", options.folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw createHttpError(
      response.status || 502,
      payload?.error?.message ||
        payload?.message ||
        "Cloudinary unsigned upload failed",
    );
  }

  return {
    secure_url: payload.secure_url,
    public_id: payload.public_id,
    width: payload.width,
    height: payload.height,
    resource_type: payload.resource_type,
    format: payload.format,
    provider: "cloudinary",
  };
}

function getCloudinaryUploadPreset(options = {}) {
  return (
    options.uploadPreset ||
    options.upload_preset ||
    config.cloudinary.uploadPreset ||
    process.env.CLOUDINARY_UPLOAD_PRESET ||
    ""
  );
}

export async function uploadImage(file, options = {}) {
  const uploadFile = toUploadFile(file);
  if (!uploadFile?.buffer) {
    throw createHttpError(400, "Image file is required");
  }

  const uploadPreset = getCloudinaryUploadPreset(options);
  const hasSignedCredentials = Boolean(
    config.cloudinary.cloudName &&
    config.cloudinary.apiKey &&
    config.cloudinary.apiSecret,
  );

  try {
    if (uploadPreset) {
      return await uploadWithCloudinaryUnsigned(uploadFile, {
        ...options,
        uploadPreset,
      });
    }

    if (hasSignedCredentials) {
      return await uploadWithCloudinarySigned(uploadFile, options);
    }
  } catch (error) {
    if (uploadPreset) {
      if (process.env.NODE_ENV === "production") {
        throw createHttpError(
          502,
          `Cloudinary upload failed: ${error?.message || "Unknown error"}`,
        );
      }

      console.warn(
        "Cloudinary upload failed, using local fallback:",
        error?.message || error,
      );
      return uploadToLocal(uploadFile, options);
    }

    if (process.env.NODE_ENV === "production") {
      throw createHttpError(
        502,
        `Cloudinary upload failed: ${error?.message || "Unknown error"}`,
      );
    }

    console.warn(
      "Cloudinary upload failed, using local fallback:",
      error?.message || error,
    );
    return uploadToLocal(uploadFile, options);
  }

  if (process.env.NODE_ENV === "production") {
    throw createHttpError(500, "Cloudinary is not configured on the server");
  }

  return uploadToLocal(uploadFile, options);
}

export async function uploadImages(files, options = {}) {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const uploads = await Promise.all(
    files.map((file, index) => uploadImage(toUploadFile(file, index), options)),
  );
  return uploads;
}
