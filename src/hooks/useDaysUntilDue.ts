import { Entity } from '@leanscope/ecs-engine';
import { useEntityFacets } from '@leanscope/ecs-engine/react-api/hooks/useEntityFacets';
import { useEffect, useState } from 'react';
import { DueDateFacet } from '../app/additionalFacets';

export const useDaysUntilDue = (entity: Entity) => {
  const [dueDateProps] = useEntityFacets(entity, DueDateFacet);
  const dueDate = dueDateProps?.dueDate;
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
