import { useEffect, useRef, useState } from 'react';
import { UploadedFile } from '../../../common/types/types';
export const useFileSelector = (onFileSelect: (file: UploadedFile) => void, onlyAllowImages?: boolean) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSelectingImageSrc, setIsSelectingImageSrc] = useState(false);

  useEffect(() => {
    if (isSelectingImageSrc && fileInputRef.current !== null) {
      fileInputRef.current.click();
      setIsSelectingImageSrc(false);
    }
  }, [isSelectingImageSrc]);

  const openFilePicker = () => {
    setIsSelectingImageSrc(true);
  };

  const resizeImage = (file: File, maxWidth: number, maxHeight: number, callback: (file: File) => void) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, { type: file.type });
            callback(resizedFile);
          }
        }, file.type);
      }
    };

    img.src = url;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const isValidType = ['application/pdf', 'image/png', 'image/jpeg'].includes(file.type);

        if (isValidType) {
          if (file.type.startsWith('image')) {
            resizeImage(file, 1920, 1080, (resizedFile) => {
              const url = URL.createObjectURL(resizedFile);
              onFileSelect({ id: Date.now().toString(), file: resizedFile, url, type: file.type });
            });
          } else {
            const url = URL.createObjectURL(file);
            onFileSelect({ id: Date.now().toString(), file, url, type: file.type });
          }
        } else {
          console.warn('Invalid file type or size');
        }
      });

      event.target.value = '';
    }
  };

  const fileInput = (
    <input
      type="file"
      ref={fileInputRef}
      multiple
      onChange={handleFileChange}
      style={{ display: 'none' }}
      accept={onlyAllowImages ? 'image/*' : 'image/*,application/pdf'}
    />
  );

  return { openFilePicker, fileInput };
};
