import styled from '@emotion/styled/macro';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import tw from 'twin.macro';
import supabaseClient from '../../../lib/supabase';

const StyledAuthWrapper = styled.div`
  ${tw`flex  h-screen w-screen justify-center items-center`}
`;

function AuthUI() {
  return (
    <StyledAuthWrapper>
      <Auth
        tw="w-2/3"
        supabaseClient={supabaseClient}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'black',
                brandAccent: 'black',
              },
            },
          },
        }}
        theme="light"
        providers={[]}
      />
    </StyledAuthWrapper>
  );
}

export default AuthUI;
