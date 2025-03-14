import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { TextFacet } from '@leanscope/ecs-models';
import { ChangeEvent, Fragment, useContext, useEffect, useRef, useState } from 'react';
import { IoArrowUp, IoClose } from 'react-icons/io5';
import tw from 'twin.macro';

import { AdditionalTag } from '../../../common/types/enums';
import { FlexBox } from '../../../components';
import { useCurrentSapientorConversation } from '../hooks/useCurrentConversation';

const StyledPromptBoxContainer = styled.div`
  ${tw`w-full space-x-2 mb-8 mt-4  flex h-fit items-end`}
`;

const StyledPromptBoxWrapper = styled.div<{ isChatSheetVisible: boolean }>`
  ${tw`h-fit pl-4   bg-tertiary dark:bg-tertiary-dark  rounded-3xl `}
  ${({ isChatSheetVisible }) => (isChatSheetVisible ? tw` w-[90%]  pr-1.5 py-1` : tw`w-full pr-1`)}
`;

const StyledPromptInput = styled.input`
  ${tw`h-8 pr-4 w-[90%] placeholder:text-secondary-text placeholder:text-opacity-50 dark:text-white dark:placeholder:text-secondary-text-dark bg-white bg-opacity-0 outline-none`}
`;

const StyledSubmitButton = styled.button<{ active: boolean }>`
  ${tw` transition-all flex justify-center items-center text-xl size-7  text-white text-opacity-50 dark:text-black  rounded-full`}
  ${({ active }) =>
    active
      ? tw`dark:bg-white text-white bg-black dark:bg-opacity-80 hover:opacity-50`
      : tw` dark:bg-white bg-black bg-opacity-10  dark:bg-opacity-10 dark:text-opacity-60  `}
`;

const StyledSelectedImage = styled.img`
  ${tw`size-14  rounded-xl object-cover `}
`;

const StyledStyledCancelButton = styled.button`
  ${tw`bg-black relative right-3.5 bottom-2 text-secondary-text dark:text-secondary-text-dark rounded-full p-1 text-sm  hover:opacity-50 transition-all`}
`;

const StyledImageContainer = styled.div`
  ${tw`flex h-14 mb-2 mt-4 relative items-start`}
`;

const usePromptBoxRef = (isVisible: boolean) => {
  const promptInputRef = useRef<HTMLInputElement>(null);

  const focusPromptBox = () => {
    promptInputRef.current?.focus();
  };

  useEffect(() => {
    if (isVisible) {
      focusPromptBox();
    }
  }, [isVisible]);

  return { promptInputRef };
};
const SapientorPromptBox = (props: { isVisible: boolean }) => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = props.isVisible;
  const { promptInputRef } = usePromptBoxRef(isVisible);
  const [prompt, setPrompt] = useState('');
  const { isChatSheetVisible } = useCurrentSapientorConversation();
  const [isSelectingImageSrc, setIsSelectingImageSrc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);

  const removeSelectedImage = () => setSelectedImageSrc(null);

  useEffect(() => {
    if (isSelectingImageSrc && fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  }, [isSelectingImageSrc]);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const image = new Image();
      image.src = reader.result as string;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const maxWidth = 1080;
        const maxHeight = 180;

        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        context?.drawImage(image, 0, 0, width, height);

        const resizedImage = canvas.toDataURL('image/jpeg');

        setSelectedImageSrc(resizedImage);
      };
    };

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
    setIsSelectingImageSrc(false);
    return '';
  };

  // TODO: Implement file picker for image upload

  // const openFilePicker = () => {
  //   setIsSelectingImageSrc(true);
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };

  const submitPrompt = () => {
    if (prompt === '') return;
    const newPromptEntity = new Entity();
    lsc.engine.addEntity(newPromptEntity);
    newPromptEntity.add(new TextFacet({ text: prompt }));
    newPromptEntity.addTag(AdditionalTag.PROMPT);

    setPrompt('');
  };

  return (
    <Fragment>
      <StyledPromptBoxContainer>
        <StyledPromptBoxWrapper isChatSheetVisible={isChatSheetVisible}>
          {selectedImageSrc && (
            <StyledImageContainer>
              <StyledSelectedImage src={selectedImageSrc} />
              <StyledStyledCancelButton onClick={removeSelectedImage}>
                <IoClose />
              </StyledStyledCancelButton>
            </StyledImageContainer>
          )}
          <FlexBox>
            {' '}
            {/* {isChatSheetVisible && (
              <StyledAddResourceButton onClick={openFilePicker}>
                <IoAttachOutline />
              </StyledAddResourceButton>
            )} */}
            <StyledPromptInput
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              ref={promptInputRef}
              placeholder="Type a message"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  submitPrompt();
                }
              }}
            />
            <StyledSubmitButton onClick={submitPrompt} active={prompt !== ''}>
              <IoArrowUp />
            </StyledSubmitButton>
          </FlexBox>
        </StyledPromptBoxWrapper>
      </StyledPromptBoxContainer>
      {isSelectingImageSrc && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
      )}
    </Fragment>
  );
};

export default SapientorPromptBox;
