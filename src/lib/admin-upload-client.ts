interface UploadAdminImageParams {
  file: File;
  token?: string | null;
  onProgress?: (progress: number) => void;
}

interface UploadAdminImageResult {
  url: string;
}

function parseUploadResponse(responseText: string): { url?: string; error?: string; message?: string } {
  try {
    return JSON.parse(responseText || "{}");
  } catch {
    return {};
  }
}

export function uploadAdminImage({
  file,
  token,
  onProgress,
}: UploadAdminImageParams): Promise<UploadAdminImageResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    onProgress?.(0);

    xhr.open("POST", "/api/admin/upload");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const progress = Math.min(99, Math.max(1, Math.round((event.loaded / event.total) * 100)));
      onProgress?.(progress);
    };

    xhr.onload = () => {
      const data = parseUploadResponse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300 && data.url) {
        onProgress?.(100);
        resolve({ url: data.url });
        return;
      }

      reject(new Error(data.error || data.message || "Upload failed"));
    };

    xhr.onerror = () => {
      reject(new Error("Cannot connect to upload server"));
    };

    xhr.send(formData);
  });
}
