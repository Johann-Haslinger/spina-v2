import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { motion } from 'framer-motion';
import { RefObject, useContext, useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';
import { COLOR_ITEMS } from '../../../../base/constants';
import { Story } from '../../../../base/enums';
import { useSelection } from '../../../../hooks/useSelection';

const rgbaToHex = (rgba: string) => {
  const parts = rgba.replace(/^rgba?\(|\s+|\)$/g, '').split(',');

  const r = parseInt(parts[0], 10).toString(16).padStart(2, '0');
  const g = parseInt(parts[1], 10).toString(16).padStart(2, '0');
  const b = parseInt(parts[2], 10).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`.toUpperCase();
};

const useClickOutside = (ref: RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [ref, callback]);
};

const useStyleUpdater = (isVisible: boolean, hasSelection: boolean) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const updateButtonStates = () => {
    const selection = window.getSelection();
    if (!selection) return;

    const parentElement = selection.anchorNode?.parentElement;

    if (parentElement) {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      const backgroundColor = parentElement.style.backgroundColor;
      const hexColor = rgbaToHex(backgroundColor);
      setSelectedColor(hexColor);
    }
  };

  useEffect(() => {
    if (isVisible) {
      const updateButtonStates = () => {
        const selection = window.getSelection();
        if (!selection) return;

        const parentElement = selection.anchorNode?.parentElement;

        if (parentElement) {
          setIsBold(document.queryCommandState('bold'));
          setIsItalic(document.queryCommandState('italic'));
          setIsUnderline(document.queryCommandState('underline'));
          const backgroundColor = parentElement.style.backgroundColor;
          const hexColor = rgbaToHex(backgroundColor);
          setSelectedColor(hexColor);
        }
      };

      updateButtonStates();
    } else {
      setIsBold(false);
      setSelectedColor(null);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!hasSelection) {
      setIsBold(false);
      setSelectedColor(null);
    }
  }, [hasSelection]);

  return { isBold, isItalic, isUnderline, selectedColor, updateButtonStates };
};

const StyledActionSheetWrapper = styled(motion.div)`
  ${tw`bg-[rgb(244,244,244)] mt-2  dark:bg-seconderyDark fixed top-12 md:right-24 right-4 w-48 dark:shadow-[0px_0px_60px_0px_rgba(255, 255, 255, 0.05)] shadow-[0px_0px_60px_0px_rgba(0,0,0,0.13)] text-primatyText dark:text-primaryTextDark  backdrop-blur-2xl rounded-xl`}
`;

const ColorButton = styled.button`
  ${tw`hover:opacity-50 size-6 m-1.5 rounded-full`}
`;

const ButtonContainer = styled.div`
  ${tw`flex flex-wrap justify-between p-3 border-b dark:border-primaryBorderDark border-primaryBorder`}
`;

const StyleOptionsContainer = styled.div`
  ${tw`flex space-x-2 px-1 py-3`}
`;

const StyledTextOptionButton = styled.button<{ isCurrent: boolean }>`
  ${tw`px-2 w-1/3 text-lg py-1 rounded text-seconderyText border-primaryBorder dark:border-primaryBorderDark dark:text-primaryTextDark`}
  ${({ isCurrent }) => isCurrent && tw`text-primaryColor border-primaryColor`}
`;

const StyleActionSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.EDITING_TEXT_STYLE_STORY);
  const refOne = useRef<HTMLDivElement | null>(null);
  const hasSelection = useSelection();

  const { isBold, isItalic, isUnderline, selectedColor, updateButtonStates } = useStyleUpdater(isVisible, hasSelection);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_NOTE_STORY);

  const applyStyle = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateButtonStates();
  };

  useEffect(() => {
    if (!isVisible) navigateBack();
  }, [isVisible]);

  useClickOutside(refOne, navigateBack);

  useEffect(() => {
    if (!hasSelection) navigateBack();
  }, [hasSelection]);

  return (
    <StyledActionSheetWrapper
      ref={refOne}
      initial={{
        opacity: 0,
        scale: 0.0,
      }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.0 }}
      transition={{ duration: 0.2 }}
    >
      <ButtonContainer>
        {COLOR_ITEMS.slice(1, 7)
          .concat(COLOR_ITEMS.slice(8))
          .map((color) => (
            <ColorButton
              key={color.color}
              onClick={() =>
                applyStyle('hiliteColor', selectedColor === color.color ? 'transparent' : color.color + '90')
              }
              style={{
                backgroundColor: color.color,
                outline: selectedColor === color.color ? '1px solid #325FFF' : 'none',
              }}
            />
          ))}
        <ColorButton
          onClick={() => applyStyle('hiliteColor', 'transparent')}
          style={{
            backgroundColor: '',
            outline: '1px solid #86858A70',
          }}
        />
      </ButtonContainer>

      <StyleOptionsContainer>
        <StyledTextOptionButton isCurrent={isBold} onClick={() => applyStyle('bold')}>
          <strong>B</strong>
        </StyledTextOptionButton>
        <StyledTextOptionButton isCurrent={isItalic} onClick={() => applyStyle('italic')}>
          <span tw="italic">I</span>
        </StyledTextOptionButton>
        <StyledTextOptionButton isCurrent={isUnderline} onClick={() => applyStyle('underline')}>
          <span tw="underline">U</span>
        </StyledTextOptionButton>
      </StyleOptionsContainer>
    </StyledActionSheetWrapper>
  );
};

export default StyleActionSheet;
