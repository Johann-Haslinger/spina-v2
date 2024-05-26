import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { DescriptionProps, IdentifierFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { Fragment, useContext } from "react";
import { IoAdd, IoCreateOutline, IoEllipsisHorizontalCircleOutline, IoTrashOutline } from "react-icons/io5";
import { TitleFacet, TitleProps } from "../../../../app/additionalFacets";
import { AdditionalTags, DataTypes, Stories } from "../../../../base/enums";
import {
  ActionRow,
  CollectionGrid,
  NavBarButton,
  NavigationBar,
  NoContentAddedHint,
  SecondaryText,
  Spacer,
  Title,
  View,
} from "../../../../components";
import BackButton from "../../../../components/buttons/BackButton";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayActionTexts, displayAlertTexts } from "../../../../utils/displayText";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import { sortEntitiesByDateAdded } from "../../../../utils/sortEntitiesByTime";
import { useEntityHasChildren } from "../../hooks/useEntityHasChildren";
import { useSelectedSchoolSubject } from "../../hooks/useSelectedSchoolSubject";
import LoadFlashcardSetsSystem from "../../systems/LoadFlashcardSetsSystem";
import LoadHomeworksSystem from "../../systems/LoadHomeworksSystem";
import LoadNotesSystem from "../../systems/LoadNotesSystem";
import LoadSubtopicsSystem from "../../systems/LoadSubtopicsSystem";
import AddFlashcardSetSheet from "../flashcard-sets/AddFlashcardSetSheet";
import FlashcardSetCell from "../flashcard-sets/FlashcardSetCell";
import FlashcardSetView from "../flashcard-sets/FlashcardSetView";
import AddHomeworkSheet from "../homeworks/AddHomeworkSheet";
import HomeworkCell from "../homeworks/HomeworkCell";
import HomeworkView from "../homeworks/HomeworkView";
import NoteCell from "../notes/NoteCell";
import NoteView from "../notes/NoteView";
import SubtopicCell from "../subtopics/SubtopicCell";
import SubtopicView from "../subtopics/SubtopicView";
import AddResourceToTopicSheet from "./AddResourceToTopicSheet";
import DeleteTopicAlert from "./DeleteTopicAlert";
import EditTopicSheet from "./EditTopicSheet";
import GenerateResourcesFromImageSheet from "../generation/GenerateResourcesFromImageSheet";
import AddResourceToLearningGroupSheet from "../../../groups/components/AddResourceToLearningGroupSheet";

const TopicView = (props: TitleProps & EntityProps & DescriptionProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedSchoolSubjectTitle } = useSelectedSchoolSubject();
  const { selectedLanguage } = useSelectedLanguage();
  const { hasChildren } = useEntityHasChildren(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openAddResourceSheet = () => lsc.stories.transitTo(Stories.ADDING_RESOURCE_TO_TOPIC_STORY);
  const openEditTopicSheet = () => lsc.stories.transitTo(Stories.EDITING_TOPIC_STORY);
  const openDeleteTopicAlert = () => lsc.stories.transitTo(Stories.DELETING_TOPIC_STORY);

  return (
    <Fragment>
      <LoadNotesSystem />
      <LoadFlashcardSetsSystem />
      <LoadHomeworksSystem />
      <LoadSubtopicsSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton onClick={openAddResourceSheet}>
            <IoAdd />
          </NavBarButton>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow first onClick={openEditTopicSheet} icon={<IoCreateOutline />}>
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>
                <ActionRow onClick={openDeleteTopicAlert} icon={<IoTrashOutline />} destructive last>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </Fragment>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>
        <BackButton navigateBack={navigateBack}>{selectedSchoolSubjectTitle}</BackButton>
        <Title>{title}</Title>
        <Spacer size={4} />
        <SecondaryText>{props.description || displayAlertTexts(selectedLanguage).noDescription}</SecondaryText>
        <Spacer size={2} />

        <Spacer />
        {!hasChildren && <NoContentAddedHint />}

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.SUBTOPIC) && isChildOfQuery(e, entity)}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet], []]}
            onMatch={SubtopicCell}
          />
        </CollectionGrid>

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.NOTE) && isChildOfQuery(e, entity)}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet], []]}
            onMatch={NoteCell}
          />
        </CollectionGrid>

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD_SET) && isChildOfQuery(e, entity)}
            get={[[TitleFacet, IdentifierFacet], []]}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            onMatch={FlashcardSetCell}
          />
        </CollectionGrid>

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.HOMEWORK) && isChildOfQuery(e, entity)}
            get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            onMatch={HomeworkCell}
          />
        </CollectionGrid>
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.NOTE) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={NoteView}
      />
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD_SET) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet], []]}
        onMatch={FlashcardSetView}
      />
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.HOMEWORK) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet, TextFacet], []]}
        onMatch={HomeworkView}
      />
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.SUBTOPIC) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={SubtopicView}
      />

      <AddHomeworkSheet />
      <AddFlashcardSetSheet />
      <AddResourceToTopicSheet />
      <DeleteTopicAlert />
      <EditTopicSheet />
      <GenerateResourcesFromImageSheet />
      <AddResourceToLearningGroupSheet />
      
    </Fragment>
  );
};

export default TopicView;
