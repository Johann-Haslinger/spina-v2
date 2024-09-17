import styled from '@emotion/styled';
import { EntityProps } from '@leanscope/ecs-engine';
import { OrderProps, Tags } from '@leanscope/ecs-models';
import tw from 'twin.macro';
import { TitleProps } from '../../../../app/additionalFacets';
import { useSchoolSubjectColors } from '../../../../hooks/useSchoolSubjectColors';
import { useAppState } from '../../hooks/useAppState';
import { useSelectedTheme } from '../../hooks/useSelectedTheme';

const StyledCellWrapper = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  ${tw` p-2.5 w-full flex  text-[#F5F5F5]   cursor-pointer  items-end  text-7xl md:hover:text-8xl md:hover:scale-105  transition-all h-40`}
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
`;

const StyledTitle = styled.p`
  ${tw`mt-2 font-black dark:opacity-70 `}
`;

const SchoolSubjectCell = (props: TitleProps & OrderProps & EntityProps) => {
  const { title, entity } = props;
  const { isSidebarVisible } = useAppState();
  const { color: accentColor } = useSchoolSubjectColors(props.entity);
  const { isDarkModeActive: isDarkModeAktiv } = useSelectedTheme();

  const handleOpenSchoolSubject = () => {
    if (!isSidebarVisible) {
      entity.addTag(Tags.SELECTED);
    }
  };

  return (
    <StyledCellWrapper
      backgroundColor={isDarkModeAktiv ? accentColor + '90' : accentColor + '90'}
      color={accentColor}
      onClick={handleOpenSchoolSubject}
    >
      <StyledTitle>{title.slice(0, 2)}</StyledTitle>
    </StyledCellWrapper>
  );
};

export default SchoolSubjectCell;

// const grids = [grid1, grid2, grid3, grid4, grid5, grid6, grid7];

// const StyledCellWrapper = styled.div<{
//   backgroundColor: string;
//   color: string;
//   bgImage?: string;
// }>`
//   ${tw` p-4 w-full flex  bg-fixed bg-contain  cursor-pointer  items-center justify-center mt-2  text-6xl transition-all h-32 `}
//   color: ${({ backgroundColor }) => backgroundColor};
//   background-image: ${({ bgImage }) => bgImage && `url(${bgImage})`};
//   /* background-color:  ${({ backgroundColor }) => backgroundColor + 90}; */
// `;

// const StyledTitle = styled.p`
//   ${tw`mt-2 font-extrabold dark:opacity-60  `}
// `;

// const SchoolSubjectCell = (props: TitleProps & OrderProps & EntityProps & OrderProps) => {
//   const { title, entity, orderIndex = 0 } = props;
//   const { isSidebarVisible } = useAppState();
//   const { color, accentColor } = useSchoolSubjectColors(props.entity);

//   const handleOpenSchoolSubject = () => {
//     if (!isSidebarVisible) {
//       entity.addTag(Tags.SELECTED);
//     }
//   };

//   return (
//     <div>
//       {" "}
//       <StyledCellWrapper
//         bgImage={grids[orderIndex % grids.length]}
//         backgroundColor={accentColor}
//         color={color || ""}
//         onClick={handleOpenSchoolSubject}
//       >
//         {/* <IoLibrary /> */}
//       </StyledCellWrapper>
//       <div tw="mt-2 text-base ">{title}</div>
//       <div tw="text-base mb-4 text-seconderyText">Schulfach</div>
//     </div>
//   );
// };

// export default SchoolSubjectCell;
