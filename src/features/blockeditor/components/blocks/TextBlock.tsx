import { EntityProps } from "@leanscope/ecs-engine";
import { FloatOrderProps } from "@leanscope/ecs-models";
import BlockOutline from "./BlockOutline";
import BlockTexteditor from "./BlockTexteditor";

const TextBlock = (props: EntityProps & FloatOrderProps) => {
  const { entity, index } = props;
  
  return (
    <BlockOutline index={index || 0} blockEntity={entity}>
      <BlockTexteditor {...props} />
    </BlockOutline>
  );
};

export default TextBlock;
