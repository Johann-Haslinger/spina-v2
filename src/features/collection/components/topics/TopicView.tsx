import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { DescriptionProps, IdentifierFacet, ParentFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { Fragment, useContext } from "react";
import {
  IoAdd,
  IoCameraOutline,
  IoCreateOutline,
  IoEllipsisHorizontalCircleOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { v4 } from "uuid";
import { DateAddedFacet, SourceFacet, TitleFacet, TitleProps } from "../../../../app/additionalFacets";
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
import { addNote } from "../../../../functions/addNote";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { useUserData } from "../../../../hooks/useUserData";
import { displayActionTexts, displayAlertTexts, displayDataTypeTexts } from "../../../../utils/displayText";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import { sortEntitiesByDateAdded } from "../../../../utils/sortEntitiesByTime";
import AddResourceToLearningGroupSheet from "../../../groups/components/AddResourceToLearningGroupSheet";
import { useEntityHasChildren } from "../../hooks/useEntityHasChildren";
import { useSelectedSchoolSubject } from "../../hooks/useSelectedSchoolSubject";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import LoadFlashcardSetsSystem from "../../systems/LoadFlashcardSetsSystem";
import LoadHomeworksSystem from "../../systems/LoadHomeworksSystem";
import LoadNotesSystem from "../../systems/LoadNotesSystem";
import LoadSubtopicsSystem from "../../systems/LoadSubtopicsSystem";
import AddFlashcardSetSheet from "../flashcard-sets/AddFlashcardSetSheet";
import FlashcardSetCell from "../flashcard-sets/FlashcardSetCell";
import FlashcardSetView from "../flashcard-sets/FlashcardSetView";
import GenerateResourcesFromImageSheet from "../generation/GenerateResourcesFromImageSheet";
import AddHomeworkSheet from "../homeworks/AddHomeworkSheet";
import HomeworkCell from "../homeworks/HomeworkCell";
import HomeworkView from "../homeworks/HomeworkView";
import NoteCell from "../notes/NoteCell";
import NoteView from "../notes/NoteView";
import SubtopicCell from "../subtopics/SubtopicCell";
import SubtopicView from "../subtopics/SubtopicView";
import DeleteTopicAlert from "./DeleteTopicAlert";
import EditTopicSheet from "./EditTopicSheet";

const useImageSelector = () => {
  const lsc = useContext(LeanScopeClientContext);

  const handleImageUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const newImagePromptEntity = new Entity();
        lsc.engine.addEntity(newImagePromptEntity);
        newImagePromptEntity.add(new SourceFacet({ source: base64 }));
        newImagePromptEntity.add(AdditionalTags.GENERATE_FROM_IMAGE_PROMPT);

        lsc.stories.transitTo(Stories.GENERATING_RESOURCES_FROM_IMAGE);
      };
      reader.readAsDataURL(file);
    }
  };

  const openImageSelector = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", handleImageUpload);
    fileInput.click();
  };

  return {
    openImageSelector,
  };
};

const TopicView = (props: TitleProps & EntityProps & DescriptionProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedSchoolSubjectTitle } = useSelectedSchoolSubject();
  const { selectedLanguage } = useSelectedLanguage();
  const { hasChildren } = useEntityHasChildren(entity);
  const { openImageSelector } = useImageSelector();
  const { userId } = useUserData();
  const { selectedTopicId } = useSelectedTopic();

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openEditTopicSheet = () => lsc.stories.transitTo(Stories.EDITING_TOPIC_STORY);
  const openDeleteTopicAlert = () => lsc.stories.transitTo(Stories.DELETING_TOPIC_STORY);
  const openAddFlashcardsSheet = () => lsc.stories.transitTo(Stories.ADDING_FLASHCARD_SET_STORY);
  const openAddHomeworkSheet = () => lsc.stories.transitTo(Stories.ADDING_HOMEWORK_STORY);

  const saveNote = async () => {
    if (selectedTopicId) {
      const noteId = v4();

      const newNoteEntity = new Entity();
      newNoteEntity.add(new IdentifierFacet({ guid: noteId }));
      newNoteEntity.add(new ParentFacet({ parentId: selectedTopicId }));
      newNoteEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
      newNoteEntity.add(DataTypes.NOTE);
      newNoteEntity.add(Tags.SELECTED);

      addNote(lsc, newNoteEntity, userId);
    }
  };

  return (
    <Fragment>
      <LoadNotesSystem />
      <LoadFlashcardSetsSystem />
      <LoadHomeworksSystem />
      <LoadSubtopicsSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow icon={<IoAdd />} onClick={saveNote}>
                  {displayDataTypeTexts(selectedLanguage).note}
                </ActionRow>
                <ActionRow icon={<IoAdd />} onClick={openAddFlashcardsSheet}>
                  {displayDataTypeTexts(selectedLanguage).flashcardSet}
                </ActionRow>
                <ActionRow icon={<IoAdd />} hasSpace onClick={openAddHomeworkSheet}>
                  {displayDataTypeTexts(selectedLanguage).homework}
                </ActionRow>
                <ActionRow icon={<IoCameraOutline />} onClick={openImageSelector} last>
                  {displayActionTexts(selectedLanguage).generateFromImage}
                </ActionRow>
              </Fragment>
            }
          >
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

      <DeleteTopicAlert />
      <EditTopicSheet />
      <GenerateResourcesFromImageSheet />
      <AddResourceToLearningGroupSheet />
    </Fragment>
  );
};

export default TopicView;
