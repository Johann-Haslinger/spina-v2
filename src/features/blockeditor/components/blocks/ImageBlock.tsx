import { EntityProps } from "@leanscope/ecs-engine";
import { FitTypes, FloatOrderProps, ImageFacet, ImageFitFacet, ImageSizeFacet, SizeTypes } from "@leanscope/ecs-models";
import BlockOutline from "./BlockOutline";
import { Fragment, useState } from "react";
import { useCurrentBlockeditor } from "../../hooks/useCurrentBlockeditor";
import styled from "@emotion/styled";
import tw from "twin.macro";

// const ImageFullView = (props: { imageUrl: string; backfunc: () => void; backButtonLabel: string }) => {
//   const { imageUrl, backButtonLabel, backfunc } = props;
//   const { width } = useWindowDimensions();
//   const { setTheme, theme, activeMenu, setActiveMenu } = useStateContext();
//   const [back, setBack] = useState<boolean>(false);

//   useEffect(() => {
//     setActiveMenu(false);
//   }, []);

//   function deactivateMenu() {
//     if (activeMenu && width < 1280) {
//       setActiveMenu(false);
//     }
//   }

//     setTimeout(() => {
//       backfunc();
//     }, 300);
//   };

//   return (
//     <>
//       <motion.div
//         animate={{
//           background: back ? "#ffffff00" : "#00000029",
//         }}
//         initial={{ background: "#ffffff00" }}
//         className="w-screen z-0  h-screen bg-black   fixed top-0 right-0 bottom-0 left-0"
//       />

//       <motion.div
//         transition={{ type: "Tween" }}
//         animate={{
//           marginLeft: activeMenu ? (width > 768 && width < 1280 ? "20rem" : "0") : 0,
//           paddingLeft: activeMenu && width > 1280 ? "20rem" : "0",
//           x: back ? (width < 768 ? 500 : 1200) : 0,
//         }}
//         initial={{
//           marginLeft: width > 768 && width < 1280 ? "20rem" : 0,
//           paddingLeft: width > 1280 ? "20rem" : 0,
//           x: width < 768 ? 400 : 1200,
//         }}
//         onClick={deactivateMenu}
//         className={` h-screen  fixed pt-10  md:pt-0 z-50 bottom-0 left-0 right-0 w-screen`}
//       >
//         <div
//           className={` flex pb-4 transition-all    top-0 fixed md:pt-7  bg-[rgb(246,246,246)] border-b border-border pt-5 pl-2 justify-between w-full  `}
//         >
//           <div className="flex   w-full ">
//             <div onClick={handleBackClick} className={`   md:relative  flex text-primary `}>
//               <IoChevronBack className="text-3xl ml-2   md:text-2xl" />
//               <p className="ml-1 text-base mt-0.5">{backButtonLabel}</p>
//             </div>
//           </div>
//         </div>

//         <div className="h-full z-0 w-full overflow-y-scroll  md:pt-0 bg-white">
//           <OptionbarRight>
//             <IoShareOutline />
//             <OptionButton></OptionButton>
//           </OptionbarRight>
//           <img src={imageUrl} className="w-full h-full object-contain" />
//         </div>
//       </motion.div>
//     </>
//   );
// };

const StyledImageWrapper = styled.div`
  ${tw`w-full rounded-lg bg-[#f2f2f45f] flex justify-center`}
`;

const StyledImage = styled.img<{ size: SizeTypes; fit: FitTypes }>`
  ${tw`rounded-lg`}
  ${(props) =>
    props.size == SizeTypes.AUTO_SIZE && props.fit == FitTypes.COVER
      ? tw`object-cover w-full h-full`
      : props.size == SizeTypes.AUTO_SIZE
      ? tw`h-full`
      : props.size == SizeTypes.LARGE
      ? tw`w-full h-full`
      : tw``}
`;

const ImageBlock = (props: EntityProps & FloatOrderProps) => {
  const { entity, index } = props;
  const { blockeditorState } = useCurrentBlockeditor();
  const [isFullViewVisible, setIsFullViewVisible] = useState(false);
  const imageUrl = entity.get(ImageFacet)?.props.imageSrc;
  const fit = entity.get(ImageFitFacet)?.props.fit || FitTypes.COVER;
  const size = entity.get(ImageSizeFacet)?.props.size || SizeTypes.AUTO_SIZE;

  console.log("isFullViewVisible", isFullViewVisible);

  return (
    <Fragment>
      <BlockOutline blockEntity={entity} index={index}>
        {imageUrl ? (
          <StyledImageWrapper>
            <StyledImage
              onClick={() => blockeditorState == "view" && setIsFullViewVisible(true)}
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
