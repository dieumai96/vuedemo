import instance from './../../shared/callApi.service';
import { Url } from './../../config/apiUrl';
import { ServerConfig } from './../../config/serverConfig';
const JWT = require('jwt-decode');
export default {
    actions: {
        async fetchBuildingInfomation({ commit, getters, dispatch }: { commit: any, getters: any, dispatch: any }) {
            commit('updateLoading', true);
            let decoded;
            let token = window.localStorage.getItem('token');
            decoded = JWT(token);
            let body = {
                buildingID: decoded.buildingID
            };
            let buildingInfomation;
            await instance.post(`${ServerConfig.API_ENDPOINT}/${Url.GET_BUILDING_INFOMATION}`, body).then(res => {
                commit('updateLoading', false)
                if (res.status == 200) {
                    if (res.data.status == 0) {
                        if (res.data.data) {
                            buildingInfomation = res.data.data;
                        }
                    } else {
                        return {};
                    }
                }
            }).catch((err) => {
                commit('updateError', 'Something went wrong, try again later');
                return new Error(err);
            });
            dispatch('sayHello')
            commit('updateBuildingInfomation', buildingInfomation);
        },
    },
    getters: {
        getBuildingInfomation(state: any) {
            return state.buildingInfomation
        },
        getBuildingLoading(state: any) {
            return state.loading
        },
    },
    mutations: {
        updateBuildingInfomation(state: any, buildingInfomation: any) {
            state.buildingInfomation = buildingInfomation
        },
        updateError(state: any, error: any) {
            state.errors = error;
        },
        updateLoading(state: any, loading: any) {
            state.loading = loading;
        }
    },
    state: {
        buildingInfomation: {},
        errors: {},
        loading: false,
    }
}