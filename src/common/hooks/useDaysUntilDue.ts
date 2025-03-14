import { Entity, useEntityComponents } from '@leanscope/ecs-engine';
import { useEffect, useState } from 'react';
import { DueDateFacet } from '../../common/types/additionalFacets';

export const useDaysUntilDue = (entity: Entity, dueDateValue?: string) => {
  const [dueDateFacet] = useEntityComponents(entity, DueDateFacet);
  const dueDate = dueDateValue ? dueDateValue : dueDateFacet?.props.dueDate;
  const [daysUntilDue, setDaysUntilDue] = useState<string>('');

  useEffect(() => {
    const calculateDaysUntilDue = () => {
      if (dueDate) {
        const now = new Date();
        const due = new Date(dueDate);
        const differenceInTime = due.getTime() - now.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

        if (differenceInDays > 1) {
          setDaysUntilDue(`Noch ${differenceInDays} Tage`);
        } else if (differenceInDays === 1) {
          setDaysUntilDue('Morgen!');
        } else if (differenceInDays === 0) {
          setDaysUntilDue('Heute!');
        } else if (differenceInDays === -1) {
          setDaysUntilDue('Gestern');
        } else if (differenceInDays < -1) {
          setDaysUntilDue(`Vor ${-differenceInDays} Tagen`);
        } else {
          setDaysUntilDue('');
        }
      }
    };

    calculateDaysUntilDue();
  }, [dueDate]);

  return daysUntilDue;
};
