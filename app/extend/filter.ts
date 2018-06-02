'use strict';

import * as moment from 'moment';

export function relativeTime(time) {
  return moment(new Date(time * 1000)).fromNow();
};

export function domain (url) {
  return url && url.split('/')[2];
};
