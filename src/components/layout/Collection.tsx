import styled from "@emotion/styled";
import React, { PropsWithChildren } from "react";
import tw from "twin.macro";

const StyledCollectionWrapper = styled.div`
  ${tw`flex w-full flex-wrap`}
`;

const Collection = (props: PropsWithChildren) => {
  const { children } = props;

  return <StyledCollectionWrapper>{children}</StyledCollectionWrapper>;
};

export default Collection;
