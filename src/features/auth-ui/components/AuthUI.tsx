import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../../../lib/supabase";
import { useEffect, useState } from "react";
import styled from "@emotion/styled/macro";
import tw from "twin.macro";

const StyledAuthWrapper = styled.div`
  ${tw`flex bg-black justify-center items-center h-screen`}
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
            // className: {
            //   container: {
            //     width: "80px",
            //   },
            //   button: {
            //     width: "2px",

            //   }
            // },
          }}
          theme="dark"
          // providers={["google"]}
          providers={[]}
        />
      </StyledAuthWrapper>
    )
  );
}

export default AuthUI;
