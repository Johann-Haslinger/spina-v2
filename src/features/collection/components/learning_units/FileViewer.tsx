import styled from '@emotion/styled';
import { ILeanScopeClient } from '@leanscope/api-client';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityProps, useEntity } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import saveAs from 'file-saver';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  IoArrowDownCircleOutline,
  IoChevronBack,
  IoEllipsisHorizontalCircleOutline,
  IoShareOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import tw from 'twin.macro';
import { useIsViewVisible } from '../../../../common/hooks/useIsViewVisible';
import { FilePathFacet, FilePathProps, TitleProps } from '../../../../common/types/additionalFacets';
import { AdditionalTag, DataType, SupabaseStorageBucket, SupabaseTable } from '../../../../common/types/enums';
import { addNotificationEntity } from '../../../../common/utilities';
import { dataTypeQuery } from '../../../../common/utilities/queries';
import { ActionRow, NavBarButton, View } from '../../../../components';
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
    return;
  }

  lsc.engine.removeEntity(entity);
};

const downloadFile = async (title: string, filePath: string) => {
  const { data, error } = await supabaseClient.storage
    .from(SupabaseStorageBucket.LEARNING_UNIT_FILES)
    .createSignedUrl(filePath, 60 * 60);

  if (error) {
    console.error('Error fetching signed URL:', error);
    return '';
  }

  saveAs(data.signedUrl, title);
};

const fetchFileUrl = async (filePath: string) => {
  console.log('filePath', filePath);
  const { data, error } = await supabaseClient.storage
    .from(SupabaseStorageBucket.LEARNING_UNIT_FILES)
    .createSignedUrl(filePath, 60 * 60);

  if (error) {
    console.error('Error fetching signed URL:', error);
    return '';
  }

  console.log('data', data?.signedUrl);

  return data.signedUrl;
};

const useSelectedFile = () => {
  const [selectedFileEntity] = useEntity((e) => e.has(Tags.SELECTED) && dataTypeQuery(e, DataType.FILE));

  const selectedFilePath = selectedFileEntity?.get(FilePathFacet)?.props.filePath;

  return { selectedFilePath, selectedFileEntity };
};

const useFileUrl = () => {
  const [url, setUrl] = useState<string>('');
  const { selectedFilePath } = useSelectedFile();

  useEffect(() => {
    const loadFileUrl = async () => {
      if (!selectedFilePath) return;

      const publicUrl = await fetchFileUrl(selectedFilePath);

      setUrl(publicUrl);
    };

    loadFileUrl();
  }, [selectedFilePath]);

  return url;
};

const StyledContainer = styled.div`
  ${tw`w-screen overflow-hidden h-screen`}
`;
const StyledHeader = styled.div`
  ${tw`p-4 border-b z-10 h-14 items-center dark:bg-primary-dark border-primary-border dark:border-primary-border-dark w-screen absolute bg-primary flex justify-between`}
`;
const StyledBackButton = styled.div`
  ${tw`cursor-pointer text-2xl flex space-x-2 items-center dark:text-white text-primary-color`}
`;
const StyledNavBar = styled.div`
  ${tw`flex h-fit space-x-4 lg:space-x-8 items-center`}
`;
const StyledContentContainer = styled.div`
  ${tw`w-full pt-14 z-0 h-full dark:bg-black bg-white flex justify-center items-center`}
`;
const StyledImage = styled.img`
  ${tw`border shadow xl:border-0 rounded xl:rounded-none  border-primary-border dark:border-primary-border-dark`}
`;
const StyledIframe = styled.iframe`
  ${tw`border xl:border-0 shadow rounded xl:rounded-none  border-primary-border dark:border-primary-border-dark`}
`;

const FileViewer = (props: EntityProps & TitleProps & FilePathProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { entity, title, filePath } = props;
  const isVisible = useIsViewVisible(entity);

  const url = useFileUrl();
  const viewerRef = useRef<HTMLDivElement>(null);

  const navigateBack = () => entity.add(AdditionalTag.NAVIGATE_BACK);
  const handleDownload = () => downloadFile(title, filePath);
  const handleDelete = () => deleteFile(lsc, entity);

  useOutsideClick(viewerRef, navigateBack);

  const isDisplayedAsImage = title.endsWith('.png') || title.endsWith('.jpg') || title.endsWith('.jpeg');

  const handleShare = async () => {
    if (!url) return;
    if (navigator.share) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], title, { type: blob.type });

        await navigator.share({
          title: 'Teile diese Datei',
          text: 'Schau dir diese Datei an!',
          files: [file],
        });
        console.log('Datei wurde erfolgreich geteilt');
      } catch (error) {
        console.error('Fehler beim Teilen', error);
      }
    } else {
      alert('Teilen wird auf diesem Gerät nicht unterstützt.');
    }
  };

  return (
    <View hidePadding visible={isVisible}>
      <StyledContainer>
        <StyledHeader>
          <StyledBackButton onClick={navigateBack}>
            <IoChevronBack />
            <p tw="text-sm">Zurück</p>
          </StyledBackButton>
          <StyledNavBar>
            <NavBarButton onClick={handleShare}>
              <IoShareOutline />
            </NavBarButton>
            <NavBarButton
              content={
                <div>
                  <ActionRow onClick={handleDownload} icon={<IoArrowDownCircleOutline />}>
                    Herunterladen
                  </ActionRow>
                  <ActionRow last onClick={handleDelete} destructive icon={<IoTrashOutline />}>
                    Löschen
                  </ActionRow>
                </div>
              }
            >
              <IoEllipsisHorizontalCircleOutline />
            </NavBarButton>
          </StyledNavBar>
        </StyledHeader>

        <StyledContentContainer>
          {isDisplayedAsImage && <StyledImage src={url} alt={title} />}

          {title.endsWith('.pdf') && <StyledIframe src={url} title={title} style={{ width: '100%', height: '100%' }} />}
        </StyledContentContainer>
      </StyledContainer>
    </View>
  );
};

export default FileViewer;

const useOutsideClick = (ref: React.RefObject<HTMLDivElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};
