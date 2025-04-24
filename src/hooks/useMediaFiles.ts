import { ChangeEvent, useEffect, useState } from "react";

export const useMediaFiles = (initialMediaUrls: string[] = []) => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialMediaUrls);
  const [keptInitialUrls, setKeptInitialUrls] =
    useState<string[]>(initialMediaUrls);

  // Handle media file changes
  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setMediaFiles((prevFiles) => [...prevFiles, ...files]);

    // Generate preview URLs for new files only
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
  };

  // Remove a media file or initial URL
  const removeMediaFile = (index: number) => {
    const isInitialUrl = index >= mediaFiles.length;

    if (isInitialUrl) {
      // Remove from kept initial URLs
      const initialUrlIndex = index - mediaFiles.length;
      setKeptInitialUrls((prev) =>
        prev.filter((_, i) => i !== initialUrlIndex)
      );
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Remove new file
      setMediaFiles((prev) => prev.filter((_, i) => i !== index));
      setPreviewUrls((prev) => {
        URL.revokeObjectURL(prev[index]);
        return prev.filter((_, i) => i !== index);
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (!initialMediaUrls.includes(url)) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // Return the media files, preview URLs, and functions to handle changes and removal
  return {
    mediaFiles,
    previewUrls,
    handleMediaChange,
    removeMediaFile,
    keptInitialUrls,
  };
};
