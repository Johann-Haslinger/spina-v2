import styled from "@emotion/styled";
import React, { PropsWithChildren } from "react";
import tw from "twin.macro";

const StyledTitle = styled.div`
  ${tw`text-4xl dark:text-white text-primatyText font-black`}
`;

interface TitleProps {
  color?: string;
}

const Title = (props: PropsWithChildren & TitleProps) => {
  const { color, children } = props;
  return (
    <StyledTitle
      style={{
        color: color,
      }}
    >
      {children}
    </StyledTitle>
  );
};

export default Title;
