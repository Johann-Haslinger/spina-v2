import styled from '@emotion/styled';
import { TextProps } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import tw from 'twin.macro';
import { MessageRoleProps, RelatedResourcesProps } from '../../../app/additionalFacets';
import { COLOR_ITEMS } from '../../../base/constants';
import { MessageRoles } from '../../../base/enums';

const StyledMessageContentWrapper = styled.div<{ role: MessageRoles }>`
  ${tw` ml-8   mb-1 w-72  bg-tertiary dark:text-primaryTextDark  dark:bg-seconderyDark pb-3 transition-all rounded-xl p-2 `}
  ${({ role }) => (role == MessageRoles.USER ? tw`rounded-bl-none ` : tw`rounded-br-none  `)}
`;

const StyledMessageHeader = styled.div`
  ${tw`flex items-center space-y-1 space-x-3`}
`;

const StyledRoleIcon = styled.div<{ role: MessageRoles }>`
  ${tw`w-4 h-4 rounded-full`}
  background-color: ${(props) =>
    props.role === MessageRoles.SAPIENTOR ? COLOR_ITEMS[0].accentColor : COLOR_ITEMS[1].accentColor};
`;

const StyledRoleTitle = styled.p`
  ${tw` mb-2 font-semibold`}
`;

const StyledTextWrapper = styled.div`
  ${tw`pl-6 `}
`;
const StyledRelatedResourcesWrapper = styled.div`
  ${tw`flex items-center hover:opacity-50 transition-all bg-white bg-opacity-5 ml-4 px-2 rounded-lg w-fit mt-3`}
`;

const QuickChatMessage = (props: TextProps & MessageRoleProps & RelatedResourcesProps) => {
  const { text, role, relatedResources = [] } = props;
  const [displayResources, setDisplayResources] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDisplayResources(true);
    }, 400);
  }, []);

  return (
    <div>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <StyledMessageContentWrapper role={role}>
          <StyledMessageHeader>
            <StyledRoleIcon role={role} />
            <StyledRoleTitle>{role === MessageRoles.USER ? 'Du' : 'Sapientor'}</StyledRoleTitle>
          </StyledMessageHeader>

          <StyledTextWrapper dangerouslySetInnerHTML={{ __html: text }} />

          {relatedResources.length > 0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 5,
              }}
              animate={{
                opacity: displayResources ? 1 : 0,
                y: displayResources ? 0 : 5,
              }}
            >
              <StyledRelatedResourcesWrapper>{relatedResources.length} Resources</StyledRelatedResourcesWrapper>
            </motion.div>
          )}
        </StyledMessageContentWrapper>
      </motion.div>
    </div>
  );
};

export default QuickChatMessage;
