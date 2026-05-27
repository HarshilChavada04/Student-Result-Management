import { defineStore } from 'pinia';
// import { LocalStorage } from 'quasar';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user_data: null, // Stores user information
        access_token: null, // Stores access token
        side_bar: null,
    }),
    actions: {
        // Action to set access token
        setToken(strToken){
            this.access_token = strToken;
        },
        // Action to set user data
        setUserInfo(objData) {
            this.user_data = objData;
        },
        setSideBarPreference(blnSideBarPreference){
            this.side_bar = blnSideBarPreference;
        },
        // Action to clear user data and token (for logout)
        logout() {
            this.user_data = null;
            this.access_token = null;
            // LocalStorage.remove('auth');
        },
    },
    getters: {
        isAuthenticated(state) {
            // Check if access token exists to confirm authentication
            return !!state.access_token;
        },
        getToken(state) {
            return state.access_token;
        },
        getSideBarPreference(state){
            return state.side_bar;
        }
    },
    persist: true, // Optional: keeps auth data even after a refresh
});
