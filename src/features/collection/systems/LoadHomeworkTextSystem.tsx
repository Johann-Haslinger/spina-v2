import {  useEntity } from "@leanscope/ecs-engine";
import {
  IdentifierFacet,
  Tags,
  TextFacet,
} from "@leanscope/ecs-models";
import {  useEffect } from "react";
import { dummyText } from "../../../base/dummy";
import { DataTypes } from "../../../base/enums";
import supabaseClient from "../../../lib/supabase";
import { useMockupData } from "../../../hooks/useMockupData";

const fetchHomeworkText = async (homeworkId: string) => {
  const { data: text, error } = await supabaseClient
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

const LoadHomeworkTextSystem = () => {
  const { mockupData } = useMockupData();
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
