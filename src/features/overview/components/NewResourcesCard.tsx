import styled from '@emotion/styled';
import { EntityProps, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IoFileTray } from 'react-icons/io5';
import tw from 'twin.macro';
import { DateAddedFacet, TitleFacet, TitleProps } from '../../../app/additionalFacets';
import { DataType } from '../../../base/enums';
import { dataTypeQuery } from '../../../utils/queries';
import { sortEntitiesByDateAdded } from '../../../utils/sortEntitiesByTime';
import { useFormattedDateAdded } from '../../collection/hooks/useFormattedDateAdded';
import InitializeRecentlyAddedResources from '../systems/InitializeRecentlyAddedResources';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-fit md:h-[28rem] overflow-y-scroll pr-0 p-4  rounded-2xl bg-[#EF9D4A] bg-opacity-15`}
`;

const StyledFlexContainer = styled.div`
  ${tw`flex space-x-2 text-[#EF9D4A] mb-2 md:opacity-80 items-center`}
`;

const StyledText = styled.div`
  ${tw`font-bold text-sm`}
`;

const StyledInfoText = styled.div`
  ${tw` font-medium `}
`;

const NewResourcesCard = () => {
  const { hasNewResources, sevenDaysAgo } = useNewResources();

  return (
    <div>
      <InitializeRecentlyAddedResources />

      <StyledCardWrapper>
        <StyledFlexContainer>
          <IoFileTray />
          <StyledText>Neu hinzugefügt</StyledText>
        </StyledFlexContainer>
        {!hasNewResources && (
          <StyledInfoText>Du hast in den letzten Tagen nichts neues mehr hinzugefügt.</StyledInfoText>
        )}
        <EntityPropsMapper
          query={(e) =>
            new Date(e.get(DateAddedFacet)?.props.dateAdded || '') >= sevenDaysAgo &&
            dataTypeQuery(e, DataType.LEARNING_UNIT)
          }
          get={[[TitleFacet, DateAddedFacet], []]}
          sort={sortEntitiesByDateAdded}
          onMatch={NewResourceRow}
        />
      </StyledCardWrapper>
    </div>
  );
};

export default NewResourcesCard;

const useNewResources = () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [newResourceEntities] = useEntities(
    (e) =>
      new Date(e.get(DateAddedFacet)?.props.dateAdded || '') >= sevenDaysAgo &&
      dataTypeQuery(e, DataType.LEARNING_UNIT),
  );

  const hasNewResources = newResourceEntities.length > 0;

  return { hasNewResources, sevenDaysAgo };
};

const StyledRowWrapper = styled(motion.div)`
  ${tw`flex pr-4 items-center pl-2 justify-between py-1.5 border-b border-black border-opacity-5`}
`;

const StyledTitle = styled.p`
  ${tw`line-clamp-2 text-primary dark:text-primaryTextDark`}
`;

const StyledDueDate = styled.p`
  ${tw`text-sm text-seconderyText`}
`;

const NewResourceRow = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const formattedDateAdded = useFormattedDateAdded(entity, true);
  const [isHovered, setIsHovered] = useState(false);

  const openResource = () => entity.add(Tags.SELECTED);

  return (
    <StyledRowWrapper onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div
        animate={{
          x: isHovered ? 15 : 0,
        }}
        onClick={openResource}
      >
        <StyledTitle>{title}</StyledTitle>
        <StyledDueDate>{formattedDateAdded}</StyledDueDate>
      </motion.div>
    </StyledRowWrapper>
  );
};
