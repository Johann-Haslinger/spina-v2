import styled from '@emotion/styled';
import { PropsWithChildren, ReactNode } from 'react';
import tw from 'twin.macro';

type Role = 'default' | 'destructive' | 'button';

const StyledSectionRowWrapper = styled.div<{ role: Role }>`
  ${tw`flex  cursor-pointer pl-2 items-center min-h-8  pr-0 w-full`}
  ${({ role }) => role === 'destructive' && tw` text-red-500   cursor-pointer md:hover:opacity-50 transition-all`}
  ${({ role }) =>
    role === 'button' &&
    tw`text-primary-color cursor-pointer dark:text-primary-text-dark md:hover:opacity-50 transition-all `}
`;

const StyledIconWrapper = styled.div<{ role: Role }>`
  ${tw`text-xl  dark:text-white text-primary-color ml-3`}
  ${({ role }) => role === 'destructive' && tw` !text-red-500`}
`;

const StyledSectionRowContent = styled.div<{ last: boolean }>`
  ${tw`flex w-full ml-3 px-2 py-2 h-fit justify-between pr-3`}
  ${({ last }) => !last && tw` border-b-[0.5px] transition-all border-primary-border dark:border-primary-border-dark`}
`;

interface SectionRowProps {
  last?: boolean;
  role?: Role;
  icon?: ReactNode;
  onClick?: () => void;
}
const SectionRow = (props: PropsWithChildren & SectionRowProps) => {
  const { children, role = 'default', icon, onClick, last = false } = props;

  return (
    <StyledSectionRowWrapper onClick={onClick} role={role}>
      {icon && <StyledIconWrapper role={role}>{icon}</StyledIconWrapper>}
      <StyledSectionRowContent last={last}>{children}</StyledSectionRowContent>
    </StyledSectionRowWrapper>
  );
};

export default SectionRow;
