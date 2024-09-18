import { useEffect, useState } from 'react';
import { useSession } from '../../hooks/useSession';

export const useIsLoadingIndicatorVisible = () => {
  const { isLoggedIn } = useSession();
  const [isLoadingIndicatorVisible, setIsLoadingIndicatorVisible] = useState(true);

  useEffect(() => {
    if (isLoggedIn !== null) {
      setTimeout(() => {
        setIsLoadingIndicatorVisible(false);
      }, 400);
    }
  }, [isLoggedIn]);

  return isLoadingIndicatorVisible
  // return true
};
