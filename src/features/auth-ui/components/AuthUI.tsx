import styled from '@emotion/styled/macro';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { motion } from 'framer-motion';
import { useState } from 'react';
import tw from 'twin.macro';
import { useSession } from '../../../common/hooks/useSession';
import { Story } from '../../../common/types/enums';
import { Sheet } from '../../../components';
import supabaseClient from '../../../lib/supabase';
import { useSelectedTheme } from '../../collection/hooks/useSelectedTheme';

const TERMS_OF_USE_LINK = 'https://spina.ai/terms-of-use';
const PRIVACY_LINK = 'https://spina.ai/privacy';

const CODE1 = '5295';
const CODE2 = '6783';

const StyledAuthWrapper = styled.div`
  ${tw`w-full h-fit`}
`;

const StyledContainer = styled.div`
  ${tw`w-full h-full`}
`;

const StyledMotionDiv = styled(motion.div)`
  ${tw`w-full h-full flex flex-col justify-between pb-10 lg:px-14 xl:px-32`}
`;

const StyledHeading = styled.p`
  ${tw`mx-auto w-fit text-center xl:pt-32 pt-20 xl:text-4xl lg:text-4xl text-3xl font-bold`}
`;

const StyledSubHeading = styled.p`
  ${tw`mx-auto mt-4 lg:text-lg xl:text-lg xl:mt-5 text-center w-fit text-secondary-text dark:text-secondary-text-dark`}
`;

const StyledInputWrapper = styled.div`
  ${tw`w-full pb-10 h-fit`}
`;

const StyledInput = styled.input`
  ${tw`w-full outline-none border-[rgb(211,211,211)] dark:border-primary-border-dark dark:placeholder:text-placeholder-text-dark transition-all placeholder:text-placeholder-text hover:border-[rgb(128,128,128)] h-10 rounded-full border bg-white bg-opacity-0 px-4`}
`;

const StyledButton = styled.div<{ isActive: boolean }>`
  ${tw`bg-black dark:bg-tertiary-dark transition-all  w-full mt-6 h-10 text-sm rounded-full flex justify-center items-center text-white `}
  ${({ isActive }) => (isActive ? tw`cursor-pointer` : tw`dark:opacity-60 opacity-20`)}
`;

const AuthUI = () => {
  const { isLoggedIn } = useSession();
  const [input, setInput] = useState('');
  const [isCodeEntered, setIsCodeEntered] = useState(false);
  const { isDarkModeActive } = useSelectedTheme();
  const isAddingToHomeScreen = useIsStoryCurrent(Story.OBSERVING_ADD_TO_HOME_SCREEN_STORY);

  const transition = {
    type: 'spring',
    stiffness: 200,
    damping: 20,
    duration: 0.5,
  };

  const isVisible = isLoggedIn == false && !isAddingToHomeScreen;

  return (
    isLoggedIn !== null && (
      <div>
        <Sheet visible={isVisible} navigateBack={() => {}}>
          <StyledContainer>
            <StyledMotionDiv
              animate={{
                y: isCodeEntered ? '-100%' : 0,
                opacity: isCodeEntered ? 0 : 1,
              }}
              transition={transition}
            >
              <div>
                <StyledHeading>Willkommen bei Spina!</StyledHeading>
                <StyledSubHeading>Gib den Zugangscode ein, um loszulegen 🚀 </StyledSubHeading>
              </div>
              <StyledInputWrapper>
                <StyledInput
                  type="text"
                  placeholder="Zugangscode"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <StyledButton
                  isActive={input !== ''}
                  onClick={() => (input == CODE1 || input == CODE2) && setIsCodeEntered(true)}
                >
                  Weiter
                </StyledButton>
              </StyledInputWrapper>
            </StyledMotionDiv>
            <StyledMotionDiv
              initial={{
                y: 0,
              }}
              transition={transition}
              animate={{
                y: isCodeEntered ? '-100%' : 0,
                opacity: !isCodeEntered ? 0 : 1,
              }}
            >
              <div>
                <StyledHeading>Schön, dass du dabei bist!</StyledHeading>
                <StyledSubHeading>Melde dich an oder registriere dich, um fortzufahren </StyledSubHeading>
              </div>
              <StyledAuthWrapper>
                <Auth
                  supabaseClient={supabaseClient}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: isDarkModeActive ? '#232323' : 'black',
                          brandAccent: isDarkModeActive ? '#232323' : 'black',
                          inputLabelText: isDarkModeActive ? '#1A1A1A' : '#F6F6F6',
                          defaultButtonBackgroundHover: isDarkModeActive ? '#23232390' : '#00000090',
                        },
                        radii: {
                          borderRadiusButton: '1.5rem',
                          inputBorderRadius: '1.5rem',
                          buttonBorderRadius: '1.5rem',
                        },
                        space: {
                          emailInputSpacing: '0px',
                          labelBottomMargin: '0px',
                        },
                      },
                    },
                  }}
                  theme={isDarkModeActive ? 'dark' : 'light'}
                  providers={[]}
                />

                <p tw="text-secondary-text mt-2 text-center w-full text-xs">
                  Durch die Anmeldung stimmst du unseren{' '}
                  <b>
                    <a target="_blank" href={TERMS_OF_USE_LINK}>
                      Nutzungsbedingungen
                    </a>
                  </b>{' '}
                  <br />
                  und{' '}
                  <b>
                    <a target="_blank" href={PRIVACY_LINK}>
                      Datenschutzrichtlinien
                    </a>
                  </b>{' '}
                  zu.
                </p>
              </StyledAuthWrapper>
            </StyledMotionDiv>
          </StyledContainer>
        </Sheet>
      </div>
    )
  );
};

export default AuthUI;
