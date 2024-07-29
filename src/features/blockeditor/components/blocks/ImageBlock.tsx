import { EntityProps } from "@leanscope/ecs-engine";
import {
  FitTypes,
  FloatOrderProps,
  ImageFacet,
  ImageFitFacet,
  ImageSizeFacet,
  SizeTypes,
} from "@leanscope/ecs-models";
import BlockOutline from "./BlockOutline";
import { Fragment, useState } from "react";
import { useCurrentBlockeditor } from "../../hooks/useCurrentBlockeditor";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { useEntityFacets } from "@leanscope/ecs-engine/react-api/hooks/useEntityFacets";

const StyledImageWrapper = styled.div`
  ${tw`w-full rounded-lg bg-tertiary dark:bg-seconderyDark flex justify-center`}
`;

const StyledImage = styled.img<{ size: SizeTypes; fit: FitTypes }>`
  ${tw`rounded-lg`}
  ${(props) =>
    props.size == SizeTypes.AUTO_SIZE && props.fit == FitTypes.COVER
      ? tw`object-cover w-full md:max-h-96 max-h-56 `
      : props.size == SizeTypes.AUTO_SIZE
        ? tw`md:max-h-96  max-h-56`
        : props.size == SizeTypes.LARGE
          ? tw`w-full h-full`
          : tw``}
`;

const ImageBlock = (props: EntityProps & FloatOrderProps) => {
  const { entity, index } = props;
  const { blockeditorState } = useCurrentBlockeditor();
  const [_, setIsFullViewVisible] = useState(false);
  const imageUrl = entity.get(ImageFacet)?.props.imageSrc;
  const [imageSizeProps, imageFitProps] = useEntityFacets(
    entity,
    ImageSizeFacet,
    ImageFitFacet,
  );
  const size = imageSizeProps?.size || SizeTypes.AUTO_SIZE;
  const fit = imageFitProps?.fit || FitTypes.AUTO_FIT;

  // TODO: Add full view for images

  return (
    <Fragment>
      <BlockOutline paddingY blockEntity={entity} index={index}>
        {imageUrl ? (
          <StyledImageWrapper>
            <StyledImage
              onClick={() =>
                blockeditorState == "view" && setIsFullViewVisible(true)
              }
              src={imageUrl}
              size={size}
              fit={fit}
            />
          </StyledImageWrapper>
        ) : (
          <div>Failed to load image</div>
        )}
      </BlockOutline>
      {/* {isFullViewVisible && (
        <ImageFullView backButtonLabel={"Zurück"} backfunc={() => setIsFullViewVisible(false)} imageUrl={imageUrl} />
      )} */}
    </Fragment>
  );
};

export default ImageBlock;
