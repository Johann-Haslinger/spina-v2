import { Entity } from '@leanscope/ecs-engine';
import { DateAddedFacet } from '../../../base/additionalFacets';

export const useFormattedDateAdded = (entity: Entity, short?: boolean) => {
  const dateAdded = entity.get(DateAddedFacet)?.props.dateAdded || '';
  const addedDate = new Date(dateAdded);
  const now = new Date();

  const addedYear = addedDate.getFullYear();
  const addedMonth = addedDate.getMonth();
  const addedDay = addedDate.getDate();

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const nowDay = now.getDate();

  const differenceInDates = (nowYear - addedYear) * 365 + (nowMonth - addedMonth) * 30 + (nowDay - addedDay);

  let formattedDateAdded;

  if (differenceInDates === 0) {
    formattedDateAdded = 'Heute hinzugefügt';
  } else if (differenceInDates === 1) {
    formattedDateAdded = 'Gestern hinzugefügt';
  } else if (differenceInDates === 2) {
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
