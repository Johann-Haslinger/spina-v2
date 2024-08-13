import styled from '@emotion/styled/macro';
import { motion } from 'framer-motion';
import tw from 'twin.macro';

const StyledGeneratingIndecatorWrapper = styled.div`
  ${tw`flex mt-40 items-center justify-center`}
`;

const GeneratingIndecator = () => {
  return (
    <StyledGeneratingIndecatorWrapper>
      <motion.div
        style={{
          backgroundColor: '#00965F',
          width: '2rem',
          height: '2rem',
          margin: '0.5rem',
          borderRadius: '50%',
        }}
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      <motion.div
        style={{
          backgroundColor: '#00965F',
          width: '2rem',
          height: '2rem',
          margin: '0.5rem',
          borderRadius: '50%',
        }}
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        style={{
          backgroundColor: '#00965F',
          width: '2rem',
          height: '2rem',
          margin: '0.5rem',
          borderRadius: '50%',
        }}
        animate={{ y: [-20, 10, -20] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </StyledGeneratingIndecatorWrapper>
  );
};

export default GeneratingIndecator;
