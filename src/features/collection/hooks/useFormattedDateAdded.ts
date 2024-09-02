import { Entity } from '@leanscope/ecs-engine';
import { DateAddedFacet } from '../../../app/additionalFacets';

export const useFormattedDateAdded = (entity: Entity, short?: boolean) => {
  const dateAdded = entity.get(DateAddedFacet)?.props.dateAdded || '';
  const addedDate = new Date(dateAdded);
  const now = new Date();

  // Berechnung der Differenz in Tagen zwischen now und addedDate
  const differenceInDates = Math.floor((now.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24));

  let formattedDateAdded;

  if (differenceInDates < 1) {
    formattedDateAdded = 'Heute hinzugefügt';
  } else if (differenceInDates < 2) {
    formattedDateAdded = 'Gestern hinzugefügt';
  } else if (differenceInDates < 3) {
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

    if (short) {
      formattedDateAdded = 'Hinzugefügt am ' + formattedDate;
    } else {
      formattedDateAdded = 'Hinzugefügt am ' + formattedDayAdded + ', dem ' + formattedDate;
    }
  }

  return formattedDateAdded;
};
