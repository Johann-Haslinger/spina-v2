// const StyledLayoutOptionButtonWrapper = styled.div<{ isActive: boolean }>`
//   ${tw`text-sm pt-4 rounded-md border transition-all w-1/2 py-2 px-4`}
//   ${({ isActive }) =>
//     isActive
//       ? tw`bg-primary-color bg-opacity-10 dark:bg-opacity-30 text-primary-color border-primary-color`
//       : tw`bg-secondary dark:bg-tertiary-dark md:hover:opacity-50  dark:text-secondary-text-dark text-secondary-text border-white border-opacity-0`}
// `;

// const StyledOptionIconWrapper = styled.div`
//   ${tw`text-2xl w-full  flex justify-center mb-2`}
// `;

// const StyledOptionTextWrapper = styled.p`
//   ${tw`w-full text-center`}
// `;

// const StyledLayoutOptionsWrapper = styled.div`
//   ${tw`flex w-full  pt-2 pb-3 justify-between`}
// `;

// const StyledOptionWrapper = styled.div`
//   ${tw`w-1/2`}
// `;

// const StyledLayoutTextWrapper = styled.p`
//   ${tw`text-sm w-full text-center text-secondary-text dark:text-secondary-text-dark`}
// `;

// const StyledOptionButtonsWrapper = styled.div`
//   ${tw`flex space-x-1 w-full pt-4 px-3`}
// `;

// const changeSize = (lsc: ILeanScopeClient, size: SizeTypes) => {
//   const selectedBlockEntities = lsc.engine.entities.filter((e) => e.has(DataType.BLOCK) && e.has(Tags.SELECTED));

//   selectedBlockEntities.forEach(async (blockEntity) => {
//     blockEntity.add(new ImageSizeFacet({ size: size }));

//     const blockId = blockEntity.get(IdentifierFacet)?.props.guid;

//     const { error } = await supabaseClient
//       .from(SupabaseTable.BLOCKS)
//       .update({ size: size })
//       .eq(SupabaseColumn.ID, blockId);

//     if (error) {
//       console.error('Error updating block size', error);
//     }
//   });
// };

// const changeFit = (lsc: ILeanScopeClient, fit: FitTypes) => {
//   const selectedBlockEntities = lsc.engine.entities.filter((e) => e.has(DataType.BLOCK) && e.has(Tags.SELECTED));

//   selectedBlockEntities.forEach(async (blockEntity) => {
//     blockEntity.add(new ImageFitFacet({ fit: fit }));

//     const blockId = blockEntity.get(IdentifierFacet)?.props.guid;

//     const { error } = await supabaseClient
//       .from(SupabaseTable.BLOCKS)
//       .update({ fit: fit })
//       .eq(SupabaseColumn.ID, blockId);

//     if (error) {
//       console.error('Error updating block fit', error);
//     }
//   });
// };

// const LayoutOptionButton = ({
//   isActive,
//   onClick,
//   icon,
//   label,
// }: {
//   isActive: boolean;
//   onClick: () => void;
//   icon: React.ReactElement;
//   label: string;
// }) => (
//   <StyledLayoutOptionButtonWrapper isActive={isActive} onClick={onClick}>
//     <StyledOptionIconWrapper>{icon}</StyledOptionIconWrapper>
//     <StyledOptionTextWrapper>{label}</StyledOptionTextWrapper>
//   </StyledLayoutOptionButtonWrapper>
// );

// const LayoutOptions = () => {
//   const lsc = useContext(LeanScopeClientContext);
//   const [selectedBlockEntities] = useEntities((e) => e.has(DataType.BLOCK) && e.has(Tags.SELECTED));
//   const { selectedLanguage } = useSelectedLanguage();

//   const firstSelectedBlockEntity = selectedBlockEntities[0];
//   const [imageSizeProps, ImgageFitProps] = useEntityFacets(firstSelectedBlockEntity, ImageSizeFacet, ImageFitFacet);
//   const currentSize = imageSizeProps?.size || SizeTypes.AUTO_SIZE;
//   const currentFit = ImgageFitProps?.fit || FitTypes.AUTO_FIT;

//   return (
//     <StyledLayoutOptionsWrapper>
//       <StyledOptionWrapper>
//         <StyledLayoutTextWrapper>{displayLabelTexts(selectedLanguage).adjustImage}</StyledLayoutTextWrapper>
//         <StyledOptionButtonsWrapper>
//           <LayoutOptionButton
//             isActive={currentFit === FitTypes.AUTO_FIT}
//             onClick={() => changeFit(lsc, FitTypes.AUTO_FIT)}
//             icon={<IoScanOutline />}
//             label={IMAGE_FIT_TEXT_DATA.auto[selectedLanguage]}
//           />
//           <LayoutOptionButton
//             isActive={currentFit === FitTypes.COVER}
//             onClick={() => changeFit(lsc, FitTypes.COVER)}
//             icon={<IoMoveOutline />}
//             label={IMAGE_FIT_TEXT_DATA.cover[selectedLanguage]}
//           />
//         </StyledOptionButtonsWrapper>
//       </StyledOptionWrapper>
//       <StyledOptionWrapper>
//         <StyledLayoutTextWrapper>{displayLabelTexts(selectedLanguage).imageSize}</StyledLayoutTextWrapper>
//         <StyledOptionButtonsWrapper>
//           <LayoutOptionButton
//             isActive={currentSize === SizeTypes.AUTO_SIZE}
//             onClick={() => changeSize(lsc, SizeTypes.AUTO_SIZE)}
//             icon={<IoCropOutline />}
//             label={IMAGE_SIZE_TEXT_DATA.auto[selectedLanguage]}
//           />
//           <LayoutOptionButton
//             isActive={currentSize === SizeTypes.LARGE}
//             onClick={() => changeSize(lsc, SizeTypes.LARGE)}
//             icon={<IoSquareOutline />}
//             label={IMAGE_SIZE_TEXT_DATA.large[selectedLanguage]}
//           />
//         </StyledOptionButtonsWrapper>
//       </StyledOptionWrapper>
//     </StyledLayoutOptionsWrapper>
//   );
// };
// export default LayoutOptions;

const LayoutOptions = () => {
  return <div>LayoutOptions</div>;
};

export default LayoutOptions;
