import { EntityProps } from '@leanscope/ecs-engine';
import { FloatOrderProps } from '@leanscope/ecs-models';
import BlockOutline from './BlockOutline';
import styled from '@emotion/styled';
import tw from 'twin.macro';

const StyledDivider = styled.div`
  ${tw`w-full h-0.5 my-4 border-t border-primaryBorder opacity-70 dark:border-primaryBorderDark`}
`;

const DividerBlock = (props: EntityProps & FloatOrderProps) => {
  const { entity, index } = props;

  return (
    <BlockOutline blockEntity={entity} index={index}>
      <StyledDivider />
    </BlockOutline>
  );
};

export default DividerBlock;
