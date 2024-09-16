import { useEffect, useState } from 'react';
import { MEDIUM_DEVICE_WIDTH } from '../base/constants';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowDimensions.width < MEDIUM_DEVICE_WIDTH;

  return { width: windowDimensions.width, isMobile };
}
