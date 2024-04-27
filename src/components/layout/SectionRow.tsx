import styled from "@emotion/styled";
import { PropsWithChildren, ReactNode } from "react";
import tw from "twin.macro";

type Type = "default" | "last";
type Role = "default" | "destructive";

const StyledSectionRowWrapper = styled.div<{ role: Role; type: Type }>`
  ${tw`flex py-1 min-h-8  pr-0 w-full`}
  ${({ role }) => role === "destructive" && tw`text-red-500`}
`;

const StyledIconWrapper = styled.div`
  ${tw`text-2xl ml-3`}
`;

const StyledSectionRowContent = styled.div<{ type: Type }>`
  ${tw`flex w-full ml-5 px-2  h-fit justify-between pr-3`}
  ${({ type }) =>
    type !== "last" && tw` border-b-[0.5px] border-[rgb(198,198,200)]`}
`;

interface SectionRowProps {
  type?: Type;
  role?: Role;
  icon?: ReactNode;
}
const SectionRow = (props: PropsWithChildren & SectionRowProps) => {
  const { children, role = "default", icon, type = "default" } = props;

  return (
    <StyledSectionRowWrapper type={type} role={role}>
      {icon && <StyledIconWrapper>{icon}</StyledIconWrapper>}
      <StyledSectionRowContent type={type}>{children}</StyledSectionRowContent>
    </StyledSectionRowWrapper>
  );
};

export default SectionRow;
