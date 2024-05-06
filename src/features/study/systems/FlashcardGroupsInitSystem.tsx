import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet } from "@leanscope/ecs-models";
import  { useContext, useEffect } from "react";
import { DateAddedFacet, TitleFacet } from "../../../app/AdditionalFacets";
import { dummyFlashcardSets } from "../../../base/dummy";
import { DataTypes } from "../../../base/enums";
import { dataTypeQuery } from "../../../utils/queries";
import supabaseClient from "../../../lib/supabase";
import { useMockupData } from "../../../hooks/useMockupData";


const fetchFlashcardSets = async () => {
  const { data: flashcardSets, error } = await supabaseClient.from("flashcardSets").select("flashcardSetName, id, date_added").limit(10);

  if (error) {
    console.error("Error fetching flashcardSets:", error);
    return [];
  }

  return flashcardSets || [];
};



const FlashcardGroupsInitSystem = () => {
  const { mockupData } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const initializeFlashcardSetEntities = async () => {
      const flashcardSets = mockupData ? dummyFlashcardSets :  await fetchFlashcardSets();

      flashcardSets.forEach((flashcardSet) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === flashcardSet.id  && dataTypeQuery(e, DataTypes.FLASHCARD_GROUP)
        );

        if (!isExisting) {
          const flashcardGroupEntity = new Entity();
          lsc.engine.addEntity(flashcardGroupEntity);
          flashcardGroupEntity.add(new DateAddedFacet({ dateAdded: flashcardSet.date_added }));
          flashcardGroupEntity.add(
            new TitleFacet({ title: flashcardSet.flashcardSetName })
          );
          flashcardGroupEntity.add(
            new IdentifierFacet({ guid: flashcardSet.id })
          );
          flashcardGroupEntity.addTag(DataTypes.FLASHCARD_GROUP);
          flashcardGroupEntity.addTag(DataTypes.FLASHCARD_SET);
        }
      });
    };

    initializeFlashcardSetEntities();
  }, []);

  return null;
};

export default FlashcardGroupsInitSystem;
