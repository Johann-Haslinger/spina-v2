import styled from '@emotion/styled';
import { Entity, EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { IoTime } from 'react-icons/io5';
import tw from 'twin.macro';
import {
  DueDateFacet,
  DueDateProps,
  StatusFacet,
  StatusProps,
  TitleFacet,
  TitleProps,
} from '../../../app/additionalFacets';
import { DataType } from '../../../base/enums';
import { useDaysUntilDue } from '../../../hooks/useDaysUntilDue';
import supabaseClient from '../../../lib/supabase';
import { dataTypeQuery } from '../../../utils/queries';
import { useSelectedTheme } from '../../collection/hooks/useSelectedTheme';
import InitializeExamsSystem from '../../exams/systems/InitializeExamsSystem';
import InitializeHomeworksSystem from '../../homeworks/systems/InitializeHomeworksSystem';

enum ResoruceStatus {
  TODO = 1,
  IN_PROGRESS = 2,
  DONE = 3,
  MISSED = 4,
}

const StyledCardWrapper = styled.div`
  ${tw`w-full h-[28rem] overflow-y-scroll p-4 pr-0 rounded-2xl bg-[#A3CB63] bg-opacity-15`}
`;

const StyledFlexContainer = styled.div`
  ${tw`flex text-[#A3CB63] space-x-2 md:opacity-80 items-center`}
`;

const StyledText = styled.div`
  ${tw`font-bold text-sm`}
`;

const PendingResourcesCard = () => {
  // const { hasPendingResources } = usePendingResources();
  const currentDate = new Date();
  const twoWeeksFromNow = new Date(currentDate);
  twoWeeksFromNow.setDate(currentDate.getDate() + 14);

  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  return (
    <div>
      <InitializeHomeworksSystem />
      <InitializeExamsSystem />

      <StyledCardWrapper>
        <StyledFlexContainer>
          <IoTime />
          <StyledText>Anstehende Leistungen</StyledText>
        </StyledFlexContainer>
        <div tw="mt-2 ">
          <EntityPropsMapper
            query={(e) => new Date(e.get(DueDateFacet)?.props.dueDate || '') >= sevenDaysAgo}
            get={[[TitleFacet, StatusFacet, DueDateFacet], []]}
            onMatch={PandingResourceRow}
          />
        </div>
      </StyledCardWrapper>
    </div>
  );
};

export default PendingResourcesCard;

const updateStatus = async (entity: Entity, status: number) => {
  const id = entity.get(IdentifierFacet)?.props.guid;
  const dataType = dataTypeQuery(entity, DataType.HOMEWORK) ? DataType.HOMEWORK : DataType.EXAM;
  entity.add(new StatusFacet({ status }));

  const { error } = await supabaseClient.from(dataType).update({ status }).eq('id', id);

  if (error) {
    console.error('Error updating status:', error);
  }
};

const StyledSelect = styled.select`
  ${tw`outline-none bg-white bg-opacity-0`}
`;

const StyledSelectWrapper = styled.div<{ status: ResoruceStatus; dark: boolean }>`
  ${tw` h-6 flex text-xs dark:text-white text-black space-x-1 rounded-full px-2 py-1`}
  background-color: ${({ status, dark }) => {
    if (status == ResoruceStatus.TODO) {
      if (dark) {
        return '#232323';
      } else {
        return '#00000010';
      }
    } else if (status == ResoruceStatus.IN_PROGRESS) {
      return '#A3CB6360';
    } else if (status == ResoruceStatus.DONE) {
      return '#A3CB63';
    } else if (status == ResoruceStatus.MISSED) {
      return 'rgba(255,59,48,0.4)';
    }
  }};
`;

const PandingResourceRow = (props: TitleProps & StatusProps & DueDateProps & EntityProps) => {
  const { title, status, entity } = props;
  const daysUntilDue = useDaysUntilDue(entity);
  const { isDarkModeAktive } = useSelectedTheme();
  // const isDisplayed = [1, 2, 3].includes(entity.get(StatusFacet)?.props.status || 0);

  const openResource = () => entity.add(Tags.SELECTED);

  return (
    <div
      tw="flex pr-4 items-center hover:opacity-70 transition-all pl-2 justify-between py-1.5 border-b border-black border-opacity-5 "
      onClick={openResource}
    >
      <div>
        <p tw="line-clamp-2">{title}</p>
        <p tw=" text-sm text-seconderyText">{daysUntilDue}</p>
      </div>
      {status}
      {status && (
        <StyledSelectWrapper dark={isDarkModeAktive} status={status}>
          <StyledSelect
            onChange={(e) => updateStatus(entity, parseInt(e.target.value))}
            defaultValue={status}
            value={status}
          >
            <option value={1}>Todo</option>
            <option value={3}>In Arbeit</option>
            <option value={4}>Erledigt</option>
            <option value={5}>Verfehlt</option>
          </StyledSelect>
        </StyledSelectWrapper>
      )}
    </div>
  );
};

// const usePendingResources = () => {
//   const [pendingResourceEntities] = useEntities((e) => e.has(AdditionalTags.PENDING_RESOURCE));

//   const hasPendingResources = pendingResourceEntities.length > 0;

//   return { pendingResourceEntities, hasPendingResources };
// };
