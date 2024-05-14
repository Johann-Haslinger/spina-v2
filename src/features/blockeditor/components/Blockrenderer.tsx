import { EntityProps } from "@leanscope/ecs-engine";
import { FloatOrderProps, IdentifierProps, ParentProps, TextProps } from "@leanscope/ecs-models";
import { BlocktypeProps } from "../../../app/additionalFacets";
import { Blocktypes } from "../../../base/enums";
import { TextBlock, TodoBlock } from "./blocks";

const BlockRenderer = (
  props: IdentifierProps & BlocktypeProps & ParentProps & FloatOrderProps & TextProps & EntityProps
) => {
  const { blocktype } = props;

  switch (blocktype) {
    case Blocktypes.TEXT:
      return <TextBlock {...props} />;
    case Blocktypes.TODO:
      return <TodoBlock {...props} />;
    default:
      return <div />;
  }
};

export default BlockRenderer;
