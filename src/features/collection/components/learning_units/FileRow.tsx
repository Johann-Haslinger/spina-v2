import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { ILeanScopeClient } from '@leanscope/api-client/interfaces';
import { Entity, EntityProps } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import saveAs from 'file-saver';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import {
  IoArrowDownCircleOutline,
  IoDocumentOutline,
  IoEllipsisHorizontalCircleOutline,
  IoImageOutline,
  IoOpenOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import tw from 'twin.macro';
import { FilePathFacet, FilePathProps, TitleProps } from '../../../../common/types/additionalFacets';
import { SupabaseStorageBucket, SupabaseTable } from '../../../../common/types/enums';
import { addNotificationEntity } from '../../../../common/utilities';
import { ActionRow, ActionSheet } from '../../../../components';
import supabaseClient from '../../../../lib/supabase';

const deleteFile = async (lsc: ILeanScopeClient, entity: Entity) => {
  const filePath = entity.get(FilePathFacet)?.props.filePath;

  if (!filePath) {
    console.error('File path not found');
    return;
  }

  const { error: storageDeleteError } = await supabaseClient.storage
    .from(SupabaseStorageBucket.LEARNING_UNIT_FILES)
    .remove([filePath]);

  if (storageDeleteError) {
    console.error('Error deleting file:', storageDeleteError);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Löschen der Datei',
      message: storageDeleteError.message,
      type: 'error',
    });
    return;
  }
  const { error: tableDeleteError } = await supabaseClient
    .from(SupabaseTable.LEARNING_UNIT_FILES)
    .delete()
    .eq('file_path', filePath);

  if (tableDeleteError) {
    console.error('Error deleting file from table:', tableDeleteError);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Löschen der Datei',
      message: tableDeleteError.message + ' ' + tableDeleteError.details + ' ' + tableDeleteError.hint,
      type: 'error',
    });
  }

  lsc.engine.removeEntity(entity);
};

const downloadFile = async (lsc: ILeanScopeClient, title: string, filePath: string) => {
  const { data, error } = await supabaseClient.storage
    .from(SupabaseStorageBucket.LEARNING_UNIT_FILES)
    .createSignedUrl(filePath, 60 * 60);

  if (error) {
    console.error('Error fetching signed URL:', error);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Herunterladen der Datei',
      message: error.message,
      type: 'error',
    });
    return;
  }

  saveAs(data.signedUrl, title);
};

const StyledRowWrapper = styled(motion.div)<{ isContextMenuOpen: boolean }>`
  ${tw`flex overflow-hidden scale-100 z-40 space-x-4 pr-4 mb-2 hover:scale-[1.03] transition-all items-center pl-2 justify-between py-3 dark:bg-secondary-dark bg-tertiary bg-opacity-50 rounded-xl border-black border-opacity-5`}
  ${({ isContextMenuOpen }) => isContextMenuOpen && tw`scale-[1.03]  `}
`;

const StyledTitle = styled.p`
  ${tw`line-clamp-2 overflow-hidden w-full`}
`;

const StyledDueDate = styled.p`
  ${tw`text-sm text-secondary-text`}
`;

const StyledIcon = styled.div<{ isActive: boolean }>`
  ${tw`text-2xl text-secondary-text dark:text-secondary-text-dark pr-1 cursor-pointer hover:opacity-60`}
  ${({ isActive }) => isActive && tw`opacity-60`}
`;

const FileRow = (props: TitleProps & FilePathProps & EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { entity, filePath, title } = props;
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  const openFile = () => entity.addTag(Tags.SELECTED);
  const handleDownload = () => downloadFile(lsc, title, filePath);
  const handleDelete = () => deleteFile(lsc, entity);

  return (
    <div>
      <StyledRowWrapper isContextMenuOpen={isContextMenuOpen} key={entity.id}>
        <div onClick={openFile} tw="flex w-full cursor-pointer items-center space-x-6 pl-4 ">
          <div tw="text-2xl text-primary-color">
            {' '}
            {filePath.includes('.png') || filePath.includes('.jpeg') || filePath.includes('.jpg') ? (
              <IoImageOutline />
            ) : (
              <IoDocumentOutline />
            )}
          </div>
          <div>
            <StyledTitle>{title}</StyledTitle>
            <StyledDueDate>Zum Öffnen klicken</StyledDueDate>
          </div>
        </div>
        <StyledIcon isActive={isContextMenuOpen} onClick={() => setIsContextMenuOpen(true)}>
          <IoEllipsisHorizontalCircleOutline />
        </StyledIcon>
      </StyledRowWrapper>
      <div tw="relative ml-4 left-4 bottom-8 z-[500]">
        <ActionSheet visible={isContextMenuOpen} navigateBack={() => setIsContextMenuOpen(false)}>
          <ActionRow first icon={<IoOpenOutline />} onClick={openFile}>
            Öffnen
          </ActionRow>
          <ActionRow onClick={handleDownload} icon={<IoArrowDownCircleOutline />}>
            Herunterladen
          </ActionRow>
          <ActionRow last onClick={handleDelete} destructive icon={<IoTrashOutline />}>
            Löschen
          </ActionRow>
        </ActionSheet>
      </div>
    </div>
  );
};

export default FileRow;
