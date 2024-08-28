import styled from '@emotion/styled';
import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, OrderFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoAdd } from 'react-icons/io5';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import { DateAddedFacet } from '../../../../app/additionalFacets';
import { DataType, SupabaseTables } from '../../../../base/enums';
import { useUserData } from '../../../../hooks/useUserData';
import supabaseClient from '../../../../lib/supabase';
import { dataTypeQuery, isChildOfQuery } from '../../../../utils/queries';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';

const addChapter = async (lsc: ILeanScopeClient, userId: string, topic?: Entity) => {
  const chapterEntities = lsc.engine.entities.filter(
    (e) => dataTypeQuery(e, DataType.CHAPTER) && isChildOfQuery(e, topic),
  );
  const parentId = topic?.get(IdentifierFacet)?.props.guid;
  const id = v4();
  const dateAdded = new Date().toISOString();
  const orderIndex = chapterEntities.length;

  if (!parentId) return;

  const newChapterEntity = new Entity();
  lsc.engine.addEntity(newChapterEntity);
  newChapterEntity.add(new ParentFacet({ parentId: parentId }));
  newChapterEntity.add(new IdentifierFacet({ guid: id }));
  newChapterEntity.add(new DateAddedFacet({ dateAdded: dateAdded }));
  newChapterEntity.add(new OrderFacet({ orderIndex: orderIndex }));
  newChapterEntity.add(DataType.CHAPTER);

  const { error } = await supabaseClient.from(SupabaseTables.CHAPTERS).insert({
    id: id,
    user_id: userId,
    parent_id: parentId,
    date_added: dateAdded,
    order_index: orderIndex,
  });

  if (error) {
    console.error('Error adding chapter:', error);
    lsc.engine.removeEntity(newChapterEntity);
  }

  setTimeout(() => {
    newChapterEntity.add(Tags.SELECTED);
  }, 200);
};

const StyledButtonWrapper = styled.div<{ color: string }>`
  ${tw`flex items-center hover:opacity-50 transition-all text-primaryColor py-3 pl-4 space-x-4`}
`;

const StyledIcon = styled.div`
  ${tw`text-2xl`}
`;

const AddChapterButton = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { color: accentColor } = useSelectedSchoolSubjectColor();
  const { userId } = useUserData();
  const { selectedTopicEntity } = useSelectedTopic();

  const handleAddChapter = () => addChapter(lsc, userId, selectedTopicEntity);

  return (
    <StyledButtonWrapper color={accentColor} onClick={handleAddChapter}>
      <StyledIcon>
        <IoAdd />
      </StyledIcon>
      <p>Kapitel hinzufügen</p>
    </StyledButtonWrapper>
  );
};

export default AddChapterButton;
