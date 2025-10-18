import {useMemo} from 'react';
import Share from 'react-native-share';
import itemsApi, {Item} from '../api/itemsApi';
import constants from '../config/constants';
import Analytics from '../utils/Analytics';
import {LoggerFactory} from '../utils/logger';

export interface ShareParams {
  item_id?: string;
  content_type?: string;
  method?: string;
}
const logger = LoggerFactory.getLogger('useSocial');
const useSocial = () => {
  const context = useMemo(
    () => ({
      share: (message: string) => Share.open({message}),
      shareUrl: (type = 'invite_friend') =>
        Share.open({message: constants.SHARE_DOMAIN})
          .then(res => {
            !!res.success && Analytics.logEvent(type);
          })
          .catch(err => {
            err && console.log(err);
          }),
      shareItem: async (item: Item) => {
        try {
          const res = await Share.open({message: itemsApi.getShareLink(item)});
          const shareParams = {
            content_type: 'items:' + item.category.name,
            item_id: item.id,
            // category_name: item.category.name,
            method: 'social',
          };
          !!res.success && Analytics.logShare(shareParams);
        } catch (error) {
          logger.log(error);
          Analytics.logError('share', error as Error);
          // throw error;
        }
      },
    }),
    [],
  );
  return context;
};

export default useSocial;
