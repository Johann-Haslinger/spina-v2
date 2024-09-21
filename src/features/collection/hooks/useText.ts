import { Entity, useEntityComponents, useEntityHasTags } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { useEffect, useState } from 'react';
import { SupabaseColumn, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import { useUserData } from '../../../hooks/useUserData';
import supabaseClient from '../../../lib/supabase';

const fetchText = async (parentId: string, userId: string) => {
  const { data: textData, error } = await supabaseClient
    .from(SupabaseTable.TEXTS)
    .select('text')
    .eq(SupabaseColumn.PARENT_ID, parentId);

  if (error) {
    console.error('Error fetching text', error);
  }

  if (textData?.length === 0) {
    const { error: error2 } = await supabaseClient
      .from(SupabaseTable.TEXTS)
      .insert([{ text: '', parent_id: parentId, user_id: userId }]);

    if (error2) {
      console.error('Error inserting text', error2);
    }
  }

  const text = textData?.[0]?.text;

  return text;
};

export const useText = (entity: Entity) => {
  const parentId = entity.get(IdentifierFacet)?.props.guid;
  const { userId } = useUserData();
  const [textFacet] = useEntityComponents(entity, TextFacet);
  const [isEntitySelected] = useEntityHasTags(entity, Tags.SELECTED);
  const { isUsingSupabaseData: shouldFetchFromSupabase, isUsingMockupData: mockupData } = useCurrentDataSource();
  const [text, setText] = useState(textFacet?.props.text || '');

  useEffect(() => {
    const loadText = async () => {
      if (!parentId) return;

      if (entity.get(TextFacet)?.props.text) {
        setText(entity.get(TextFacet)?.props.text || '');
        return;
      }

      const loadedText = await fetchText(parentId, userId);
      entity.add(new TextFacet({ text: loadedText }));
      setText(loadedText);
    };

    if (shouldFetchFromSupabase) {
      loadText();
    } else if (mockupData) {
      entity.add(
        new TextFacet({
          text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
        }),
      );
    }
  }, [parentId, userId, mockupData, shouldFetchFromSupabase, isEntitySelected]);

  const updateText = async (newText: string) => {
    entity.add(new TextFacet({ text: newText }));

    const { error } = await supabaseClient
      .from(SupabaseTable.TEXTS)
      .update({ text: newText })
      .eq(SupabaseColumn.PARENT_ID, parentId);

    if (error) {
      console.error('Error updating text', error);
    }
  };

  const updateValue = (newText: string) => setText(newText);

  return { text, updateText, updateValue };
};
