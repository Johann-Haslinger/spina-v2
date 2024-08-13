import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { IoAdd } from 'react-icons/io5';
import { AnswerFacet, MasteryLevelFacet, QuestionFacet, TitleProps } from '../../../app/additionalFacets';
import { AdditionalTags, DataTypes } from '../../../base/enums';
import { BackButton, CollectionGrid, NavBarButton, NavigationBar, Spacer, Title, View } from '../../../components';
import { useIsViewVisible } from '../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';
import { displayHeaderTexts } from '../../../utils/displayText';
import { dataTypeQuery, isChildOfQuery } from '../../../utils/queries';
import { FlashcardCell } from '../../collection';

const FlashcardGroupView = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { selectedLanguage } = useSelectedLanguage();
  const isVisible = useIsViewVisible(entity);

  const navigateBack = () => entity.add(AdditionalTags.NAVIGATE_BACK);

  return (
    <View visible={isVisible}>
      <NavigationBar>
        <NavBarButton>
          <IoAdd />
        </NavBarButton>
      </NavigationBar>
      <BackButton navigateBack={navigateBack}>{displayHeaderTexts(selectedLanguage).study}</BackButton>
      <Title>{title}</Title>
      <Spacer size={6} />
      <CollectionGrid columnSize="large">
        <EntityPropsMapper
          query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD) && isChildOfQuery(e, entity)}
          get={[[QuestionFacet, AnswerFacet, MasteryLevelFacet], []]}
          onMatch={FlashcardCell}
        />
      </CollectionGrid>
    </View>
  );
};

export default FlashcardGroupView;
