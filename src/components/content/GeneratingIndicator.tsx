import styled from '@emotion/styled/macro';
import { motion } from 'framer-motion';
import tw from 'twin.macro';

const StyledGeneratingIndicatorWrapper = styled.div`
  ${tw`flex lg:mt-48 xl:mt-60 mt-40 items-center justify-center`}
`;

const GeneratingIndicator = () => {
  return (
    <StyledGeneratingIndicatorWrapper>
      <motion.div
        style={{
          backgroundColor: '#00965F',
          width: '4rem',
          height: '4rem',
          margin: '1rem',
          borderRadius: '50%',
        }}
        animate={{ y: [-30, 30, -30] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      <motion.div
        style={{
          backgroundColor: '#00965F',
          width: '4rem',
          height: '4rem',
          margin: '1rem',
          borderRadius: '50%',
        }}
        animate={{ y: [30, -30, 30] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        style={{
          backgroundColor: '#00965F',
          width: '4rem',
          height: '4rem',
          margin: '1rem',
          borderRadius: '50%',
        }}
        animate={{ y: [-30, 15, -30] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </StyledGeneratingIndicatorWrapper>
  );
};

export default GeneratingIndicator;
