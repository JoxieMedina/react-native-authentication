import store from 'MobileApp/store';

export const get = () => store.getState().services.session;
