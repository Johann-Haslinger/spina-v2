import styled from "@emotion/styled";
import  { PropsWithChildren } from "react";
import tw from "twin.macro";

type size = "small" | "medium" | "large"; 


const StyledTitle = styled.div<{size: size}>`
  ${tw` dark:text-white text-primatyText font-black`}
  ${({size}) => size === "small" && tw`text-2xl`}
  ${({size}) => size === "medium" && tw`text-3xl`}
  ${({size}) => size === "large" && tw`text-4xl`}
`;


interface TitleProps {
  color?: string;
  size?: size
}

const Title = (props: PropsWithChildren & TitleProps) => {
  const { color, children, size = "medium" } = props;
  return (
    <StyledTitle
      size={size}
      style={{
        color: color,
      }}
    >
      {children}
    </StyledTitle>
  );
};

export default Title;
