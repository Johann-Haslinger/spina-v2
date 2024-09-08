import styled from '@emotion/styled';
import { EntityProps } from '@leanscope/ecs-engine';
import { UrlProps, Tags } from '@leanscope/ecs-models';
import saveAs from 'file-saver';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IoImageOutline, IoDocumentOutline, IoArrowDownCircleOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import { TitleProps, TypeProps } from '../../../../app/additionalFacets';

const StyledRowWrapper = styled(motion.div)`
  ${tw`flex pr-4 items-center pl-2 justify-between py-2 border-b border-black border-opacity-5`}
`;

const StyledTitle = styled.p`
  ${tw`line-clamp-2`}
`;

const StyledDueDate = styled.p`
  ${tw`text-sm text-seconderyText`}
`;

const StyledIcon = styled.div`
  ${tw`text-xl hover:opacity-50 text-seconderyText`}
`;

const FileRow = (props: TitleProps & UrlProps & EntityProps & TypeProps) => {
  const { entity, url, title, type } = props;
  const [isHovered, setIsHovered] = useState(false);

  const donwnloadFile = () => saveAs(url, title);
  const openFile = () => entity.addTag(Tags.SELECTED);

  return (
    <StyledRowWrapper key={entity.id} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div
        animate={{
          x: isHovered ? 15 : 0,
        }}
        onClick={openFile}
        tw="flex items-center space-x-6 pl-4 "
      >
        <div tw="text-2xl text-primaryColor">
          {' '}
          {type.startsWith('image/') ? <IoImageOutline /> : <IoDocumentOutline />}
        </div>
        <div>
          <StyledTitle>{title}</StyledTitle>
          <StyledDueDate>Zum Öffnen klicken</StyledDueDate>
        </div>
      </motion.div>
      <StyledIcon>
        <IoArrowDownCircleOutline onClick={donwnloadFile} />
      </StyledIcon>
    </StyledRowWrapper>
  );
};

export default FileRow;
