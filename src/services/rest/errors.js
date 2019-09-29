import i18n from '@/languages';

export const ERROR_CODE = Object.freeze({
    NETWORK: -2,
    UNKNOWN: -1,
    NONE: 0,
    CREDENTIALS: 1,
    FORBIDDEN: 2,
    NOT_FOUND: 3,
    CONFLICT: 4,
    SERVER_OFFLINE: 5,
    SERVER_TIMEOUT: 6,
    BAD_REQUEST: 7,
    WRONG_CURRENT_PASSWORD: 8,
    PAYLOAD_TOO_LARGE: 9,
});

const HTTP_STATUS_MAPPING = {
    [400]: ERROR_CODE.BAD_REQUEST,
    [401]: ERROR_CODE.CREDENTIALS,
    [403]: ERROR_CODE.FORBIDDEN,
    [404]: ERROR_CODE.NOT_FOUND,
    [409]: ERROR_CODE.CONFLICT,
    [413]: ERROR_CODE.PAYLOAD_TOO_LARGE,
    [503]: ERROR_CODE.SERVER_OFFLINE,
    [504]: ERROR_CODE.SERVER_TIMEOUT,
};

export function errorToCode(error) {
    if (error.response) {
        const status = error.response.status;
        return HTTP_STATUS_MAPPING[status] || ERROR_CODE.NETWORK;
    } else {
        return ERROR_CODE.UNKNOWN;
    }
}

export function localizeErrorCode(code) {
    // This function is also installed as a filter for use in vue templates
    if (!code) {
        return undefined;
    }
    switch (code) {
        case ERROR_CODE.NONE:
            return undefined;
        case ERROR_CODE.CREDENTIALS:
            return i18n.t('common.errors.credentials');
        case ERROR_CODE.FORBIDDEN:
            return i18n.t('common.errors.forbidden');
        case ERROR_CODE.NOT_FOUND:
            return i18n.t('common.errors.not_found');
        case ERROR_CODE.CONFLICT:
            return i18n.t('common.errors.conflict');
        case ERROR_CODE.SERVER_OFFLINE:
            return i18n.t('common.errors.server_offline');
        case ERROR_CODE.SERVER_TIMEOUT:
            return i18n.t('common.errors.server_timeout');
        case ERROR_CODE.BAD_REQUEST:
            return i18n.t('common.errors.bad_request');
        case ERROR_CODE.WRONG_CURRENT_PASSWORD:
            return i18n.t('common.errors.wrong_current_password');
        case ERROR_CODE.PAYLOAD_TOO_LARGE:
            return i18n.t('common.errors.payload_too_large');
        default:
            return i18n.t('common.errors.unknown');
    }
}
