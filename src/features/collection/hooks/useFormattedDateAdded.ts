import { Entity } from '@leanscope/ecs-engine';
import { DateAddedFacet } from '../../../app/additionalFacets';

export const useFormattedDateAdded = (entity: Entity) => {
  const dateAdded = entity.get(DateAddedFacet)?.props.dateAdded || '';
  const addedDate = new Date(dateAdded);
  const today = new Date();

  const differenceInTime = today.getTime() - addedDate.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

  let formattedDateAdded;

  if (differenceInDays === 0) {
    formattedDateAdded = 'Heute hinzugefügt';
  } else if (differenceInDays === 1) {
    formattedDateAdded = 'Gestern hinzugefügt';
  } else if (differenceInDays === 2) {
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
