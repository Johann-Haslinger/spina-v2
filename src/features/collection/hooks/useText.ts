import { Entity } from "@leanscope/ecs-engine";
import { useEntityFacets } from "@leanscope/ecs-engine/react-api/hooks/useEntityFacets";
import { IdentifierFacet, TextFacet } from "@leanscope/ecs-models";
import { useEffect } from "react";
import { SupabaseTables } from "../../../base/enums";
import { useUserData } from "../../../hooks/useUserData";
import supabaseClient from "../../../lib/supabase";
import { useMockupData } from "../../../hooks/useMockupData";

const fetchText = async (parentId: string, userId: string) => {
  const { data: textData, error } = await supabaseClient
    .from(SupabaseTables.TEXTS)
    .select("text")
    .eq("parent_id", parentId);

  if (error) {
    console.error("Error fetching text", error);
  }

  if (textData?.length === 0) {
    const { error: error2 } = await supabaseClient
      .from(SupabaseTables.TEXTS)
      .insert([{ text: "", parent_id: parentId, user_id: userId }]);

    if (error2) {
      console.error("Error inserting text", error2);
    }
  }

  const text = textData?.[0]?.text;

  return text;
};

export const useText = (entity: Entity) => {
  const parentId = entity.get(IdentifierFacet)?.props.guid;
  const { userId } = useUserData();
  const [textProps] = useEntityFacets(entity, TextFacet);
  const text = textProps.text;
  const { shouldFetchFromSupabase, mockupData } = useMockupData();

  useEffect(() => {
    const loadText = async () => {
      if (!parentId || text) return;

      const loadedText = await fetchText(parentId, userId);
      entity.add(new TextFacet({ text: loadedText }));
    };

    if (shouldFetchFromSupabase) {
      loadText();
    } else if (mockupData) {
      entity.add(
        new TextFacet({
          text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        })
      );
    }
  }, [parentId, userId, mockupData, shouldFetchFromSupabase]);

  const updateText = async (newText: string) => {
    entity.add(new TextFacet({ text: newText }));

    const { error } = await supabaseClient
      .from(SupabaseTables.TEXTS)
      .update({ text: newText })
      .eq("parent_id", parentId);

    if (error) {
      console.error("Error updating text", error);
    }
  };

  return { text, updateText };
};
