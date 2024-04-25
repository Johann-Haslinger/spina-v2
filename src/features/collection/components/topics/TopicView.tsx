import React from "react";
import {
  CollectionGrid,
  NavigationBar,
  Spacer,
  Title,
  View,
} from "../../../../components";
import { TitleFacet, TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { LuPlus } from "react-icons/lu";
import { IdentifierFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { useSelectedSchoolSubject } from "../../hooks/useSelectedSchoolSubject";
import { AdditionalTags, DataTypes } from "../../../../base/enums";
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

const TopicView = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedSchoolSubjectTitle } = useSelectedSchoolSubject();

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);

  return (
    <>
      <LoadNotesSystem mockupData />
      <LoadFlashcardSetsSystem mockupData />

      <View visibe={isVisible}>
        <NavigationBar>
          <LuPlus />
        </NavigationBar>
        <BackButton navigateBack={navigateBack}>
          {selectedSchoolSubjectTitle}
        </BackButton>
        <Title>{title}</Title>
        <Spacer size={6} />
        <CollectionGrid>
          <EntityPropsMapper
            query={(e) =>
              dataTypeQuery(e, DataTypes.NOTE) && isChildOfQuery(e, entity)
            }
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet], []]}
            onMatch={NoteCell}
          />
        </CollectionGrid>
        <Spacer />
        <CollectionGrid>
          <EntityPropsMapper
            query={(e) =>
              dataTypeQuery(e, DataTypes.FLASHCARD_SET) &&
              isChildOfQuery(e, entity)
            }
            get={[[TitleFacet, IdentifierFacet], []]}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            onMatch={FlashcardSetCell}
          />
        </CollectionGrid>
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.NOTE) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={NoteView}
      />
      <EntityPropsMapper
        query={(e) =>
          dataTypeQuery(e, DataTypes.FLASHCARD_SET) && e.has(Tags.SELECTED)
        }
        get={[[TitleFacet, IdentifierFacet], []]}
        onMatch={FlashcardSetView}
      />
    </>
  );
};

export default TopicView;
