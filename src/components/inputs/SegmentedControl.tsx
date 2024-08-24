import styled from '@emotion/styled/macro';
import tw from 'twin.macro';

export const SegmentedControl = styled.div`
  ${tw` w-full h-9  px-0.5 md:w-96 flex  transition-all justify-between rounded-full mt-4 dark:bg-seconderyDark dark:text-primaryTextDark  bg-tertiary`}
`;

export const SegmentedControlCell = styled.div<{
  active: boolean;
  first?: boolean;
  leftNeighbourActive?: boolean;
}>`
  ${tw`w-1/2 border-primaryBorder transition-all justify-center dark:border-primaryBorderDark my-0.5 flex items-center text-center cursor-pointer`}
  ${({ active }) => active && tw`bg-white dark:bg-tertiaryDark shadow rounded-full`}
  ${({ first, active, leftNeighbourActive }) => !leftNeighbourActive && !first && !active && tw`border-l`}
`;
