import styled from '@emotion/styled';
import { Entity, EntityProps, useEntity } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import { IoArrowDownCircleOutline, IoChevronBack, IoEllipsisHorizontalCircleOutline, IoShareOutline, IoTrashOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import { FilePathFacet, FilePathProps, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTag, DataType, SupabaseStorageBucket, SupabaseTable } from '../../../../base/enums';
import { ActionRow, NavBarButton } from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import supabaseClient from '../../../../lib/supabase';
import { dataTypeQuery } from '../../../../utils/queries';
import { useSelectedTheme } from '../../hooks/useSelectedTheme';
import { ILeanScopeClient } from '@leanscope/api-client';
import saveAs from 'file-saver';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';

const deleteFile = async (lsc: ILeanScopeClient, entity: Entity) => {
  const filePath = entity.get(FilePathFacet)?.props.filePath;
  lsc.engine.removeEntity(entity);

  if (!filePath) {
    console.error('File path not found');
    return;
  }

  const { error: storageDeleteError } = await supabaseClient.storage
    .from(SupabaseStorageBucket.LEARNING_UNIT_FILES)
    .remove([filePath]);

  if (storageDeleteError) {
    console.error('Error deleting file:', storageDeleteError);
  }
  const { error: tableDeleteError } = await supabaseClient
    .from(SupabaseTable.LEARNING_UNIT_FILES)
    .delete()
    .eq('file_path', filePath);

  if (tableDeleteError) {
    console.error('Error deleting file from table:', tableDeleteError);
  }
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

const FileViewer = (props: EntityProps & TitleProps & FilePathProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { entity, title, filePath } = props;
  const isVisible = useIsViewVisible(entity);
  const { isDarkModeActive } = useSelectedTheme();
  const url = useFileUrl();
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const navigateBack = () => entity.add(AdditionalTag.NAVIGATE_BACK);
  const handleDownload = () => downloadFile(title, filePath);
  const handleDelete = () => deleteFile(lsc, entity);


  useOutsideClick(viewerRef, navigateBack);

  const isFileViewerVisible = isVisible && isLoaded;
  const isDisplayedAsImage = title.endsWith('.png') || title.endsWith('.jpg') || title.endsWith('.jpeg');
  const isDisplayedAsDocument = title.endsWith('.pdf') || title.endsWith('.docx');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Teile diese Datei',
          text: 'Schau dir diese Datei an!',
          url: url,
        });
        console.log('Datei wurde erfolgreich geteilt');
      } catch (error) {
        console.error('Fehler beim Teilen', error);
      }
    } else {
      alert('Teilen wird auf diesem Gerät nicht unterstützt.');
    }
  };

  return filePath ? (
    <div>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{
          opacity: isVisible ? (isDarkModeActive ? 0.8 : 0.2) : 0,
        }}
        onClick={navigateBack}
      />
      {url && (
        <div tw="flex  z-[600] justify-center items-center fixed w-screen h-screen">
          <Viewer
            isDisplayedAsDocument={isDisplayedAsDocument}
            ref={viewerRef}
            initial={{ scale: 0, opacity: 0, y: 600 }}
            animate={{
              scale: isFileViewerVisible ? 1 : 0,
              opacity: isFileViewerVisible ? 1 : 0,
              y: isFileViewerVisible ? 0 : 400,
            }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <div tw="p-4 flex justify-between">
              <div
                tw="cursor-pointer text-2xl flex space-x-2 items-center dark:text-white text-primary-color"
                onClick={navigateBack}
              >
                <IoChevronBack />
                <p tw="text-sm">Zurück</p>
              </div>
              <div tw="flex h-fit space-x-4 lg:space-x-8 items-center ">
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
              </div>
            </div>

            <div tw="w-full h-full flex justify-center items-center ">
              {isDisplayedAsImage && <img onLoad={() => setIsLoaded(true)} src={url} alt={title} />}

              {title.endsWith('.pdf') && (
                <iframe
                  onLoad={() => setIsLoaded(true)}
                  src={url}
                  title={title}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </div>
          </Viewer>
        </div>
      )}
    </div>
  ) : null;
};

const Overlay = styled(motion.div)`
  ${tw`  fixed z-[500] top-0 left-0 w-full h-full bg-black flex justify-center items-center`}
`;

const Viewer = styled(motion.div)<{ isDisplayedAsDocument?: boolean }>`
  ${tw`  h-screen w-screen  bg-white dark:bg-black`}

  img {
    ${tw`max-w-full max-h-full`}
  }
`;

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
