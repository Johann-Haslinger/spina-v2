import styled from "@emotion/styled";
import tw from "twin.macro";

const NavigationButton = styled.button<{ isBlocked?: boolean }>`
  ${tw`bg-black dark:bg-white dark:text-black text-white w-full hover:opacity-80 transition-all font-semibold py-3 px-4 rounded-full mt-8 md:mt-12`}
  ${({ isBlocked }) => isBlocked && tw`opacity-20 pointer-events-none`}
`;

export default NavigationButton;
