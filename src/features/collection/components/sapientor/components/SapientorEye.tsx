import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import tw from "twin.macro";
import { COLOR_ITEMS } from "../../../../../base/constants";

const StyledSapientorEyeAccent = styled.div<{ top: number; left: number }>`
  ${tw`size-2 rounded-full`}
  background-color: ${COLOR_ITEMS[0].backgroundColor};
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  transition: top 0.1s, left 0.1s;
`;

const StyledSapientorEye = styled.div`
  ${tw`size-4 rounded-full relative`}
  background-color: ${COLOR_ITEMS[0].color};
`;

const useEyePosition = () => {
  const [eyePosition, setEyePosition] = useState({ top: 4, left: 4 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const eye = document.getElementById("eye");
      if (!eye) return;

      const rect = eye.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
      const radius = Math.min(rect.width, rect.height) / 2 - 5;
      const top = Math.sin(angle) * radius + rect.height / 2 - 1;
      const left = Math.cos(angle) * radius + rect.width / 2 - 1;

      setEyePosition({ top, left });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return eyePosition;
};

const SapientorEye = () => {
  const { top, left } = useEyePosition();

  return (
    <StyledSapientorEye id="eye">
      <StyledSapientorEyeAccent top={top - 2.5} left={left - 2.5} />
    </StyledSapientorEye>
  );
};

export default SapientorEye;
