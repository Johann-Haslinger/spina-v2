import styled from '@emotion/styled';
import { Entity, EntityProps, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, IdentifierProps, OrderProps, ParentFacet, ParentProps, Tags } from '@leanscope/ecs-models';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import tw from 'twin.macro';
import { DateAddedProps, TitleFacet, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTags, DataType, SupabaseTables } from '../../../../base/enums';
import { SecondaryText, Spacer, TextEditor } from '../../../../components';
import supabaseClient from '../../../../lib/supabase';
import { dataTypeQuery } from '../../../../utils/queries';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';
import { useText } from '../../hooks/useText';

const StyledBackButton = styled.div`
  ${tw`flex size-8 hover:scale-105 rounded-full justify-center text-xl bg-opacity-40 transition-all bg-[#D9D9D9] dark:bg-opacity-20 dark:text-primaryTextDark mb-4 space-x-2 items-center cursor-pointer right-14 top-[9rem]  relative`}
`;

const StyledChapterWrapper = styled.div`
  ${tw`min-h-screen flex flex-col justify-between pb-12 dark:border-primaryBorderDark border-primaryBorder  w-full`}
`;

const StyledChapterHeader = styled.div<{ accentColor: string }>`
  ${tw`size-12 rounded-lg font-black text-3xl flex justify-center items-center mb-6`}
  background-color: ${({ accentColor }) => accentColor + 50};
  color: ${({ accentColor }) => accentColor};
`;

const ChapterSection = (
  props: TitleProps & EntityProps & DateAddedProps & OrderProps & ParentProps & IdentifierProps,
) => {
  const { title, dateAdded, entity, orderIndex = 0, parentId } = props;
  const [selectedChapters] = useEntities((e) => e.has(Tags.SELECTED) && dataTypeQuery(e, DataType.CHAPTER));
  const { text, updateText } = useText(entity);
  const { color: accentColor } = useSelectedSchoolSubjectColor();
  const formattedDate = new Date(dateAdded).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const chapterCount = useChapterCount(parentId);

  const navigateBack = () => selectedChapters.forEach((e) => e.add(AdditionalTags.NAVIGATE_BACK));

  return (
    <StyledChapterWrapper>
      <div tw="w-full">
        <StyledBackButton onClick={navigateBack}>
          <IoArrowBack />
        </StyledBackButton>

        <StyledChapterHeader accentColor={accentColor}>{orderIndex + 1}.</StyledChapterHeader>

        <ChapterTitle {...props}>{title || ''}</ChapterTitle>

        <SecondaryText>Hinzugefügt am {formattedDate}</SecondaryText>

        <Spacer size={6} />

        <TextEditor placeholder="Beginne hier..." value={text} onBlur={updateText} />
      </div>

      <div tw="w-full">
        <div tw="flex w-full justify-between">
          <p tw="text-xl font-semibold">Anhang</p>
          <div tw="text-seconderyText dark:text-seconderyTextDark flex space-x-6 text-sm">
            <div tw="text-primatyText dark:text-primaryTextDark underline">Merken</div>
            <div>Datein</div>
          </div>
        </div>
        <div tw="h-60 w-full border-t mt-4 border-primaryBorder dark:border-primaryBorderDark"></div>
        <SecondaryText>{chapterCount > 1 ? ` ${orderIndex + 1} von ${chapterCount}` : ''}</SecondaryText>
      </div>
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
  ${tw` line-clamp-2 text-3xl font-semibold w-fit min-w-10 mb-1 min-h-10 outline-none transition-all`}
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
  const { color: accentColor } = useSelectedSchoolSubjectColor();

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
