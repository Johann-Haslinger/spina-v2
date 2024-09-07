import styled from '@emotion/styled';
import { EntityProps } from '@leanscope/ecs-engine';
import { Tags, UrlProps } from '@leanscope/ecs-models';
import tw from 'twin.macro';
import { FileProps } from '../../../../app/additionalFacets';

const FileViewer = (props: FileProps & UrlProps & EntityProps) => {
  const { file, url, entity } = props;

  const navigateBack = () => entity.remove(Tags.SELECTED);
  return (
    <Overlay onClick={navigateBack}>
      <Viewer fullscreen={file.type === 'application/pdf'}>
        {file.type.startsWith('image/') && <img src={url} alt={file.name} />}
        {file.type === 'application/pdf' && (
          <iframe src={url} title={file.name} style={{ width: '100%', height: '100%' }} />
        )}
      </Viewer>
    </Overlay>
  );
};

const Overlay = styled.div`
  ${tw` z-[600] fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center`}
`;

const Viewer = styled.div<{ fullscreen?: boolean }>`
  ${tw`relative flex justify-center items-center bg-white box-border`}
  ${({ fullscreen }) => (fullscreen ? tw`w-screen h-screen` : tw`w-4/5 h-4/5`)}

  img {
    ${tw`max-w-full max-h-full`}
  }
`;

export default FileViewer;
