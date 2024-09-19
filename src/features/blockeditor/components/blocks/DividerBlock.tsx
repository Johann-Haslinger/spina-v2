import styled from '@emotion/styled';
import { EntityProps } from '@leanscope/ecs-engine';
import { FloatOrderProps } from '@leanscope/ecs-models';
import tw from 'twin.macro';
import BlockOutline from './BlockOutline';

const StyledDivider = styled.div`
  ${tw`w-full h-0.5 my-4 border-t border-primary-border opacity-70 dark:border-primary-border-dark`}
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
