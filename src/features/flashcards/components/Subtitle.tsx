import styled from "@emotion/styled";
import { PropsWithChildren } from "react";
import tw from "twin.macro";

const StyledSubtitle = styled.div`
  ${tw`text-xl text-black text-opacity-60`}
`;

const Subtitle = (props: PropsWithChildren) => {
  return <StyledSubtitle>{props.children}</StyledSubtitle>;
};

export default Subtitle;
