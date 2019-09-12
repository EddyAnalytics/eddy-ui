import Vue from 'vue';
import Router from 'vue-router';

import Dashboard from '@/pages/Dashboard';
import Project from '@/pages/Project';
import Pipeline from '@/pages/Pipeline';
import Integrations from '@/pages/Integrations';
import Settings from '@/pages/Settings';

import AuthenticationPage from '@/pages/AuthenticationPage';
import Profile from '@/pages/Profile';

import PageNotFound from '@/pages/PageNotFound';

// Authentication Pages
import LoginForm from '@/components/auth/forms/LoginForm';
import PasswordResetForm from '@/components/auth/forms/PasswordResetForm';
import PasswordForgottenForm from '@/components/auth/forms/PasswordForgottenForm';
import ChangePasswordForm from '@/components/auth/forms/ChangePasswordForm';
import store from '@/store';
import { AUTH } from '@/store/auth';

Vue.use(Router);

let router = new Router({
    mode: 'history',
    linkActiveClass: 'is-active',
    routes: [
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard,
            meta: {
                auth: true,
            },
        },
        {
            path: '/project/:projectId',
            name: 'Project',
            component: Project,
            meta: {
                auth: true,
            },
        },
        {
            path: '/pipeline/:pipelineId',
            name: 'Pipeline',
            component: Pipeline,
            meta: {
                auth: true,
            },
        },
        {
            path: '/integrations',
            name: 'Integrations',
            component: Integrations,
            meta: {
                auth: true,
            },
        },
        {
            path: '/settings',
            name: 'Settings',
            component: Settings,
            meta: {
                auth: true,
            },
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile,
            meta: {
                auth: true,
            },
        },
        {
            path: '/auth',
            component: AuthenticationPage,
            children: [
                {
                    path: '/',
                    name: 'sign-in',
                    component: LoginForm,
                    meta: {
                        auth: false,
                    },
                },
                {
                    path: 'reset',
                    component: PasswordForgottenForm,
                    name: 'reset',
                    meta: {
                        auth: false,
                    },
                },
                {
                    path: 'reset/token/:token',
                    component: PasswordResetForm,
                    name: 'reset/token',
                    meta: {
                        auth: false,
                    },
                },
                {
                    path: 'change-password',
                    name: 'change-password',
                    component: ChangePasswordForm,
                    meta: {
                        auth: true,
                    },
                },
            ],
        },
        {
            path: '**',
            name: 'PageNotFound',
            component: PageNotFound,
        },
    ],
});

/**
 * Check for authenticate routes
 */
router.beforeEach((to, from, next) => {
    if (to.meta !== undefined && to.meta.auth) {
        if (!store.getters[AUTH.IS_AUTHENTICATED]) {
            next({
                name: 'sign-in',
                query: {
                    redirect: to.path,
                },
            });
            return;
        }
    }
    next();
});

/**
 * Disable debug routes (stylesheet, etc) on production
 */
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.debugRoute)) {
        if (!Vue.prototype.$config.debug) {
            next({ path: '/' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
