import { Fragment, useContext } from "react";
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
import { TitleFacet, TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { DescriptionProps, IdentifierFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { useSelectedSchoolSubject } from "../../hooks/useSelectedSchoolSubject";
import { AdditionalTags, DataTypes, Stories } from "../../../../base/enums";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import BackButton from "../../../../components/buttons/BackButton";
import LoadNotesSystem from "../../systems/LoadNotesSystem";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import NoteCell from "../notes/NoteCell";
import { sortEntitiesByDateAdded } from "../../../../utils/sortEntitiesByTime";
import NoteView from "../notes/NoteView";
import FlashcardSetCell from "../flashcardSets/FlashcardSetCell";
import FlashcardSetView from "../flashcardSets/FlashcardSetView";
import LoadFlashcardSetsSystem from "../../systems/LoadFlashcardSetsSystem";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { IoAdd, IoCreateOutline, IoEllipsisHorizontalCircleOutline, IoTrashOutline } from "react-icons/io5";
import AddResourceToTopicSheet from "./AddResourceToTopicSheet";
import HomeworkCell from "../homeworks/HomeworkCell";
import HomeworkView from "../homeworks/HomeworkView";
import LoadHomeworksSystem from "../../systems/LoadHomeworksSystem";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayActionTexts, displayAlertTexts } from "../../../../utils/displayText";
import DeleteTopicAlert from "./DeleteTopicAlert";
import EditTopicSheet from "./EditTopicSheet";
import { useEntityHasChildren } from "../../hooks/useEntityHasChildren";
import AddHomeworkSheet from "../homeworks/AddHomeworkSheet";
import AddFlashcardSetSheet from "../flashcardSets/AddFlashcardSetSheet";
import LoadSubtopicsSystem from "../../systems/LoadSubtopicsSystem";
import SubtopicCell from "../subtopics/SubtopicCell";
import SubtopicView from "../subtopics/SubtopicView";

const TopicView = (props: TitleProps & EntityProps & DescriptionProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedSchoolSubjectTitle } = useSelectedSchoolSubject();
  const { selectedLanguage } = useSelectedLanguage();
  const { hasChildren } = useEntityHasChildren(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openAddResourceSheet = () => lsc.stories.transitTo(Stories.ADD_RESOURCE_TO_TOPIC_STORY);
  const openEditTopicSheet = () => lsc.stories.transitTo(Stories.EDIT_TOPIC_STORY);
  const openDeleteTopicAlert = () => lsc.stories.transitTo(Stories.DELETE_TOPIC_STORY);

  return (
    <Fragment>
      <LoadNotesSystem />
      <LoadFlashcardSetsSystem />
      <LoadHomeworksSystem />
      <LoadSubtopicsSystem />

      <View visibe={isVisible}>
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
    </Fragment>
  );
};

export default TopicView;
