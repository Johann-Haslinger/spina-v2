import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import { Sheet } from '../../../components';
import tw from 'twin.macro';

const StyledIcon = styled.div`
  ${tw`text-9xl mt-40 xl:mt-48 2xl:mt-56 w-fit mx-auto text-orange-500`}
`;

const StyledTitle = styled.p`
  ${tw`text-2xl mt-8 w-full text-center font-bold`}
`;

const StyledMessage = styled.p`
  ${tw`mt-2 w-full text-center text-lg`}
`;

const NoNetworkAlert = () => {
  const isOffline = useOfflineStatus();

  return (
    <Sheet visible={isOffline} navigateBack={() => {}}>
      <StyledIcon>
        <IoWarningOutline />
      </StyledIcon>
      <StyledTitle>Keine Internetverbindung</StyledTitle>
      <StyledMessage>
        Bitte stelle eine Verbindung zum Internet her, <br /> um Spina weiter zu nutzen.
      </StyledMessage>
    </Sheet>
  );
};

export default NoNetworkAlert;

const useOfflineStatus = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
};
