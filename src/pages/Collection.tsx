import styled from '@emotion/styled';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, OrderFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { Fragment } from 'react/jsx-runtime';
import tw from 'twin.macro';
import { DueDateFacet, LearningUnitTypeFacet, PriorityFacet, TitleFacet } from '../base/additionalFacets';
import { MEDIUM_DEVICE_WIDTH } from '../base/constants';
import { DataType } from '../base/enums';
import { useLoadingIndicator } from '../common/hooks';
import { useSelectedLanguage } from '../common/hooks/useSelectedLanguage';
import { useWindowDimensions } from '../common/hooks/useWindowDimensions';
import { displayHeaderTexts } from '../common/utilities/displayText';
import { dataTypeQuery } from '../common/utilities/queries';
import { CollectionGrid, NavigationBar, Spacer, Title, View } from '../components';
import { BookmarksCell, HomeworkView, SchoolSubjectCell, SchoolSubjectView } from '../features/collection';
import BookmarksView from '../features/collection/components/bookmark/BookmarksView';
import ExerciseView from '../features/collection/components/exercises/ExerciseView';
import LearningUnitView from '../features/collection/components/learning_units/LearningUnitView';
import SchoolSubjectCellSkeleton from '../features/collection/components/school-subjects/SchoolSubjectCellSkeleton';

const StyledTitleWrapper = styled.div`
  ${tw`px-2.5 md:px-0 `}
`;

const Collection = () => {
  const { selectedLanguage } = useSelectedLanguage();
  const { width } = useWindowDimensions();
  const { isLoadingIndicatorVisible } = useLoadingIndicator();

  return (
    <div>
      <View reducePaddingX={width < MEDIUM_DEVICE_WIDTH} viewType="baseView">
        <NavigationBar />
        <Spacer size={8} />

        <StyledTitleWrapper>
          <Title>{displayHeaderTexts(selectedLanguage).collection}</Title>
        </StyledTitleWrapper>

        <Spacer />
        <CollectionGrid gapSize="small">
          {!isLoadingIndicatorVisible ? (
            <Fragment>
              <EntityPropsMapper
                query={(e) => dataTypeQuery(e, DataType.SCHOOL_SUBJECT)}
                get={[[TitleFacet, OrderFacet], []]}
                onMatch={SchoolSubjectCell}
              />
              <BookmarksCell />
            </Fragment>
          ) : (
            Array.from({ length: 6 }).map((_, index) => <SchoolSubjectCellSkeleton key={index} />)
          )}
        </CollectionGrid>
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.SCHOOL_SUBJECT) && e.hasTag(Tags.SELECTED)}
        get={[[TitleFacet], []]}
        onMatch={SchoolSubjectView}
      />

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.LEARNING_UNIT) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet, LearningUnitTypeFacet, PriorityFacet], []]}
        onMatch={LearningUnitView}
      />

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.HOMEWORK) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet, TextFacet, DueDateFacet], []]}
        onMatch={HomeworkView}
      />

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.EXERCISE) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={ExerciseView}
      />

      <BookmarksView />
    </div>
  );
};

export default Collection;
