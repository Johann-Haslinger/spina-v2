import styled from '@emotion/styled';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { OrderFacet, Tags } from '@leanscope/ecs-models';
import { Fragment } from 'react/jsx-runtime';
import tw from 'twin.macro';
import { TitleFacet } from '../app/additionalFacets';
import { MEDIUM_DEVICE_WIDTH } from '../base/constants';
import { DataType } from '../base/enums';
import { CollectionGrid, NavigationBar, Spacer, Title, View } from '../components';
import { PodcastCollectionView, SchoolSubjectCell, SchoolSubjectView } from '../features/collection';
import { useSelectedLanguage } from '../hooks/useSelectedLanguage';
import { useWindowDimensions } from '../hooks/useWindowDimensions';
import { displayHeaderTexts } from '../utils/displayText';
import { dataTypeQuery } from '../utils/queries';

const StyledTitleWrapper = styled.div`
  ${tw`px-2.5 md:px-0 `}
`;

const Collection = () => {
  const { selectedLanguage } = useSelectedLanguage();
  const { width } = useWindowDimensions();

  return (
    <Fragment>
      <View reducePaddingX={width < MEDIUM_DEVICE_WIDTH} viewType="baseView">
        <NavigationBar />
        <Spacer size={8} />

        <StyledTitleWrapper>
          <Title>{displayHeaderTexts(selectedLanguage).collection}</Title>
        </StyledTitleWrapper>

        <Spacer />
        <CollectionGrid gapSize="small">
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.SCHOOL_SUBJECT)}
            get={[[TitleFacet, OrderFacet], []]}
            onMatch={SchoolSubjectCell}
          />
        </CollectionGrid>
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.SCHOOL_SUBJECT) && e.hasTag(Tags.SELECTED)}
        get={[[TitleFacet], []]}
        onMatch={SchoolSubjectView}
      />

      <PodcastCollectionView />
    </Fragment>
  );
};

export default Collection;
