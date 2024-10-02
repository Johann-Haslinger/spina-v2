import styled from '@emotion/styled/macro';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import tw from 'twin.macro';
import { Sheet } from '../../../components';
import { useSession } from '../../../hooks/useSession';
import supabaseClient from '../../../lib/supabase';

const StyledAuthWrapper = styled.div`
  ${tw`w-full h-fit `}
`;

function AuthUI() {
  const { isLoggedIn } = useSession();

  return (
    isLoggedIn !== null && (
      <div>
        <Sheet visible={isLoggedIn == false} navigateBack={() => {}}>
          <div tw="w-full h-full flex flex-col justify-between pb-10 lg:px-14 xl:px-32">
            <div tw="w-full">
              <p tw="mx-auto w-fit xl:pt-32 pt-20 xl:text-4xl text-3xl font-bold">Willkommen bei Spina!</p>
              <p tw="mx-auto mt-2 xl:text-lg xl:mt-5 text-center  w-fit  text-secondary-text dark:text-secondary-text-dark">
                Bitte melde dich an oder registriere dich, um fortzufahren 🚀
              </p>
            </div>
            <StyledAuthWrapper>
              <Auth
                supabaseClient={supabaseClient}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: 'black',
                        brandAccent: 'black',
                        inputLabelText: '#F6F6F6',
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
                theme="light"
                providers={[]}
              />
            </StyledAuthWrapper>
          </div>
        </Sheet>
      </div>
    )
  );
}

export default AuthUI;
