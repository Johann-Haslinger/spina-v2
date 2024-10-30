import { EntityProps } from '@leanscope/ecs-engine';
import { IdentifierProps } from '@leanscope/ecs-models';
import { TitleFacet, TitleProps } from '../../../../common/types/additionalFacets';
import { SupabaseColumn, SupabaseTable } from '../../../../common/types/enums';
import { Title } from '../../../../components';
import supabaseClient from '../../../../lib/supabase';

interface LearningUnitTitleProps extends EntityProps, TitleProps, IdentifierProps {
  onEnterClick?: () => void;
}

const LearningUnitTitle = (props: LearningUnitTitleProps) => {
  const { entity, title, guid, onEnterClick } = props;

  const handleTitleBlur = async (value: string) => {
    entity.add(new TitleFacet({ title: value }));
    const { error } = await supabaseClient
      .from(SupabaseTable.LEARNING_UNITS)
      .update({ title: value })
      .eq(SupabaseColumn.ID, guid);

    if (error) {
      console.error('Error updating note title', error);
    }
  };

  return (
    <Title onEnterClick={onEnterClick} editable onBlur={handleTitleBlur}>
      {title}
    </Title>
  );
};

export default LearningUnitTitle;
