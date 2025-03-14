import styled from '@emotion/styled/macro';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import tw from 'twin.macro';
import { Story } from '../../common/types/enums';
import CloseButton from '../buttons/CloseButton';
import FlexBox from '../layout/FlexBox';
import Sheet from '../presentation/Sheet';

const StyledDoneIcon = styled.div`
  ${tw` w-full h-full items-center flex justify-center text-primary-color lg:text-[11rem] text-9xl pb-20`}
`;

const SucessSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisibile = useIsStoryCurrent(Story.SUCCESS_STORY);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_COLLECTION_STORY);

  return (
    <Sheet visible={isVisibile} navigateBack={navigateBack}>
      <FlexBox>
        <div />
        <CloseButton onClick={navigateBack} />
      </FlexBox>
      <StyledDoneIcon onClick={navigateBack}>
        <IoCheckmarkCircle />
      </StyledDoneIcon>
    </Sheet>
  );
};

export default SucessSheet;
