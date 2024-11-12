import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useMemo } from 'react';
import { IoAdd, IoBarChart } from 'react-icons/io5';
import tw from 'twin.macro';
import { useGradeTypes } from '../../../../common/hooks';
import { useSchoolSubjectEntities } from '../../../../common/hooks/useSchoolSubjects';
import { TitleFacet, TypeFacet, ValueFacet } from '../../../../common/types/additionalFacets';
import { DataType, Story } from '../../../../common/types/enums';
import { dataTypeQuery } from '../../../../common/utilities/queries';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-[28rem] overflow-hidden grid grid-cols-2 grid-rows-2 gap-4`}
`;

const StyledCard = styled.div`
  ${tw`p-4 rounded-2xl bg-[#6EBED9] bg-opacity-15 h-full w-full`}
`;

const StyledBigText = styled.p`
  ${tw`text-[44px] mt-2 font-black text-[#6EBED9]`}
`;

const StyledSubtitle = styled.p`
  ${tw`mt-2 font-semibold`}
`;

const StyledDescription = styled.p`
  ${tw`mt-1 text-base left-[20px] text-secondary-text`}
`;

const GradesDetailsCard = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { bestSubject, worstSubject, overallAverage } = useGradeDetails();

  const openAddGradeSheet = () => lsc.stories.transitTo(Story.AddING_GRADE_STORY);

  return (
    <StyledCardWrapper>
      <StyledCard>
        <StyledBigText>{overallAverage || '--'}</StyledBigText>
        <StyledSubtitle>Durchschnitt</StyledSubtitle>
        <StyledDescription>
          {overallAverage
            ? `Du hast einen Notendurchschnitt von ${overallAverage} Punkten.`
            : 'Du hast noch keine Noten.'}
        </StyledDescription>
      </StyledCard>
      <StyledCard>
        <StyledBigText>{bestSubject?.average || '--'}</StyledBigText>
        <StyledSubtitle>{bestSubject?.title || 'Bestes Fach'}</StyledSubtitle>
        <StyledDescription>
          {bestSubject ? `${bestSubject.title}  ist dein bestes Fach.` : 'Du hast noch keine Noten.'}
        </StyledDescription>
      </StyledCard>
      <StyledCard>
        <StyledBigText>{worstSubject?.average || '--'}</StyledBigText>
        <StyledSubtitle>{worstSubject?.title || 'Schwächstes Fach'}</StyledSubtitle>
        <StyledDescription>
          {worstSubject ? `${worstSubject.title}  ist dein schwächstes Fach.` : 'Du hast noch keine Noten.'}
        </StyledDescription>
      </StyledCard>
      <StyledCard onClick={openAddGradeSheet}>
        <StyledBigText tw="mt-4 text-5xl mb-4">{overallAverage ? <IoBarChart /> : <IoAdd />}</StyledBigText>
        <StyledSubtitle>{overallAverage ? 'Statistiken' : 'Noten hinzufügen'}</StyledSubtitle>
        <StyledDescription>
          {overallAverage ? 'Statistiken zu deinen Noten.' : 'Du hast aktuell noch keine Noten.'}
        </StyledDescription>
      </StyledCard>
    </StyledCardWrapper>
  );
};

export default GradesDetailsCard;

const useGradeDetails = () => {
  const schoolSubjectEntities = useSchoolSubjectEntities();
  const grades = useGrades();
  const gradeTypes = useGradeTypes();

  const results = useMemo(() => {
    const subjectAverages = schoolSubjectEntities
      .map((subjectEntity) => {
        const subjectGrades = grades.filter(
          (grade) => grade.parent_id === subjectEntity.get(IdentifierFacet)?.props.guid,
        );

        if (subjectGrades.length === 0) {
          return null;
        }

        const weightedSum = subjectGrades.reduce((sum, grade) => {
          const gradeType = gradeTypes.find((type) => type.id === grade.type_id);
          return sum + grade.value * (gradeType?.weight || 1);
        }, 0);

        const weightSum = subjectGrades.reduce((sum, grade) => {
          const gradeType = gradeTypes.find((type) => type.id === grade.type_id);
          return sum + (gradeType?.weight || 1);
        }, 0);

        const average = weightedSum / weightSum;
        const title = subjectEntity.get(TitleFacet)?.props.title || '';
        return { ...subjectEntity, average, title };
      })
      .filter(Boolean);

    const sortedSubjects = subjectAverages
      .filter((subject) => subject !== null && !isNaN(subject.average))
      .sort((a, b) => (b?.average ?? 0) - (a?.average ?? 0));

    const bestSubject = sortedSubjects.length > 0 ? sortedSubjects[0] : null;
    const worstSubject = sortedSubjects.length > 1 ? sortedSubjects[sortedSubjects.length - 1] : null;

    const overallAverage =
      subjectAverages.reduce((sum, subject) => sum + (subject?.average ?? 0), 0) / subjectAverages.length;

    return { bestSubject, worstSubject, overallAverage, subjectAverages };
  }, [schoolSubjectEntities.length, grades, gradeTypes]);

  return results;
};

const useGrades = () => {
  const [gradeEntities] = useEntities((e) => dataTypeQuery(e, DataType.GRADE));

  const grades = useMemo(
    () =>
      gradeEntities.map((entity) => ({
        value: entity.get(ValueFacet)?.props.value || 0,
        parent_id: entity.get(ParentFacet)?.props.parentId || '',
        type_id: entity.get(TypeFacet)?.props.type || '',
      })),
    [gradeEntities.length],
  );

  return grades;
};
