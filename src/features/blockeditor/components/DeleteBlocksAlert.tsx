import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext } from "react";
import { Stories, DataTypes } from "../../../base/enums";
import { Alert, AlertButton } from "../../../components";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayActionTexts } from "../../../utils/displayText";
import { useEntities } from "@leanscope/ecs-engine";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import supabaseClient from "../../../lib/supabase";

const DeleteBlocksAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.DELETING_BLOCKS_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const [selectedBlockEntities] = useEntities((e) => e.has(DataTypes.BLOCK) && e.has(Tags.SELECTED));

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_BLOCKEDITOR_STORY);

  const deleteSelectedBlocks = async () => {
    navigateBack();

    selectedBlockEntities.forEach(async (blockEntity) => {
      lsc.engine.removeEntity(blockEntity);

      const id = blockEntity.get(IdentifierFacet)?.props.guid;

      const { error } = await supabaseClient.from("blocks").delete().eq("id", id);

      if (error) {
        console.error("Error deleting block from supabase:", error);
      }
    });
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteSelectedBlocks} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteBlocksAlert;
