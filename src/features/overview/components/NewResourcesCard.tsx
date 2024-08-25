import styled from '@emotion/styled';
import { EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { IoFileTray } from 'react-icons/io5';
import tw from 'twin.macro';
import { DateAddedFacet, TitleFacet, TitleProps } from '../../../app/additionalFacets';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-[28rem] p-4 text-[#EF9D4A] rounded-2xl bg-[#EF9D4A] bg-opacity-15`}
`;

const StyledFlexContainer = styled.div`
  ${tw`flex space-x-2 mb-2 md:opacity-80 items-center`}
`;

const StyledText = styled.div`
  ${tw`font-bold text-sm`}
`;

const StyledInfoText = styled.div`
  ${tw` font-medium`}
`;

const NewResourcesCard = () => {
  const { hasNewResources, sevenDaysAgo } = useNewResources();

  return (
    <StyledCardWrapper>
      <StyledFlexContainer>
        <IoFileTray />
        <StyledText>Neu hinzugefügt</StyledText>
      </StyledFlexContainer>
      {!hasNewResources && <StyledInfoText>Du hast in den letzten Tagen nichts neues mehr hinzugefügt.</StyledInfoText>}
      <EntityPropsMapper
        query={(e) => new Date(e.get(DateAddedFacet)?.props.dateAdded || '') >= sevenDaysAgo}
        get={[[TitleFacet], []]}
        onMatch={NewResourceRow}
      />
    </StyledCardWrapper>
  );
};

export default NewResourcesCard;

const useNewResources = () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [newResourceEntities] = useEntities(
    (e) => new Date(e.get(DateAddedFacet)?.props.dateAdded || '') >= sevenDaysAgo,
  );

  const hasNewResources = newResourceEntities.length > 0;

  return { hasNewResources, sevenDaysAgo };
};

const NewResourceRow = (props: TitleProps) => {
  const {} = props;

  return <div></div>;
};
