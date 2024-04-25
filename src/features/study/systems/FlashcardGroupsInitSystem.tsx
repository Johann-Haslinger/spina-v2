import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, OrderFacet } from "@leanscope/ecs-models";
import React, { useContext, useEffect } from "react";
import { DateAddedFacet, TitleFacet } from "../../../app/AdditionalFacets";
import { dummyFlashcardSets, dummySchoolSubjects } from "../../../base/dummy";
import { DataTypes } from "../../../base/enums";
import { dataTypeQuery } from "../../../utils/queries";
import supabase from "../../../lib/supabase";


const fetchFlashcardSets = async () => {
  const { data: flashcardSets, error } = await supabase.from("flashcardSets").select("flashcardSetName, id, date_added");

  if (error) {
    console.error("Error fetching flashcardSets:", error);
    return [];
  }

  return flashcardSets || [];
};



const FlashcardGroupsInitSystem = (props: { mockupData?: boolean }) => {
  const { mockupData } = props;
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const initializeFlashcardGroupEntities = async () => {
      const flashcardSets = mockupData ? dummyFlashcardSets :  await fetchFlashcardSets();

      flashcardSets.forEach((flashcardSet, idx) => {
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
        }
      });
    };

    initializeFlashcardGroupEntities();
  }, []);

  return null;
};

export default FlashcardGroupsInitSystem;
