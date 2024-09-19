import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';
import tw from 'twin.macro';

const StyledActionRowWrapper = styled.div<{
  destructive?: boolean;
  first?: boolean;
  last?: boolean;
  hasSpace?: boolean;
}>`
  ${tw`flex pl-6 justify-between p-2 w-full cursor-pointer dark:hover:bg-[rgb(27,27,27)] md:hover:bg-[rgb(235,232,233)] border-primary-border dark:border-primary-border-dark `}
  ${({ destructive }) => destructive && tw`text-[#FF3B30]`};
  ${({ first }) => first && tw`rounded-t-lg pt-3`};
  ${({ last }) => (last ? tw`rounded-b-lg` : tw`border-b`)};
  ${({ hasSpace }) => hasSpace && tw`border-b-8`};
`;
const StyledActionRowIcon = styled.div`
  ${tw`text-xl mr-1`}
`;
const StyledActionRowText = styled.p`
  ${tw`text-base`}
`;

interface ActionRowProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  first?: boolean;
  last?: boolean;
  hasSpace?: boolean;
  destructive?: boolean;
}

const ActionRow = (props: PropsWithChildren & ActionRowProps) => {
  const { children, onClick, icon, destructive, last, first, hasSpace } = props;

  return (
    <StyledActionRowWrapper hasSpace={hasSpace} onClick={onClick} destructive={destructive} first={first} last={last}>
      <StyledActionRowText>{children}</StyledActionRowText>
      <StyledActionRowIcon>{icon}</StyledActionRowIcon>
    </StyledActionRowWrapper>
  );
};

export default ActionRow;
