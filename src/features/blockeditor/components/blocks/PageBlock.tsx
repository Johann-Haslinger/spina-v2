import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityProps, useEntity } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { FloatOrderProps, IdentifierFacet, ParentFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { Fragment } from 'react/jsx-runtime';
import tw from 'twin.macro';
import { AdditionalTag, SupabaseColumn, SupabaseTable } from '../../../../base/enums';
import { View } from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../lib/supabase';
import { displayAlertTexts } from '../../../../utils/displayText';
import { changeBlockeditorState } from '../../functions/changeBlockeditorState';
import { useCurrentBlockeditor } from '../../hooks/useCurrentBlockeditor';
import Blockeditor from '../Blockeditor';
import BlockOutline from './BlockOutline';

const StyledPageIconWrapper = styled.div<{ disabeld?: boolean }>`
  ${tw`h-10 w-[34px] ml-1.5 bg-white dark:bg-tertiaryDark rounded-sm shadow mr-3 mt-0.5  border-[rgb(245,245,245)]`}
  ${({ disabeld }) => !disabeld && tw` md:hover:scale-110 transition-all`}
`;

const StyledPageLine = styled.div<{ marginTop: number; width: number }>`
  ${tw`w-8 h-0.5 bg-primary dark:bg-opacity-5 ml-1 rounded-full`}
  margin-top: ${({ marginTop }) => marginTop * 4}px;
  width: ${({ width }) => width * 4}px;
`;

const StyledTextWrapper = styled.div`
  ${tw`pl-0.5 w-full`}
`;

const StyledTitleWrapper = styled.div`
  ${tw`font-semibold line-clamp-2`}
`;

const StyledSubtitleWrapper = styled.div`
  ${tw`text-sm   relative bottom-0.5 text-seconderyText dark:text-seconderyTextDark`}
`;

const StyledContentWrapper = styled.div`
  ${tw`flex  w-full`}
`;

const PageBlock = (props: EntityProps & FloatOrderProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { entity, index } = props;
  const { blockeditorState, blockeditorEntity } = useCurrentBlockeditor();
  const { selectedLanguage } = useSelectedLanguage();
  const title = entity.get(TextFacet)?.props.text;
  const [isPageViewVisible] = useEntityHasTags(entity, AdditionalTag.OPEN);
  const id = entity.get(IdentifierFacet)?.props.guid;
  const [parentBlockEntity] = useEntity(
    (e) => e.get(IdentifierFacet)?.props.guid === entity.get(ParentFacet)?.props.parentId,
  );
  const parentBlockText = parentBlockEntity?.get(TextFacet)?.props.text;

  // TODO: Custom hook to get the parent blockeditor entity

  useEffect(() => {
    if (isPageViewVisible) {
      entity.remove(Tags.SELECTED);
      changeBlockeditorState(blockeditorEntity, 'view');
    }
    const parentBlockEntity = lsc.engine.entities.find(
      (e) => e.get(IdentifierFacet)?.props.guid === entity?.get(ParentFacet)?.props.parentId,
    );

    if (isPageViewVisible) {
      blockeditorEntity?.add(new IdentifierFacet({ guid: id || '' }));
    } else {
      blockeditorEntity?.add(
        new IdentifierFacet({
          guid: parentBlockEntity?.get(IdentifierFacet)?.props.guid || '',
        }),
      );
    }
  }, [isPageViewVisible, entity, blockeditorEntity]);

  const openPageBlock = () => blockeditorState === 'view' && entity.add(AdditionalTag.OPEN);
  const closePageBlock = () => entity.remove(AdditionalTag.OPEN);

  const handleTitleBlur = async (value: string) => {
    entity.add(new TextFacet({ text: value }));

    const { error } = await supabaseClient
      .from(SupabaseTable.BLOCKS)
      .update({ content: value })
      .eq(SupabaseColumn.ID, id);

    if (error) {
      console.error('Error updating block title', error);
    }
  };

  return (
    <Fragment>
      {/* {id && <InitializeBlockeditorSystem blockeditorId={id} />} */}

      <BlockOutline index={index} blockEntity={entity}>
        <StyledContentWrapper onClick={openPageBlock}>
          <StyledPageIconWrapper disabeld={blockeditorState !== 'view'}>
            <StyledPageLine marginTop={2} width={4} />
            <StyledPageLine marginTop={1.5} width={6} />
            <StyledPageLine marginTop={0.5} width={4} />
            <StyledPageLine marginTop={0.5} width={6} />
            <StyledPageLine marginTop={0.5} width={3} />
          </StyledPageIconWrapper>
          <StyledTextWrapper>
            <StyledTitleWrapper>{title ? title : displayAlertTexts(selectedLanguage).noTitle}</StyledTitleWrapper>
            <StyledSubtitleWrapper>Seiteninhalt wird hier angezeigt</StyledSubtitleWrapper>
          </StyledTextWrapper>
        </StyledContentWrapper>
      </BlockOutline>

      <div style={{ zIndex: 5000, position: 'fixed' }}>
        {id && (
          <Fragment>
            <View visible={isPageViewVisible}>
              <Blockeditor
                backbuttonLabel={parentBlockText}
                handleTitleBlur={handleTitleBlur}
                navigateBack={closePageBlock}
                title={title}
                id={id}
              />
            </View>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default PageBlock;
