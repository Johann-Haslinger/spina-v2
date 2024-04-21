import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'

import tw from 'twin.macro'

const StyledFlexBox = styled.div`
    ${tw`flex w-full items-center justify-between h-fit`}
`
const FlexBox = (props: PropsWithChildren) => <StyledFlexBox>{props.children}</StyledFlexBox>

export default FlexBox