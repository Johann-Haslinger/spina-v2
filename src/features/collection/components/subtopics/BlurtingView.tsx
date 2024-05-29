import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useEntities } from "@leanscope/ecs-engine";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext } from "react";
import { Stories, DataTypes } from "../../../../base/enums";
import { View, NavigationBar, BackButton, Title, Spacer } from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../../../../utils/displayText";
import { isChildOfQuery, dataTypeQuery } from "../../../../utils/queries";
import { useSelectedSubtopic } from "../../hooks/useSelectedSubtopic";

const BlurtingView = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.OBSERVING_BLURTING_STORY);
  const { selectedSubtopicEntity, selectedSubtopicTitle } = useSelectedSubtopic();
  const { selectedLanguage } = useSelectedLanguage();
  const [flashcardEntities] = useEntities(
    (e) => isChildOfQuery(e, selectedSubtopicEntity) && dataTypeQuery(e, DataTypes.FLASHCARD)
  );

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_SUBTOPIC_STORY);

  return (
    <View visible={isVisible}>
      <NavigationBar />
      <BackButton navigateBack={navigateBack}>
        {selectedSubtopicTitle}, {flashcardEntities.length}
      </BackButton>
      <Title>{displayHeaderTexts(selectedLanguage).blurting}</Title>
      <Spacer />
    </View>
  );
};

export default BlurtingView;
