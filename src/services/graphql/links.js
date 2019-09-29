import { SnackbarProgrammatic as Snackbar } from 'buefy';
import { onError } from 'apollo-link-error';

export const onErrorLink = onError(({ networkError, graphQLErrors }) => {
    Snackbar.open({
        message: networkError ? networkError.result.errors[0].message : graphQLErrors[0].message,
        type: 'is-danger',
    });
});
