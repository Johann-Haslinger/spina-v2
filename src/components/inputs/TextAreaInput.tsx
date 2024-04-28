import styled from "@emotion/styled/macro";
import tw from "twin.macro";

const TextAreaInput = styled.textarea`
  ${tw`w-full min-h-28 bg-white bg-opacity-0 dark:placeholder:text-placeholderTextDark placeholder:text-placeholderText outline-none border-none rounded-lg py-1`}
`;

export default TextAreaInput;