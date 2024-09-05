import { useEffect, useState } from 'react';

export const useSelection = () => {
  const [hasSelection, setHasSelection] = useState<boolean>(false);

  const checkSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setHasSelection(true);
    } else {
      setHasSelection(false);
    }
  };

  useEffect(() => {
    checkSelection();

    document.addEventListener('selectionchange', checkSelection);

    return () => {
      document.removeEventListener('selectionchange', checkSelection);
    };
  }, []);

  return hasSelection;
};
