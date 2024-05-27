import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabaseClient from "../../../lib/supabase";
import styled from "@emotion/styled/macro";
import tw from "twin.macro";

const StyledAuthWrapper = styled.div`
  ${tw`flex  justify-center items-center h-screen`}
`;

function AuthUI() {
  return (
    <StyledAuthWrapper>
      <Auth
        supabaseClient={supabaseClient}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#B9A0FF",
                brandAccent: "#B9A0FF",
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
