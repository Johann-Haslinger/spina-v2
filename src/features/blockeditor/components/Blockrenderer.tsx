import { EntityProps } from "@leanscope/ecs-engine";
import { FloatOrderProps } from "@leanscope/ecs-models";
import { BlocktypeProps } from "../../../app/a";
import { Blocktypes } from "../../../base/enums";
import { ListBlock, TextBlock, TodoBlock } from "./blocks";

const BlockRenderer = (props: BlocktypeProps & FloatOrderProps & EntityProps) => {
  const { blocktype } = props;

  switch (blocktype) {
    case Blocktypes.TEXT:
      return <TextBlock {...props} />;
    case Blocktypes.TODO:
      return <TodoBlock {...props} />;
    case Blocktypes.LIST:
      return <ListBlock {...props} />;
    default:
      return <div />;
  }
};

export default BlockRenderer;
