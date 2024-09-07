import { useEffect } from 'react';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';

const LoadFlashcardGroupsSystem = () => {
  const { isUsingSupabaseData, isUsingMockupData } = useCurrentDataSource();

  useEffect(() => {}, [isUsingMockupData, isUsingSupabaseData]);

  return null;
};

export default LoadFlashcardGroupsSystem;
