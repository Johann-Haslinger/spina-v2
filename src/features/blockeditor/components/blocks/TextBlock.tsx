import { EntityProps } from "@leanscope/ecs-engine";
import { FloatOrderProps, ParentProps, TextProps } from "@leanscope/ecs-models";
import BlockOutline from "./BlockOutline";
import BlockTexteditor from "./BlockTexteditor";

const TextBlock = (props: TextProps & EntityProps  & ParentProps  & FloatOrderProps) => {
  const { entity, index } = props;
  return (
    <BlockOutline index={index || 0} blockEntity={entity}>
      <BlockTexteditor {...props} />
    </BlockOutline>
  );
};

export default TextBlock;
