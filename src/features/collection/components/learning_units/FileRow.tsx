import styled from '@emotion/styled';
import { EntityProps } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { IoDocumentOutline, IoImageOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import { FilePathProps, TitleProps } from '../../../../app/additionalFacets';

const StyledRowWrapper = styled(motion.div)`
  ${tw`flex pr-4 mb-2 hover:scale-105 transition-all items-center pl-2 justify-between py-3 bg-tertiary bg-opacity-50 rounded-xl border-black border-opacity-5`}
`;

const StyledTitle = styled.p`
  ${tw`line-clamp-2`}
`;

const StyledDueDate = styled.p`
  ${tw`text-sm text-seconderyText`}
`;

// const StyledIcon = styled.div`
//   ${tw`text-xl hover:opacity-50 text-seconderyText`}
// `;

const FileRow = (props: TitleProps & FilePathProps & EntityProps) => {
  const { entity, filePath, title } = props;

  // const donwnloadFile = () => saveAs(url, title);
  const openFile = () => entity.addTag(Tags.SELECTED);

  return (
    <StyledRowWrapper key={entity.id}>
      <div onClick={openFile} tw="flex items-center space-x-6 pl-4 ">
        <div tw="text-2xl text-primaryColor">
          {' '}
          {filePath.endsWith('.png') ? <IoImageOutline /> : <IoDocumentOutline />}
        </div>
        <div>
          <StyledTitle>{title}</StyledTitle>
          <StyledDueDate>Zum Öffnen klicken</StyledDueDate>
        </div>
      </div>
      {/* <StyledIcon>
        <IoArrowDownCircleOutline onClick={donwnloadFile} />
      </StyledIcon> */}
    </StyledRowWrapper>
  );
};

export default FileRow;
