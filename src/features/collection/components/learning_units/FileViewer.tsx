import styled from '@emotion/styled';
import { EntityProps, useEntity } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';
import { FilePathFacet, FilePathProps, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTag, DataType, SupabaseStorageBucket } from '../../../../base/enums';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import supabaseClient from '../../../../lib/supabase';
import { dataTypeQuery } from '../../../../utils/queries';
import { useSelectedTheme } from '../../hooks/useSelectedTheme';

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
  const { entity, title, filePath } = props;
  const isVisible = useIsViewVisible(entity);
  const { isDarkModeActive } = useSelectedTheme();
  const url = useFileUrl();
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const navigateBack = () => entity.add(AdditionalTag.NAVIGATE_BACK);

  useOutsideClick(viewerRef, navigateBack);

  const isFileViewerVisible = isVisible && isLoaded;
  const isDisplayedAsImage = title.endsWith('.png') || title.endsWith('.jpg') || title.endsWith('.jpeg');
  const isDisplayedAsDocument = title.endsWith('.pdf') || title.endsWith('.docx');

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
            {isDisplayedAsImage && <img onLoad={() => setIsLoaded(true)} src={url} alt={title} />}

            {title.endsWith('.pdf') && (
              <iframe
                onLoad={() => setIsLoaded(true)}
                src={url}
                title={title}
                style={{ width: '100%', height: '100%' }}
              />
            )}
            {title.endsWith('.docx') && (
              <iframe
                onLoad={() => setIsLoaded(true)}
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
                title={title}
                style={{ width: '100%', height: '100%' }}
              />
            )}
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
  ${tw` flex justify-center items-center bg-white box-border`}
  ${({ isDisplayedAsDocument }) => (isDisplayedAsDocument ? tw`w-2/3 h-[90%]` : tw`w-fit h-fit`)}
 

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
