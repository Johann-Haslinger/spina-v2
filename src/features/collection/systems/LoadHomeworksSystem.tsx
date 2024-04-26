import { useContext, useEffect } from "react";
import supabase from "../../../lib/supabase";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { TitleFacet, DateAddedFacet } from "../../../app/AdditionalFacets";
import { dummyHomeworks } from "../../../base/dummy";
import { DataTypes } from "../../../base/enums";
import { useSelectedTopic } from "../hooks/useSelectedTopic";

const fetchHomeworksForTopic = async (topicId: string) => {
  const { data: homeworks, error } = await supabase
    .from("homeworks")
    .select("title, id, createdAt")
    .eq("parentId", topicId);

  if (error) {
    console.error("Error fetching homeworks:", error);
    return [];
  }

  return homeworks || [];
};

const LoadHomeworksSystem = (props: { mockupData?: boolean }) => {
  const { mockupData } = props;
  const lsc = useContext(LeanScopeClientContext);
  const { selectedTopicId } = useSelectedTopic();

  useEffect(() => {
    const initializeHomeworkEntities = async () => {
      if (selectedTopicId) {
        const homeworks = mockupData
          ? dummyHomeworks
          : await fetchHomeworksForTopic(selectedTopicId);

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
            homeworkEntity.addTag(DataTypes.HOMEWORK);
          }
        });
      }
    };

    initializeHomeworkEntities();
  }, [selectedTopicId]);

  return null;
};

export default LoadHomeworksSystem;
