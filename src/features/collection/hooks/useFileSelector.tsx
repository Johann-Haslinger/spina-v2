import { useEffect, useRef, useState } from 'react';

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  type: string;
}

export const useFileSelector = (onFileSelect: (file: UploadedFile) => void) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSelectingImageSrc, setIsSelectingImageSrc] = useState(false);

  useEffect(() => {
    if (isSelectingImageSrc && fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  }, [isSelectingImageSrc]);

  const openFilePicker = () => {
    setIsSelectingImageSrc(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        onFileSelect({ id: Date.now().toString(), file, url, type: file.type });
      });
    }
  };

  const fileInput = isSelectingImageSrc && (
    <input type="file" ref={fileInputRef} multiple onChange={handleFileChange} style={{ display: 'none' }} />
  );

  return { openFilePicker, fileInput };
};
