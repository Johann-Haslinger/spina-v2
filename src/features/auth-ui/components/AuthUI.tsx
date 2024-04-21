import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../../../lib/supabase";
import { useEffect, useState } from "react";
import styled from "@emotion/styled/macro";
import tw from "twin.macro";

const StyledAuthWrapper = styled.div`
  ${tw`flex justify-center items-center h-screen`}
`;

function AuthUI() {
  const [isVisible, setIsVisible] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsVisible(true);
  //   }, 1000);
  // }, []);

  return (
    isVisible && (
      <StyledAuthWrapper>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={[]}
        />
      </StyledAuthWrapper>
    )
  );
}

export default AuthUI;
