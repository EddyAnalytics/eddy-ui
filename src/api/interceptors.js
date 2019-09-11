import { api } from './index';
import { ERROR_CODE, errorToCode } from './errors';
import router from '@/router';
import { AUTH } from '@/store/auth';
import store from '@/store/index';

// Find error code and store it on the error object
api.interceptors.response.use(
    response => response,
    error => {
        error.errorCode = errorToCode(error);
        if (error.errorCode === ERROR_CODE.UNKNOWN && error.response) {
            console.warn('unknown error code for response status', error.response.status);
        }
        return Promise.reject(error);
    },
);

// Redirect user to sign-in page when requests fail with unauthorized status
api.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        const isAuthenticationError = error && error.errorCode === ERROR_CODE.CREDENTIALS;
        const onAuthPage = router.currentRoute.name === 'sign-in';
        if (isAuthenticationError && !onAuthPage) {
            store.dispatch(AUTH.LOGOUT).then(() => {
                router.replace({
                    name: 'sign-in',
                });
            });
        }
        return Promise.reject(error);
    },
);

// Add a request interceptor
api.interceptors.request.use(
    request => {
        // Assign the refreshed token on every request.
        const token = localStorage.getItem('eddy-ui-token');
        const lang = localStorage.getItem('lang');
        if (token) request.headers['Authorization'] = token;
        request.headers['Accept-Language'] = lang || 'en';
        return Promise.resolve(request);
    },
    error => {
        return Promise.reject(error);
    },
);
