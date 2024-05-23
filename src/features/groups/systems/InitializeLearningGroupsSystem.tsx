import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useContext, useEffect } from "react";
import { useMockupData } from "../../../hooks/useMockupData";
import supabaseClient from "../../../lib/supabase";
import { dummyLearningGroups } from "../../../base/dummy";
import { ColorFacet, DescriptionFacet, IdentifierFacet, OrderFacet } from "@leanscope/ecs-models";
import { Entity } from "@leanscope/ecs-engine";
import { TitleFacet } from "../../../app/additionalFacets";
import { DataTypes } from "../../../base/enums";
import { dataTypeQuery } from "../../../utils/queries";

const fetchLearningGroups = async () => {

  const { data: learningGroups, error } = await supabaseClient.from("learning_groups").select("title, id, color, description");

  if (error) {
    console.error("Error fetching learning groups:", error);
    return [];
  }

  return learningGroups || [];
}

const InitializeLearningGroupsSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const initializeLearningGroupEntities = async () => {
      const LearningGroups = mockupData
        ? dummyLearningGroups
        : shouldFetchFromSupabase
          ? await fetchLearningGroups()
          : [];

      LearningGroups.forEach((learningGroup, idx) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === learningGroup.id && dataTypeQuery(e, DataTypes.LEARNING_GROUP)
        );

        if (!isExisting) {
          const learningGroupEntity = new Entity();
          lsc.engine.addEntity(learningGroupEntity);
          learningGroupEntity.add(new TitleFacet({ title: learningGroup.title }));
          learningGroupEntity.add(new IdentifierFacet({ guid: learningGroup.id }));
          learningGroupEntity.add(new OrderFacet({ orderIndex: idx }));
          learningGroupEntity.add(new ColorFacet({ colorName: learningGroup.color }))
          learningGroupEntity.add(new DescriptionFacet({ description: learningGroup.description }))
          learningGroupEntity.addTag(DataTypes.LEARNING_GROUP);
        }
      });
    };

    initializeLearningGroupEntities();
  }, [mockupData, shouldFetchFromSupabase]);

  return null
}

export default InitializeLearningGroupsSystem