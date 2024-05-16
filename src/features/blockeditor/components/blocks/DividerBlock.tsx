import { EntityProps } from "@leanscope/ecs-engine";
import { FloatOrderProps } from "@leanscope/ecs-models";
import BlockOutline from "./BlockOutline";
import styled from "@emotion/styled";
import tw from "twin.macro";

const StyledDivider = styled.div`
  ${tw`w-full h-0.5 my-4 bg-gray-300 dark:bg-gray-600`}
`;

const DividerBlock = (props: EntityProps & FloatOrderProps) => {
  const { entity, index } = props;
  return (
    <BlockOutline blockEntity={entity} index={index}>
      <StyledDivider />
      knn,mn
    </BlockOutline>
  );
};

export default DividerBlock;
