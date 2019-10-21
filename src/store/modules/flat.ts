import instance from './../../shared/callApi.service';
import { Url } from './../../config/apiUrl';
import { ServerConfig } from './../../config/serverConfig';
import { success } from './../../shared/alert';
import { loaderService } from './../../shared/loader'
import { interval } from 'rxjs';
import { take, tap, skipWhile } from 'rxjs/operators';
export default {
    actions: {
        async fetchFlats({ commit, getters, dispatch }: { commit: any, getters: any, dispatch: any }, payload = {}) {
            commit('updateLoading', true);
            let timer = interval(10).pipe(take(120));
            timer.pipe(
                tap((value) => {
                    loaderService.setValue(value);
                }),
                skipWhile(val => val == 99),
            ).subscribe();
            let listData;
            await instance.post(`${ServerConfig.API_ENDPOINT}/${Url.GET_ALL_FLATS}`, payload).then(res => {
                loaderService.setValue(100);
                commit('updateLoading', false);
                if (res.status == 200) {
                    if (res.data.status == 0) {
                        if (res.data.data) {
                            listData = res.data.data;
                        }
                    } else {
                        return [];
                    }
                }
            }).catch((err) => {
                commit('updateError', 'Something went wrong, try again later');
                return new Error(err);
            });
            dispatch('sayHello')
            commit('updateListFlats', listData);
        },

        async createFlat({ commit, getters, dispatch }: { commit: any, getters: any, dispatch: any }, payload: any) {
            commit('updateLoading', true);
            await instance.post(`${ServerConfig.API_ENDPOINT}/${Url.CREATE_FLAT}`, payload)
                .then(res => {
                    commit('updateLoading', false)
                    if (res.status == 200) {
                        if (res.data.status == 0) {
                            success("Add flat successfully!");
                            dispatch('fetchFlats')
                        }
                    }
                })
                .catch(err => {
                    commit('updateError', 'Something went wrong, try again later');
                    return new Error(err);
                })
        },

        async editFlat({ commit, getters, dispatch }: { commit: any, getters: any, dispatch: any }, payload: any) {
            commit('updateLoading', true);
            await instance.post(`${ServerConfig.API_ENDPOINT}/${Url.EDIT_FLAT}`, payload)
                .then(res => {
                    commit('updateLoading', false)
                    if (res.status == 200) {
                        if (res.data.status == 0) {
                            success("Edit flat successfully!");
                            dispatch('fetchFlats')
                        }
                    }
                })
                .catch(err => {
                    commit('updateError', 'Something went wrong, try again later');
                    return new Error(err);
                })
        },

        async deleteFlat({ commit, getters, dispatch }: { commit: any, getters: any, dispatch: any }, payload: any) {
            commit('updateLoading', true);
            await instance.post(`${ServerConfig.API_ENDPOINT}/${Url.DELETE_FLAT}`, payload)
                .then(res => {
                    commit('updateLoading', false)
                    if (res.status == 200) {
                        if (res.data.status == 0) {
                            success("Delete flat successfully!");
                            dispatch('fetchFlats')
                        }
                    }
                })
                .catch(err => {
                    commit('updateError', 'Something went wrong, try again later');
                    return new Error(err);
                })
        },
        async searchCache({ commit, getters, dispatch }: { commit: any, getters: any, dispatch: any }, payload: any) {
            let a = [...getters.getAllFlat];
            a = await a.filter(x => x.soPhong.replace(/,/g, '').trim().indexOf(payload.replace(/,/g, '').trim()) != -1);
            await commit('updateListCaches', a);
        },

        async createMultiFlat({ commit, getters, dispatch }: { commit: any, getters: any, dispatch: any }, payload: any) {
            commit('updateLoading', true);
            await instance.post(`${ServerConfig.API_ENDPOINT}/${Url.CREATE_MULTI_FLAT}`, payload)
                .then(res => {
                    commit('updateLoading', false)
                    if (res.status == 200) {
                        if (res.data.status == 0) {
                            success("Add multi flat successfully!");
                            dispatch('fetchFlats')
                        }
                    }
                })
                .catch(err => {
                    commit('updateError', 'Something went wrong, try again later');
                    return new Error(err);
                })
        },
        sayHello() {
        }
    },
    mutations: {
        updateListFlats(state: any, flats: any) {
            state.flats = flats
        },
        updateError(state: any, errors: any) {
            state.errors = errors
        },
        createFlat(state: any, flat: any) {
            state.flats = state.flats.unshift(flat)
        },
        updateLoading(state: any, loading: any) {
            state.loading = loading;
        },
        updateListCaches(state: any, caches: any) {
            let listFlatDistinct = Array.from(new Set(caches.map((s: any) => s.block)))
                .map(block => {
                    return {
                        block: block,
                        listFlat: caches.filter((s: any) => s.block === block)
                    }
                })
            state.searchCache = listFlatDistinct;
        },
    },
    state: {
        flats: [

        ],
        errors: {},
        loading: false,
        searchCache: [],
    },
    getters: {
        getAllFlat(state: any) {
            return state.flats.filter((x: any) => ![3, 9].includes(x.status))
        },
        getFlatLoading(state: any) {
            return state.loading;
        },
        distinctFlatByBlock(state: any) {
            let listFlatDistinct = Array.from(new Set(state.flats.map((s: any) => s.block)))
                .map(block => {
                    return {
                        block: block,
                        listFlat: state.flats.filter((s: any) => s.block === block)
                    }
                })
            return listFlatDistinct;
        },
        getSearchCache(state: any) {
            return state.searchCache
        }
    }
}