import { useContext, useEffect } from "react";
import supabaseClient from "../../../lib/supabase";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { TitleFacet, DateAddedFacet, DueDateFacet } from "../../../app/AdditionalFacets";
import { dummyHomeworks } from "../../../base/dummy";
import { DataTypes } from "../../../base/enums";
import { useSelectedTopic } from "../hooks/useSelectedTopic";
import { useMockupData } from "../../../hooks/useMockupData";

const fetchHomeworksForTopic = async (topicId: string) => {
  const { data: homeworks, error } = await supabaseClient
    .from("homeworks")
    .select("title, id, createdAt, dueDate")
    .eq("parentId", topicId);

  if (error) {
    console.error("Error fetching homeworks:", error);
    return [];
  }

  return homeworks || [];
};

const LoadHomeworksSystem = () => {
  const { mockupData, shouldFetchFromSupabase } = useMockupData();
  const lsc = useContext(LeanScopeClientContext);
  const { selectedTopicId } = useSelectedTopic();

  useEffect(() => {
    const initializeHomeworkEntities = async () => {
      if (selectedTopicId) {
        const homeworks = mockupData
          ? dummyHomeworks
          : shouldFetchFromSupabase ?  await fetchHomeworksForTopic(selectedTopicId) : []

        homeworks.forEach((homework) => {
          const isExisting = lsc.engine.entities.some(
            (e) =>
              e.get(IdentifierFacet)?.props.guid === homework.id &&
              e.hasTag(DataTypes.HOMEWORK)
          );

          if (!isExisting) {
            const homeworkEntity = new Entity();
            lsc.engine.addEntity(homeworkEntity);
            homeworkEntity.add(new TitleFacet({ title: homework.title }));
            homeworkEntity.add(new IdentifierFacet({ guid: homework.id }));
            homeworkEntity.add(
              new DateAddedFacet({ dateAdded: homework.createdAt })
            );

            homeworkEntity.add(new ParentFacet({ parentId: selectedTopicId }));
            homeworkEntity.add(new DueDateFacet({ dueDate: homework.dueDate }));
            homeworkEntity.addTag(DataTypes.HOMEWORK);
          }
        });
      }
    };

    initializeHomeworkEntities();
  }, [selectedTopicId, mockupData]);

  return null;
};

export default LoadHomeworksSystem;
