import styled from "@emotion/styled";
import { PropsWithChildren } from "react";
import tw from "twin.macro";

const StyledOptionRowWrapper = styled.div<{
  destructive?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  hasSpace?: boolean;
}>`
  ${tw`flex justify-between p-2 w-full cursor-pointer hover:bg-[rgb(235,232,233)] border-[rgb(223,221,222)]`}
  ${({ destructive }) => destructive && tw`text-[#FF3B30]`};
  ${({ isFirst }) => isFirst && tw`rounded-t-lg pt-3`};
  ${({ isLast }) => (isLast ? tw`rounded-b-lg` : tw`border-b`)};
  ${({ hasSpace }) => hasSpace && tw`border-b-8`};
`;
const StyledOptionRowIcon = styled.div`
  ${tw`text-xl mr-1`}
`;
const StyledOptionRowText = styled.p`
  ${tw`text-base`}
`;

interface OptionRowProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
  hasSpace?: boolean;
  destructive?: boolean;
}

const OptionRow = (props: PropsWithChildren & OptionRowProps) => {
  const { children, onClick, icon, destructive, isLast, isFirst, hasSpace } =
    props;

  return (
    <StyledOptionRowWrapper
      onClick={onClick}
      destructive={destructive}
      isFirst={isFirst}
      isLast={isLast}
    >
      <StyledOptionRowText>{children}</StyledOptionRowText>
      <StyledOptionRowIcon>{icon}</StyledOptionRowIcon>
    </StyledOptionRowWrapper>
  );
};

export default OptionRow;
