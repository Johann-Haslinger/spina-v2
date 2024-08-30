import { Entity } from '@leanscope/ecs-engine';
import { DateAddedFacet } from '../../../app/additionalFacets';
export const useFormattedDateAdded = (entity: Entity) => {
  const dateAdded = entity.get(DateAddedFacet)?.props.dateAdded || '';
  const addedDate = new Date(dateAdded);
  const now = new Date();

  const differenceInTime = now.getTime() - addedDate.getTime();
  const differenceInHours = differenceInTime / (1000 * 3600); // Unterschied in Stunden

  let formattedDateAdded;

  if (differenceInHours < 24) {
    formattedDateAdded = 'Heute hinzugefügt';
  } else if (differenceInHours < 48) {
    formattedDateAdded = 'Gestern hinzugefügt';
  } else if (differenceInHours < 72) {
    formattedDateAdded = 'Vorgestern hinzugefügt';
  } else {
    const formattedDayAdded = addedDate.toLocaleDateString('de-DE', {
      weekday: 'long',
    });

    const formattedDate = addedDate.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    formattedDateAdded = 'Hinzugefügt am ' + formattedDayAdded + ', dem ' + formattedDate;
  }

  return formattedDateAdded;
};
