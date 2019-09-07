export const ConfirmLeaveMixin = {
    beforeRouteLeave(to, from, next) {
        const question = this.confirmLeaveQuestion;
        if (question) {
            if (window.confirm(question)) {
                next();
            } else {
                next(false);
            }
        } else {
            next();
        }
    },
};
