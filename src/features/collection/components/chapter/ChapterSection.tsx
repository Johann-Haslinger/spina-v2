import styled from '@emotion/styled';
import { Entity, EntityProps, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, IdentifierProps, OrderProps, ParentFacet, ParentProps, Tags } from '@leanscope/ecs-models';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { IoArrowBack, IoBook } from 'react-icons/io5';
import tw from 'twin.macro';
import { DateAddedProps, TitleFacet, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTags, DataType, SupabaseTables } from '../../../../base/enums';
import { TextEditor } from '../../../../components';
import supabaseClient from '../../../../lib/supabase';
import { dataTypeQuery } from '../../../../utils/queries';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';
import { useText } from '../../hooks/useText';

const StyledBackButton = styled.div`
  ${tw`flex size-8 hover:scale-105 rounded-full justify-center text-xl bg-opacity-40 transition-all bg-[#D9D9D9] dark:bg-opacity-20 dark:text-primaryTextDark mb-4 space-x-2 items-center cursor-pointer right-14 top-24 relative`}
`;

const StyledChapterWrapper = styled.div`
  ${tw`min-h-screen border-primaryBorder border-b w-full`}
`;

const StyledChapterHeader = styled.div<{ accentColor: string }>`
  ${tw`h-60 mb-8 p-6 flex rounded-2xl flex-col justify-between w-full`}
  background-color: ${({ accentColor }) => accentColor + 50};
  color: ${({ accentColor }) => accentColor};
`;

const StyledTitle = styled.div`
  ${tw`text-3xl flex md:text-3xl mb-4 font-extrabold`}
`;

const StyledInfoContainer = styled.div<{ accentColor: string }>`
  ${tw`font-medium items-center text-seconderyText flex justify-between`}
  color: ${({ accentColor }) => accentColor};
`;

const StyledBetaBadge = styled.div`
  ${tw`bg-primaryColor mb-4 text-primaryColor font-bold hover:opacity-70 transition-all w-fit bg-opacity-20 text-sm rounded-lg px-4 py-1`}
`;

const ChapterSection = (
  props: TitleProps & EntityProps & DateAddedProps & OrderProps & ParentProps & IdentifierProps,
) => {
  const { title, dateAdded, entity, orderIndex = 0, parentId } = props;
  const [selectedChapters] = useEntities((e) => e.has(Tags.SELECTED) && dataTypeQuery(e, DataType.CHAPTER));
  const { text, updateText } = useText(entity);
  const { accentColor } = useSelectedSchoolSubjectColor();
  const formattedDate = new Date(dateAdded).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const chapterCount = useChapterCount(parentId);

  const navigateBack = () => selectedChapters.forEach((e) => e.add(AdditionalTags.NAVIGATE_BACK));

  return (
    <StyledChapterWrapper>
      <StyledBackButton onClick={navigateBack}>
        <IoArrowBack />
      </StyledBackButton>

      <StyledBetaBadge>BETA</StyledBetaBadge>

      <StyledChapterHeader accentColor={accentColor}>
        <IoBook tw="text-6xl" />

        <div>
          <StyledTitle>
            KAPITEL {orderIndex + 1} - <ChapterTitle {...props}>{title || ''}</ChapterTitle>
          </StyledTitle>
          <StyledInfoContainer accentColor={accentColor}>
            <p>Hinzugefügt am {formattedDate}</p>
            <p>
              {orderIndex + 1} / {chapterCount || 1}
            </p>
          </StyledInfoContainer>
        </div>
      </StyledChapterHeader>

      <TextEditor placeholder="Beginne hier..." value={text} onBlur={updateText} />
    </StyledChapterWrapper>
  );
};

export default ChapterSection;

const useChapterCount = (parentId: string) => {
  const [chapterEntities] = useEntities(
    (e) => e.get(ParentFacet)?.props.parentId === parentId && dataTypeQuery(e, DataType.CHAPTER),
  );

  return chapterEntities.length;
};

const StyledEditableTitle = styled.div<{ placeholderStyle: boolean; color: string }>`
  ${tw` line-clamp-2 w-fit min-w-10 ml-2 min-h-10 outline-none transition-all`}
  color: ${({ color, placeholderStyle }) => placeholderStyle && color + 60};
`;

const updateChapterTitle = async (entity: Entity, title: string) => {
  entity.add(new TitleFacet({ title }));

  const id = entity?.get(IdentifierFacet)?.props.guid;
  if (!id) return;

  const { error } = await supabaseClient.from(SupabaseTables.CHAPTERS).update({ title }).eq('id', id);

  if (error) {
    console.error('Error updating chapter title:', error);
  }
};

const ChapterTitle = (props: PropsWithChildren & IdentifierProps & EntityProps) => {
  const { children, entity } = props;
  const [isFocused, setIsFocused] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const { accentColor } = useSelectedSchoolSubjectColor();

  useEffect(() => {
    if (!children && !isFocused && titleRef.current) {
      titleRef.current.textContent = 'Title';
    } else if (!children && isFocused && titleRef.current) {
      titleRef.current.textContent = '';
    } else if (children && titleRef.current) {
      titleRef.current.textContent = children as string;
    }
  }, [children, isFocused]);

  const handleBlur = async () => {
    setIsFocused(false);
    updateChapterTitle(entity, titleRef.current?.textContent || '');
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/html')
      ? e.clipboardData.getData('text/html')
      : e.clipboardData.getData('text/plain');

    if (titleRef.current) {
      titleRef.current.textContent = titleRef.current.textContent + text;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    titleRef.current?.focus();
  };

  return (
    <StyledEditableTitle
      color={accentColor}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.metaKey) {
          e.preventDefault();
        }
      }}
      onFocus={handleFocus}
      onPaste={(e) => handlePaste(e)}
      onClick={handleFocus}
      ref={titleRef}
      placeholderStyle={!children && !isFocused}
      contentEditable
      onBlur={handleBlur}
    />
  );
};
