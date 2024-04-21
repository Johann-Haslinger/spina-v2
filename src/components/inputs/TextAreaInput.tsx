import styled from "@emotion/styled/macro";
import tw from "twin.macro";

const TextAreaInput = styled.textarea`
  ${tw`w-full min-h-28 bg-opacity-0 bg-white placeholder:text-placeholderText outline-none border-none rounded-lg px-2 py-1`}
`;

export default TextAreaInput;