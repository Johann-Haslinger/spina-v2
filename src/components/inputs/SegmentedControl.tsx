import styled from '@emotion/styled/macro';
import tw from 'twin.macro';

export const SegmentedControlCell = styled.div<{
  active: boolean;
  first?: boolean;
  leftNeighbourActive?: boolean;
}>`
  ${tw`w-1/2 border-primaryBorder dark:border-primaryBorderDark my-0.5 py-0.5 text-center cursor-pointer`}
  ${({ active }) => active && tw`bg-white dark:bg-tertiaryDark shadow rounded-lg`}
  ${({ first, active, leftNeighbourActive }) => !leftNeighbourActive && !first && !active && tw`border-l`}
`;

export const SegmentedControl = styled.div`
  ${tw` w-full h-8  px-0.5 md:w-96 flex justify-between rounded-lg mt-4 dark:bg-seconderyDark dark:text-primaryTextDark  bg-tertiary`}
`;
