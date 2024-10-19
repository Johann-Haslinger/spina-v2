import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import tw from 'twin.macro';
import { useSelectedTheme } from '../../../features/collection/hooks/useSelectedTheme';

const StyledBackgroundOverlay = styled(motion.div)`
  ${tw`fixed  w-full h-full top-0 left-0`}
`;

const BackgroundOverlay = (props: { isVisible: boolean; overlayBaseUI?: boolean }) => {
  const { isVisible } = props;
  const { isDarkModeActive } = useSelectedTheme();

  return (
    <StyledBackgroundOverlay
      initial={{
        backgroundColor: '#0000010',
        display: 'none',
        z: props.overlayBaseUI ? 100 : 'auto',
      }}
      animate={{
        backgroundColor: isVisible ? (isDarkModeActive ? '#00000080' : '#00000020') : '#0000000',
        display: isVisible ? 'block' : 'none',
      }}
    />
  );
};

export default BackgroundOverlay;
