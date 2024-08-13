import { EntityProps } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { IoHomeOutline, IoTrophyOutline } from 'react-icons/io5';
import { StatusFacet, StatusProps, TitleProps } from '../../../app/additionalFacets';
import { DataTypes } from '../../../base/enums';
import { FlexBox, SectionRow } from '../../../components';
import tw from 'twin.macro';
import styled from '@emotion/styled';
import { COLOR_ITEMS } from '../../../base/constants';
import { useSelectedTheme } from '../../collection/hooks/useSelectedTheme';

const StyledSelect = styled.select`
  ${tw`outline-none bg-white bg-opacity-0`}
`;

const StyledSelectWrapper = styled.div<{ status: number; dark: boolean }>`
  ${tw` flex text-xs dark:text-white text-black space-x-1 rounded-full px-2 py-1`}
  background-color: ${({ status, dark }) => {
    if (status == 1) {
      if (dark) {
        return '#232323';
      } else {
        return 'rgba(0,0,0,0.1)';
      }
    } else if (status == 5) {
      return 'rgba(255,59,48,0.4)';
    } else if (status == 2) {
      return COLOR_ITEMS[5].accentColor + '60';
    } else if (status == 3) {
      return COLOR_ITEMS[1].accentColor + '60';
    } else if (status == 4) {
      return 'rgba(52,199,89,0.3)';
    }
  }};
`;

const PendingResourceRow = (props: TitleProps & StatusProps & EntityProps) => {
  const { title, entity, status } = props;
  const isHomework = entity.hasTag(DataTypes.HOMEWORK);
  const { isDarkMode } = useSelectedTheme();

  const openResource = () => entity.add(Tags.SELECTED);
  const updateStatus = (status: number) => entity.add(new StatusFacet({ status }));

  return (
    <SectionRow onClick={openResource} icon={isHomework ? <IoHomeOutline /> : <IoTrophyOutline />}>
      <FlexBox>
        {title}

        <StyledSelectWrapper dark={isDarkMode} status={status}>
          <StyledSelect onChange={(e) => updateStatus(parseInt(e.target.value))} defaultValue={0} value={status}>
            <option value={1}>Nicht begonnen</option>
            <option value={3}>In Arbeit</option>
            <option value={2}>In Gefahr</option>
            <option value={4}>Abgeschlossen</option>
            <option value={5}>Abseits der Spur</option>
          </StyledSelect>
        </StyledSelectWrapper>
      </FlexBox>
    </SectionRow>
  );
};

export default PendingResourceRow;
