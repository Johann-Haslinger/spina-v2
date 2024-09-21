import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { FloatOrderFacet, IdentifierFacet, ImageFacet, ParentFacet } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { ChangeEvent, Fragment, useContext, useEffect, useRef, useState } from 'react';
import { IoCodeSlash, IoGrid, IoImage, IoRemove } from 'react-icons/io5';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import { BlocktypeFacet } from '../../../../app/additionalFacets';
import { COLOR_ITEMS } from '../../../../base/constants';
import { Blocktype, DataType } from '../../../../base/enums';
import { useUserData } from '../../../../hooks/useUserData';
import { addBlock } from '../../functions/addBlock';
import { changeBlockeditorState } from '../../functions/changeBlockeditorState';
import { getHighestOrder } from '../../functions/orderHelper';
import { useCurrentBlockeditor } from '../../hooks/useCurrentBlockeditor';

const StyledCreateMenuWrapper = styled.div`
  ${tw`bg-white bg-opacity-90 backdrop-blur-xl dark:bg-secondary-dark h-20 overflow-y-clip  rounded-lg pr-1 flex  md:overflow-hidden  w-11/12 md:w-[30rem]  shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)]`}
`;

const StyledCreateMenuContainer = styled.div`
  ${tw`flex w-screen justify-center`}
`;

const StyledCreateOptionWrapper = styled.div<{ color: string }>`
  ${tw`w-full hover:opacity-80 transition-all  min-w-[4rem] p-2 bg-opacity-10 text-white rounded-lg mr-0 m-1 `}
  color: ${(props) => props.color};
  background-color: ${(props) => props.color + '50'};
`;

const StyledIconWrapper = styled.div`
  ${tw`text-2xl flex justify-center mt-2`}
`;

const StyledTextWrapper = styled.p`
  ${tw`text-xs mt-1 opacity-60 w-full text-center font-light`}
`;

type option = {
  icon: React.ReactNode;
  color: string;
  blockType: Blocktype;
};

const getStringForBlockType = (blockType: Blocktype) => {
  switch (blockType) {
    case 'text':
      return 'Text';
    case 'image':
      return 'Bild';
    case 'list':
      return 'Liste';
    case 'divider':
      return 'Trenner';
    case 'todo':
      return 'Todo';
    case 'table':
      return 'Tabelle';
    case 'code':
      return 'Code';
  }
};

const CreateOption = (props: { isVisible: boolean; option: option }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { option } = props;
  const [isSelectingImageSrc, setIsSelectingImageSrc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { blockType, icon, color: color } = option;
  const { blockeditorId, blockeditorEntity } = useCurrentBlockeditor();
  const { userId } = useUserData();

  useEffect(() => {
    if (isSelectingImageSrc && fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  }, [isSelectingImageSrc]);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const image = new Image();
      image.src = reader.result as string;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const maxWidth = 1080;
        const maxHeight = 180;

        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        context?.drawImage(image, 0, 0, width, height);

        const resizedImage = canvas.toDataURL('image/jpeg');

        addImageBlock(resizedImage);
      };
    };

    if (selectedFile) reader.readAsDataURL(selectedFile);
    setIsSelectingImageSrc(false);
    return '';
  };

  const openFilePicker = () => {
    setIsSelectingImageSrc(true);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const addImageBlock = async (url: string) => {
    const newImageBlock = new Entity();
    newImageBlock.add(new IdentifierFacet({ guid: v4() }));
    newImageBlock.add(new ImageFacet({ imageSrc: url || '' }));
    newImageBlock.add(new BlocktypeFacet({ blocktype: Blocktype.IMAGE }));
    newImageBlock.add(
      new FloatOrderFacet({
        index: getHighestOrder(lsc, blockeditorId || '') + 1,
      }),
    );
    newImageBlock.add(new ParentFacet({ parentId: blockeditorId || '' }));
    newImageBlock.add(DataType.BLOCK);

    addBlock(lsc, newImageBlock, userId);
  };

  const addDividerBlock = async () => {
    const newDividerBlock = new Entity();
    newDividerBlock.add(new IdentifierFacet({ guid: v4() }));
    newDividerBlock.add(new BlocktypeFacet({ blocktype: Blocktype.DIVIDER }));
    newDividerBlock.add(
      new FloatOrderFacet({
        index: getHighestOrder(lsc, blockeditorId || '') + 1,
      }),
    );
    newDividerBlock.add(new ParentFacet({ parentId: blockeditorId || '' }));
    newDividerBlock.add(DataType.BLOCK);

    addBlock(lsc, newDividerBlock, userId);
  };

  const addBlockByBlockType = async (blockType: Blocktype) => {
    switch (blockType) {
      case 'image':
        openFilePicker();
        break;
      case 'divider':
        addDividerBlock();
        break;
    }

    changeBlockeditorState(blockeditorEntity, 'view');
  };

  return (
    <Fragment>
      <StyledCreateOptionWrapper color={color} onClick={() => addBlockByBlockType(blockType)}>
        <StyledIconWrapper> {icon}</StyledIconWrapper>
        <StyledTextWrapper>{getStringForBlockType(blockType)}</StyledTextWrapper>
      </StyledCreateOptionWrapper>

      {isSelectingImageSrc && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
      )}
    </Fragment>
  );
};

const Createmenu = () => {
  const { blockeditorState } = useCurrentBlockeditor();
  const isVisible = blockeditorState === 'create';

  const editOptions: option[] = [
    {
      blockType: Blocktype.IMAGE,
      icon: <IoImage />,

      color: COLOR_ITEMS[1].color,
    },
    {
      blockType: Blocktype.DIVIDER,
      icon: <IoRemove />,

      color: COLOR_ITEMS[3].color,
    },
    {
      blockType: Blocktype.TABLE,
      icon: <IoGrid />,

      color: COLOR_ITEMS[4].color,
    },
    {
      blockType: Blocktype.CODE,
      icon: <IoCodeSlash />,

      color: COLOR_ITEMS[8].color,
    },
  ];

  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target && (event.target as Node))) {
      changeBlockeditorState(undefined, 'view');
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      ref={menuRef}
      transition={{ type: 'Tween' }}
      animate={{ y: !isVisible ? 200 : 0 }}
      initial={{ y: 200, position: 'fixed', bottom: 20, left: 0 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
    >
      <StyledCreateMenuContainer>
        <StyledCreateMenuWrapper>
          {editOptions.map((option) => (
            <CreateOption isVisible={isVisible} option={option} key={option.blockType} />
          ))}
        </StyledCreateMenuWrapper>
      </StyledCreateMenuContainer>
    </motion.div>
  );
};

export default Createmenu;
