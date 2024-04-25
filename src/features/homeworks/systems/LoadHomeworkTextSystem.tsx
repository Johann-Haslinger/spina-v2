import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, useEntity } from "@leanscope/ecs-engine";
import {
  IdentifierFacet,
  TimestampFacet,
  DescriptionFacet,
  ParentFacet,
  Tags,
  TextFacet,
} from "@leanscope/ecs-models";
import React, { useContext, useEffect } from "react";
import { TitleFacet } from "../../../app/AdditionalFacets";
import { dummyText, dummyTopics } from "../../../base/dummy";
import { DataTypes } from "../../../base/enums";
import supabase from "../../../lib/supabase";
import { useSchoolSubjectTopics } from "../../collection/hooks/useSchoolSubjectTopics";
import { useSelectedSchoolSubject } from "../../collection/hooks/useSelectedSchoolSubject";

const fetchHomeworkText = async (homeworkId: string) => {
  console.log("fetching text for homewirk", homeworkId);
  const { data: text, error } = await supabase
    .from("homeworks")
    .select("text")
    .eq("id", homeworkId)
    .single();

  if (error) {
    console.error("Error fetching homework text:", error);
    return [];
  }

  return text.text || [];
};

const LoadHomeworkTextSystem = (props: { mockupData?: boolean }) => {
  const { mockupData } = props;
  const [selectedHomework] = useEntity(
    (e) => e.hasTag(DataTypes.HOMEWORK) && e.hasTag(Tags.SELECTED)
  );
  const selectedHomeworkId = selectedHomework?.get(IdentifierFacet)?.props.guid;

  useEffect(() => {
    const loadHomeworkText = async () => {
      if (selectedHomeworkId) {
        const homeworkText = mockupData
          ? dummyText
          : await fetchHomeworkText(selectedHomeworkId);

        if (homeworkText) {
          selectedHomework?.add(new TextFacet({ text: homeworkText }));
        }
      }
    };

    if (selectedHomework) {
      loadHomeworkText();
    }
  }, [selectedHomework]);

  return null;
};

export default LoadHomeworkTextSystem;
