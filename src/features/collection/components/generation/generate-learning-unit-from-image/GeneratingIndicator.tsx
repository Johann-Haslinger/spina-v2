import styled from "@emotion/styled";
import { motion } from "framer-motion";
import tw from "twin.macro";

const StyledGeneratingIndicatorWrapper = styled(motion.div)`
  ${tw`flex h-full pb-12 items-center justify-center`}
`;

const ballStyle = {
  backgroundColor: '#325FFF',
  opacity: 0.6,
  width: '3rem',
  height: '3rem',
  margin: '1rem',
  borderRadius: '50%',
};

const GeneratingIndicator = (props: { isVisible: boolean }) => {
  const { isVisible } = props;
  const animationVariants = {
    bounce: (delay: number) => ({
      y: [-20, 20, -20],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        delay,
      },
    }),
  };

  return (
    <StyledGeneratingIndicatorWrapper
      initial={{
        opacity: 0,

        display: 'none',
      }}
      animate={{
        opacity: isVisible ? 1 : 0,

        display: isVisible ? 'flex' : 'none',
      }}
      transition={{ duration: 0.7, type: 'spring' }}
    >
      {[0, 0.2, 0.4].map((delay, index) => (
        <motion.div key={index} style={ballStyle} variants={animationVariants} animate="bounce" custom={delay} />
      ))}
    </StyledGeneratingIndicatorWrapper>
  );
};

export default GeneratingIndicator;