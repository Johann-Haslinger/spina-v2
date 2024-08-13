import { grid1, grid2, grid3, grid4, grid5, grid6, grid7 } from '../../../assets/images/grids';
import { useSelectedSchoolSubject } from './useSelectedSchoolSubject';

const grids = [grid1, grid2, grid3, grid4, grid5, grid6, grid7];

export const useSelectedSchoolSubjectGrid = () => {
  const { selectedSchoolSubjectOrder = 0 } = useSelectedSchoolSubject();

  const grid = grids[selectedSchoolSubjectOrder % grids.length];

  return grid;
};
