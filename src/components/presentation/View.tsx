import styled from "@emotion/styled/macro";
import React, { PropsWithChildren } from "react";
import tw from "twin.macro";

const StyledViewWrapper = styled.div`
  ${tw`fixed top-0 left-0 w-screen h-screen bg-white`}
`;

interface ViewProps {
  viewType?: "baseView" | "overlayView";
}
const View = (props: ViewProps & PropsWithChildren) => {
  const { viewType = "overlayView", children } = props;

  return <StyledViewWrapper>{children}</StyledViewWrapper>;
};

export default View;
