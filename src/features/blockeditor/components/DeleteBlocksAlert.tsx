import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext } from "react";
import { Stories, DataTypes } from "../../../base/enums";
import { Alert, AlertButton } from "../../../components";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayActionTexts } from "../../../utils/displayText";
import { useEntities } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";

const DeleteBlocksAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.DELETING_BLOCKS_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const [selectedBlockEntities] = useEntities((e) => e.has(DataTypes.BLOCK) && e.has(Tags.SELECTED));

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_BLOCKEDITOR_STORY);

  const deleteSelectedBlocks = async () => {
    navigateBack();

    selectedBlockEntities.forEach((blockEntity) => {
      lsc.engine.removeEntity(blockEntity);

      // TODO: Delete blocks from the database
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
