import styled from '@emotion/styled';
import { EntityProps, useEntity } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { useEffect, useState } from 'react';
import tw from 'twin.macro';
import { FilePathFacet } from '../../../../app/additionalFacets';
import { DataType, SupabaseStorageBucket } from '../../../../base/enums';
import supabaseClient from '../../../../lib/supabase';
import { dataTypeQuery } from '../../../../utils/queries';

const fetchFileUrl = async (filePath: string) => {
  const { data } = supabaseClient.storage.from(SupabaseStorageBucket.LEARNING_UNIT_FILES).getPublicUrl(filePath);

  return data.publicUrl;
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

const FileViewer = (props: EntityProps) => {
  const { entity } = props;
  const url = useFileUrl();

  const navigateBack = () => entity.remove(Tags.SELECTED);

  return (
    <Overlay onClick={navigateBack}>
      {/* <Viewer fullscreen={file.type === 'application/pdf'}>
        {file.type.startsWith('image/') && <img src={url} alt={file.name} />}
        {file.type === 'application/pdf' && (
          <iframe src={url} title={file.name} style={{ width: '100%', height: '100%' }} />
        )}
      </Viewer> */}
      <Viewer>{url && <img src={url} />}</Viewer>
    </Overlay>
  );
};

const Overlay = styled.div`
  ${tw` z-[600] fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center`}
`;

const Viewer = styled.div<{ fullscreen?: boolean }>`
  ${tw`relative min-w-60 min-h-40 flex justify-center items-center bg-white box-border`}
  ${({ fullscreen }) => (fullscreen ? tw`w-screen h-screen` : tw`w-4/5 h-4/5`)}

  img {
    ${tw`max-w-full max-h-full`}
  }
`;

export default FileViewer;
