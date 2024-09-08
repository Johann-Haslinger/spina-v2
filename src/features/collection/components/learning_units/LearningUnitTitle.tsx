import { EntityProps } from '@leanscope/ecs-engine';
import { IdentifierProps } from '@leanscope/ecs-models';
import { TitleFacet, TitleProps } from '../../../../app/additionalFacets';
import { SupabaseColumn, SupabaseTable } from '../../../../base/enums';
import { Title } from '../../../../components';
import supabaseClient from '../../../../lib/supabase';

const LearningUnitTitle = (props: EntityProps & TitleProps & IdentifierProps) => {
  const { entity, title, guid } = props;

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
    <Title editable onBlur={handleTitleBlur}>
      {title}
    </Title>
  );
};

export default LearningUnitTitle;
