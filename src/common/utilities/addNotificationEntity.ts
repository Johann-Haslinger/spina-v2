import { ILeanScopeClient } from '@leanscope/api-client';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { v4 } from 'uuid';
import { DateAddedFacet, IconFacet, TitleFacet } from '../../common/types/additionalFacets';
import { AdditionalTag } from '../types/enums';

export const addNotificationEntity = (
  lsc: ILeanScopeClient,
  notification: { title: string; message: string; type: 'success' | 'error' | 'info' | 'warning' },
) => {
  const { title, message, type } = notification;
  const newNotificationEntity = new Entity();
  lsc.engine.addEntity(newNotificationEntity);
  newNotificationEntity.add(new IdentifierFacet({ guid: v4() }));
  newNotificationEntity.add(new TitleFacet({ title: title }));
  newNotificationEntity.add(
    new TextFacet({
      text:
        type == 'error'
          ? 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut oder wende dich an den Support. Fehlerdetails: ' +
            message
          : message,
    }),
  );
  newNotificationEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
  newNotificationEntity.add(
    new IconFacet({ icon: type == 'success' ? '✅' : type == 'error' ? '❌' : type == 'info' ? 'ℹ️' : '⚠️' }),
  );
  newNotificationEntity.add(AdditionalTag.NOTIFICATION);
  newNotificationEntity.add(Tags.CURRENT);
};
