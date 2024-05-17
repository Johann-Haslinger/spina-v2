import { Entity, EntityProps, useEntity } from "@leanscope/ecs-engine";
import { FloatOrderProps, IdentifierFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import BlockOutline from "./BlockOutline";
import { useCurrentBlockeditor } from "../../hooks/useCurrentBlockeditor";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayAlertTexts } from "../../../../utils/displayText";
import { Fragment } from "react/jsx-runtime";
import { View } from "../../../../components";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";
import Blockeditor from "../Blockeditor";
import { AdditionalTags } from "../../../../base/enums";
import { BlockeditorStateFacet } from "../../../../app/additionalFacets";
import { useContext, useEffect, useState } from "react";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { changeBlockeditorState } from "../../functions/changeBlockeditorState";

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
  const [pageBlockEditorEntity] = useEntity(
    (e) =>
      e.has(BlockeditorStateFacet) && e.get(IdentifierFacet)?.props.guid === entity.get(IdentifierFacet)?.props.guid
  );
  const [parentBlockeditorEntity, setParentBlockeditorEntity] = useState<Entity>();
  const title = entity.get(TextFacet)?.props.text;
  const [isPageViewVisible] = useEntityHasTags(entity, AdditionalTags.OPEN);
  const id = entity.get(IdentifierFacet)?.props.guid;

  // TODO: Custom hook to get the parent blockeditor entity

  useEffect(() => {
    if (!parentBlockeditorEntity) {
      setParentBlockeditorEntity(blockeditorEntity);
    }
  }, [blockeditorEntity]);

  useEffect(() => {
    // const parentBlockeditorEntity = lsc.engine.entities.find(
    //   (e) => e.has(BlockeditorStateFacet) && e.get(IdentifierFacet)?.props.guid === entity.get(ParentFacet)?.props.parentId
    // );
    entity.remove(Tags.SELECTED)
    changeBlockeditorState(blockeditorEntity, "view");
    const lscparentBlockeditorEntity = lsc.engine.entities.find((e) => e.get(IdentifierFacet)?.props.guid === parentBlockeditorEntity?.get(IdentifierFacet)?.props.guid);

    if (isPageViewVisible) {
      blockeditorEntity?.add(new IdentifierFacet({ guid: id || "" }));
    } else {
    
      blockeditorEntity?.add(new IdentifierFacet({ guid: lscparentBlockeditorEntity?.get(IdentifierFacet)?.props.guid || "" }));
    }
  }, [isPageViewVisible, pageBlockEditorEntity]);

  const openPageBlock = () => blockeditorState === "view" && entity.add(AdditionalTags.OPEN);
  const closePageBlock = () => entity.remove(AdditionalTags.OPEN);

  // const onHeaderBlur = async (e: React.ChangeEvent<HTMLDivElement>) => {
  //   entity.add(new TextFacet({ text: e.target.innerText }));

  //   // TODO: Update the title of the block in the database
  // };

  return (
    <Fragment>
      {/* {id && <InitializeBlockeditorSystem blockeditorId={id} />} */}

      <BlockOutline index={index} blockEntity={entity}>
        <StyledContentWrapper onClick={openPageBlock}>
          <StyledPageIconWrapper disabeld={blockeditorState !== "view"}>
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

      <div style={{ zIndex: 5000, position: "fixed" }}>
        {id && (
          <Fragment>
            <View visible={isPageViewVisible}>
              <Blockeditor navigateBack={closePageBlock} title={title} id={id} />
            </View>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default PageBlock;
