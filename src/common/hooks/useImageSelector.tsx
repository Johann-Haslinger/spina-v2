export const useImageSelector = (onImageSelect: (image: string) => void) => {
  const handleImageUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        onImageSelect(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const openImagePicker = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', handleImageUpload);
    fileInput.click();
  };

  return {
    openImagePicker,
  };
};
