import instance from './../../shared/callApi.service';
import { Url } from './../../config/apiUrl';
import { ServerConfig } from './../../config/serverConfig';
const JWT = require('jwt-decode');
export default {
    actions: {
        async fetchCurrentUser({ commit, getters, dispatch }: { commit: any, getters: any, dispatch: any }) {
            commit('updateLoading', true);
            let decoded;
            let token = window.localStorage.getItem('token');
            decoded = JWT(token);
            let body = {
                employeeID: decoded.id
            };
            let profile;
            await instance.post(`${ServerConfig.API_ENDPOINT}/${Url.PROFILE}`, body).then(res => {
                commit('updateLoading', false)
                if (res.status == 200) {
                    if (res.data.status == 0) {
                        if (res.data.data) {
                            profile = res.data.data;
                        }
                    } else {
                        commit('updateError', res.data.msg);
                    }
                }
            }).catch((err) => {
                commit('updateError', 'Something went wrong, try again later');
                return new Error(err);
            });
            dispatch('sayHello')
            commit('updateProfile', profile);
        },
    },
    getters: {
        getProfile(state: any) {
            return state.profile
        }
    },
    mutations: {
        updateProfile(state: any, profile: any) {
            state.profile = profile
        },
        updateError(state: any, error: any) {
            state.error = error
        }
    },
    state: {
        token: '',
        profile: {},
        errors: {},
        loading: false,
    }
}