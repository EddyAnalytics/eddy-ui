import Vue from 'vue';
import moment from 'moment';

Vue.filter('capitalize', function(value) {
    if (!value) return '';
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1);
});

function momentFilter(date, format) {
    if (!date) return undefined;
    date = moment(date);
    return date.format(format);
}

Vue.filter('moment', momentFilter);

Vue.filter('date', function(date) {
    return momentFilter(date, 'LL');
});

Vue.filter('utc2local', function(date) {
    if (!date) return undefined;
    return moment.utc(date);
});

import { localizeErrorCode } from '@/services/rest/errors';

Vue.filter('localizeErrorCode', localizeErrorCode);
