import styled from '@emotion/styled/macro';
import tw from 'twin.macro';

const CollectionGrid = styled.div<{
  columnSize?: 'normal' | 'large' | 'small';
  gapSize?: 'normal' | 'large' | 'small';
}>`
  ${tw`  py-0.5 grid  gap-2 col-span-3 `}
  ${(props) => props.columnSize === 'large' && tw` grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}
  ${(props) => props.columnSize === 'small' && tw` grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6`}
${(props) => (props.columnSize === 'normal' || !props.columnSize) && tw`grid-cols-2 md:grid-cols-3 lg:grid-cols-4 `}
  ${(props) => props.gapSize === 'large' && tw` gap-3`}
  ${(props) => props.gapSize === 'small' && tw` gap-1.5`}
  ${(props) => (props.gapSize === 'normal' || !props.gapSize) && tw` gap-2`}
`;
export default CollectionGrid;
