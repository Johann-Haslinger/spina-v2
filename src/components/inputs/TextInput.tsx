import styled from "@emotion/styled";
import tw from "twin.macro";

const StyledTextInput = styled.input`
  ${tw`w-full bg-[#ffffff00] outline-none placeholder:text-placeholderText   dark:placeholder:text-placeholderTextDark dark:text-primaryTextDark `}
`;

export default StyledTextInput;
