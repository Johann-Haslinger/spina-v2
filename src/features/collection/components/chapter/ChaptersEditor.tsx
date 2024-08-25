import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, OrderFacet, ParentFacet, ParentProps } from '@leanscope/ecs-models';
import { IoBookOutline } from 'react-icons/io5';
import { DateAddedFacet, TitleFacet } from '../../../../app/additionalFacets';
import { DataType } from '../../../../base/enums';
import { NavBarButton, NavigationBar, View } from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { dataTypeQuery } from '../../../../utils/queries';
import ChapterSection from './ChapterSection';

const ChapterEditor = (props: ParentProps & EntityProps) => {
  const { parentId, entity } = props;
  const isVisble = useIsViewVisible(entity);

  return (
    <View visible={isVisble}>
      <NavigationBar>
        <NavBarButton>
          <IoBookOutline />
        </NavBarButton>
      </NavigationBar>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.CHAPTER) && e.get(ParentFacet)?.props.parentId === parentId}
        sort={(a, b) => (a.get(OrderFacet)?.props.orderIndex || 0) - (b.get(OrderFacet)?.props.orderIndex || 0)}
        get={[[TitleFacet, DateAddedFacet, OrderFacet, ParentFacet, IdentifierFacet], []]}
        onMatch={ChapterSection}
      />
    </View>
  );
};

export default ChapterEditor;
