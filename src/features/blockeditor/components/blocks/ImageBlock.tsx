// import styled from '@emotion/styled';
// import { EntityProps } from '@leanscope/ecs-engine';
// import { FloatOrderProps, ImageFacet } from '@leanscope/ecs-models';
// import { Fragment } from 'react';
// import tw from 'twin.macro';
// import BlockOutline from './BlockOutline';
// ;

// const StyledImageWrapper = styled.div`
//   ${tw`w-full rounded-lg bg-tertiary dark:bg-secondary-dark flex justify-center`}
// `;

// const StyledImage = styled.img<{ size: SizeTypes; fit: FitTypes }>`
//   ${tw`rounded-lg`}
//   ${(props) =>
//     props.size == SizeTypes.AUTO_SIZE && props.fit == FitTypes.COVER
//       ? tw`object-cover w-full md:max-h-96 max-h-56 `
//       : props.size == SizeTypes.AUTO_SIZE
//         ? tw`md:max-h-96  max-h-56`
//         : props.size == SizeTypes.LARGE
//           ? tw`w-full h-full`
//           : tw``}
// `;

// const ImageBlock = (props: EntityProps & FloatOrderProps) => {
//   const { entity, index } = props;
//   const imageUrl = entity.get(ImageFacet)?.props.imageSrc;
//   const [imageSizeProps, imageFitProps] = useEntityFacets(entity, ImageSizeFacet, ImageFitFacet);
//   const size = imageSizeProps?.size || SizeTypes.AUTO_SIZE;
//   const fit = imageFitProps?.fit || FitTypes.AUTO_FIT;

//   // TODO: Add full view for images

//   return (
//     <Fragment>
//       <BlockOutline paddingY blockEntity={entity} index={index}>
//         {imageUrl ? (
//           <StyledImageWrapper>
//             <StyledImage src={imageUrl} size={size} fit={fit} />
//           </StyledImageWrapper>
//         ) : (
//           <div>Failed to load image</div>
//         )}
//       </BlockOutline>
//       {/* {isFullViewVisible && (
//         <ImageFullView backButtonLabel={"Zurück"} backfunc={() => setIsFullViewVisible(false)} imageUrl={imageUrl} />
//       )} */}
//     </Fragment>
//   );
// };

// export default ImageBlock;

const ImageBlock = () => {
  return <div>ImageBlock</div>;
};

export default ImageBlock;
