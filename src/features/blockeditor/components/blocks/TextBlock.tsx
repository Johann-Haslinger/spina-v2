import { EntityProps } from '@leanscope/ecs-engine'
import { OrderProps, TextProps } from '@leanscope/ecs-models'
import BlockOutline from './BlockOutline'

const TextBlock = (props: TextProps & EntityProps & OrderProps) => {
  const { text, entity, orderIndex } = props
  return (
   <BlockOutline index={orderIndex || 0} blockEntity={entity}>
      {text}
   </BlockOutline>
  )
}

export default TextBlock