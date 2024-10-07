import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityProps, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { IoTime } from 'react-icons/io5';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import tw from 'twin.macro';
import {
  DueDateFacet,
  DueDateProps,
  RelationshipFacet,
  RelationshipProps,
  StatusFacet,
  StatusProps,
  TitleFacet,
  TitleProps,
} from '../../../base/additionalFacets';
import { AdditionalTag, DataType, ProgressStatus, SupabaseTable } from '../../../base/enums';
import { useLoadingIndicator } from '../../../common/hooks';
import { useDaysUntilDue } from '../../../common/hooks/useDaysUntilDue';
import { dataTypeQuery } from '../../../common/utilities/queries';
import { sortEntitiesByDueDate } from '../../../common/utilities/sortEntitiesByTime';
import supabaseClient from '../../../lib/supabase';
import { useSelectedTheme } from '../../collection/hooks/useSelectedTheme';
import InitializeExamsSystem from '../../exams/systems/InitializeExamsSystem';
import InitializeHomeworksSystem from '../../homeworks/systems/InitializeHomeworksSystem';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-fit md:h-[28rem] overflow-y-scroll p-4 pr-0 rounded-2xl bg-[#A3CB63] bg-opacity-15`}

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const StyledFlexContainer = styled.div`
  ${tw`flex text-[#A3CB63] mb-2 space-x-2 items-center`}
`;

const StyledText = styled.div`
  ${tw`font-bold text-sm`}
`;

const StyledInfoText = styled.div`
  ${tw`mt-2 font-medium`}
`;

const PendingResourcesCard = () => {
  const { hasPendingResources } = usePendingResources();
  const { isLoadingIndicatorVisible } = useLoadingIndicator();
  const [pendingResourceEntities] = useEntities(
    (e) =>
      new Date(e.get(DueDateFacet)?.props.dueDate || '') >= sevenDaysAgo &&
      ([ProgressStatus.TODO, ProgressStatus.IN_PROGRESS].includes(e.get(StatusFacet)?.props.status || 0) ||
        e.has(AdditionalTag.CHANGED)),
  );
  const currentDate = new Date();
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

        {isLoadingIndicatorVisible ? (
          <div>
            <PendingResourceRowSkeleton />
            <PendingResourceRowSkeleton />
            <PendingResourceRowSkeleton />
          </div>
        ) : (
          isLoadingIndicatorVisible == false && (
            <div>
              {!hasPendingResources && (
                <StyledInfoText>Alles erledigt! Du hast aktuell keine anstehenden Leistungen. 🎉</StyledInfoText>
              )}

              {[...pendingResourceEntities]
                .filter((e) => ![4, 3].includes(e.get(StatusFacet)?.props.status || 0))
                .sort(sortEntitiesByDueDate)
                .map((entity, idx) => (
                  <PendingResourceRow
                    key={entity.get(IdentifierFacet)?.props.guid || entity.id + idx}
                    title={entity.get(TitleFacet)?.props.title || ''}
                    status={entity.get(StatusFacet)?.props.status || 0}
                    dueDate={entity.get(DueDateFacet)?.props.dueDate || ''}
                    entity={entity}
                    relationship={entity.get(RelationshipFacet)?.props.relationship || ''}
                  />
                ))}

              {}
            </div>
          )
        )}
      </StyledCardWrapper>
    </div>
  );
};

export default PendingResourcesCard;

const usePendingResources = () => {
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(currentDate.getDate() - 7);

  const [pendingResourceEntities] = useEntities(
    (e) =>
      new Date(e.get(DueDateFacet)?.props.dueDate || '') >= sevenDaysAgo &&
      ([ProgressStatus.TODO, ProgressStatus.IN_PROGRESS].includes(e.get(StatusFacet)?.props.status || 0) ||
        e.has(AdditionalTag.CHANGED)),
  );

  const hasPendingResources = pendingResourceEntities.length > 0;

  return { pendingResourceEntities, hasPendingResources };
};

const updateStatus = async (entity: Entity, status: number) => {
  const id = entity.get(IdentifierFacet)?.props.guid;
  const dataType = dataTypeQuery(entity, DataType.HOMEWORK) ? DataType.HOMEWORK : DataType.EXAM;
  entity.add(new StatusFacet({ status }));
  entity.add(AdditionalTag.CHANGED);

  const { error } = await supabaseClient
    .from(dataType == DataType.HOMEWORK ? SupabaseTable.HOMEWORKS : SupabaseTable.EXAMS)
    .update({ status: status })
    .eq('id', id);

  if (error) {
    console.error('Error updating status:', error);
  }
};

const StyledSelect = styled.select`
  ${tw`outline-none bg-white bg-opacity-0`}
`;

const StyledRowWrapper = styled(motion.div)`
  ${tw`flex pr-4 items-center pl-2 justify-between py-1.5 border-b border-black border-opacity-5`}
`;

const StyledTitle = styled.p`
  ${tw`line-clamp-2 w-full`}
`;

const StyledDueDate = styled.p`
  ${tw`text-sm text-secondary-text`}
`;

const StyledSelectWrapper = styled.div<{ status: ProgressStatus; dark: boolean }>`
  ${tw` h-6 flex text-xs dark:text-white text-black space-x-1 rounded-full px-2 py-1`}
  background-color: ${({ status, dark }) => {
    if (status == ProgressStatus.TODO) {
      if (dark) {
        return '#232323';
      } else {
        return '#00000010';
      }
    } else if (status == ProgressStatus.IN_PROGRESS) {
      return '#A3CB6360';
    } else if (status == ProgressStatus.DONE) {
      return '#A3CB63';
    } else if (status == ProgressStatus.MISSED) {
      return 'rgba(255,59,48,0.4)';
    }
  }};
`;
const PendingResourceRow = (props: TitleProps & StatusProps & DueDateProps & EntityProps & RelationshipProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, status, entity, relationship, dueDate } = props;
  const daysUntilDue = useDaysUntilDue(entity, dueDate);
  const { isDarkModeActive: isDarkModeActivee } = useSelectedTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [relatedSchoolSubjectTitle, setRelatedSchoolSubjectTitle] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(status);
  const isDone = [4, 3].includes(currentStatus || 0);

  useEffect(() => {
    if (currentStatus == status) return;
    const timeoutId = setTimeout(() => {
      updateStatus(entity, currentStatus);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [currentStatus]);

  useEffect(() => {
    if (relationship) {
      const schoolSubjectEntity = lsc.engine.entities.find((e) => e.get(IdentifierFacet)?.props.guid === relationship);
      setRelatedSchoolSubjectTitle(schoolSubjectEntity?.get(TitleFacet)?.props.title || '');
    }
  }, [relationship]);

  const openResource = () => entity.add(Tags.SELECTED);

  return (
    <StyledRowWrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        x: !isDone ? 0 : 400,
      }}
      transition={{ duration: 0.2, type: 'tween' }}
    >
      <motion.div
        animate={{
          x: isHovered ? 15 : 0,
        }}
        onClick={openResource}
      >
        <StyledTitle>{title || 'Kein Titel'}</StyledTitle>
        <StyledDueDate>
          {relatedSchoolSubjectTitle}
          {relatedSchoolSubjectTitle && ','} {daysUntilDue}
        </StyledDueDate>
      </motion.div>
      {status && (
        <StyledSelectWrapper dark={isDarkModeActivee} status={status}>
          <StyledSelect onChange={(e) => setCurrentStatus(parseInt(e.target.value))} value={status.toString()}>
            <option value={ProgressStatus.TODO}>Todo</option>
            <option value={ProgressStatus.IN_PROGRESS}>In Arbeit</option>
            <option value={ProgressStatus.DONE}>Erledigt</option>
            <option value={ProgressStatus.MISSED}>Verfehlt</option>
          </StyledSelect>
        </StyledSelectWrapper>
      )}
    </StyledRowWrapper>
  );
};

const PendingResourceRowSkeleton = () => {
  return (
    <StyledRowWrapper>
      <div tw="w-full dark:opacity-10 transition-all">
        <StyledTitle>
          <Skeleton borderRadius={4} tw="w-1/3 h-3" baseColor="#C0D89B" highlightColor="#D4E2BD" />
        </StyledTitle>
        <StyledDueDate>
          <Skeleton borderRadius={4} baseColor="#D6E3C0" highlightColor="#DFE8D0" tw="w-1/2 h-3" />
        </StyledDueDate>
      </div>
    </StyledRowWrapper>
  );
};
