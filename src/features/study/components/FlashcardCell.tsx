import styled from '@emotion/styled'
import { AnswerProps, MasteryLevelProps, QuestionProps } from '../../../app/AdditionalFacets'
import { EntityProps } from '@leanscope/ecs-engine'
import tw from 'twin.macro'

const StyledFlashcardCellWrapper = styled.div`
 ${tw`w-1/3 h-40 bg-black p-1`}
`


const FlashcardCell = (props: QuestionProps & AnswerProps & EntityProps & MasteryLevelProps) => {
  const { question, answer, entity, masteryLevel } = props

  return (
  <StyledFlashcardCellWrapper>
    <div>{question}</div>
    <div>{answer}</div>
    <div>{masteryLevel}</div>
  </StyledFlashcardCellWrapper>
  )
}

export default FlashcardCell