import styled from '@emotion/styled';
import { IoArrowForward } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import tw from 'twin.macro';
import { View } from '../components';

const StyledSuccessAlertWrapper = styled.div`
  ${tw`flex items-center justify-center w-full h-full pt-40`}
`;

const StyledSuccessAlert = styled.div`
  ${tw`p-4 flex flex-col justify-between h-40 w-80 rounded-2xl bg-tertiary dark:bg-secondary-dark`}
`;

const SuccessPage = () => {
  return (
    <View viewType="baseView">
      <StyledSuccessAlertWrapper>
        <StyledSuccessAlert>
          <div>
            <p tw="font-semibold">
              <span tw="mr-1">🎉</span> Nachricht gesendet
            </p>
            <p tw="text-secondary-text mt-1 dark:text-secondary-text-dark">
              Deine Nachricht wurde erfolgreich gesendet!
            </p>
          </div>

          <NavLink tw="flex space-x-4 items-center text-primary-color hover:opacity-50 transition-all" to="/">
            <div tw="text-lg">
              <IoArrowForward />
            </div>
            <p> Zurück zur Startseite</p>
          </NavLink>
        </StyledSuccessAlert>
      </StyledSuccessAlertWrapper>
    </View>
  );
};

export default SuccessPage;
