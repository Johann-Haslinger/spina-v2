import styled from '@emotion/styled/macro';
import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';

const StyledMessageWrapper = styled.div`
  ${tw`outline-none`}
`;

interface TypingAnimationProps {
  text: string;
  playAnimation: boolean;
  onWritingAnimationPlayed?: () => void;
}

const TypingAnimationInnerHTML: React.FC<TypingAnimationProps> = ({
  text,
  playAnimation,
  onWritingAnimationPlayed,
}) => {
  const [displayedHTML, setDisplayedHTML] = useState(playAnimation ? '' : text);

  useEffect(() => {
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (!playAnimation) return;

      const currentSubstring = text.substring(0, currentIndex + 1);
      setDisplayedHTML(currentSubstring);

      currentIndex++;

      if (currentIndex === text.length) {
        clearInterval(typingInterval);
      }
    }, 5);

    return () => clearInterval(typingInterval);
  }, [text, playAnimation]);

  useEffect(() => {
    if (displayedHTML === text && onWritingAnimationPlayed) {
      onWritingAnimationPlayed();
    }
  }, [displayedHTML]);

  return <StyledMessageWrapper className="outline-none" dangerouslySetInnerHTML={{ __html: displayedHTML }} />;
};

export default TypingAnimationInnerHTML;
