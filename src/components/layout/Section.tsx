import styled from "@emotion/styled/macro";
import { PropsWithChildren } from "react";
import tw from "twin.macro";

const StyledSectionWrapper = styled.div`
  ${tw`mt-1 rounded-xl py-1.5   bg-secondery text-primatyText dark:text-primaryTextDark dark:bg-primaryDark w-full`}
`;

const Section = (props: PropsWithChildren) => {
  const { children } = props;

  return <StyledSectionWrapper>{children}</StyledSectionWrapper>;
};

export default Section;
