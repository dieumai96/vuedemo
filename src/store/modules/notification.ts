import instance from './../../shared/callApi.service';
import { Url } from './../../config/apiUrl';
import { ServerConfig } from './../../config/serverConfig';
import { success, error } from './../../shared/alert';
import moment from 'moment';
import { interval } from 'rxjs';
import { take, tap, skipWhile } from 'rxjs/operators';
import { loaderService } from './../../shared/loader';
import { textPipe } from './../../third-party/third-party';
import { appSocketService } from './../../services/app-socket'
export default {
    actions: {
        async fetchNotifications({ commit, getters, dispatch }: { commit: any, getters: any, dispatch: any }, payload = {}) {
            commit('updateLoadingNotification', true);
            let timer = interval(10).pipe(take(120));
            timer.pipe(
                tap((value) => {
                    loaderService.setValue(value);
                }),
                skipWhile(val => val == 99),
            ).subscribe();
            let listData;
            await instance.post(`${ServerConfig.API_ENDPOINT}/${Url.GET_ALL_NOTIFICATION}`, payload).then(res => {
                commit('updateLoadingNotification', false)
                loaderService.setValue(100);
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
            commit('updateListNotifications', listData);
        },
        async createNotifications({ commit, getters, dispatch }: { commit: any, getters: any, dispatch: any }, payload: any) {
            commit('updateLoadingNotification', true);
            await instance.post(`${ServerConfig.API_ENDPOINT}/${Url.CREATE_NOTIFICATION}`, payload).then(res => {
                commit('updateLoadingNotification', false)
                if (res.status == 200) {

                    if (res.data.status == 0) {
                        let { data } = res.data;
                        dispatch('fetchNotifications')
                        success(res.data.msg);
                        appSocketService.sendNotification({
                            buildingID: data.buildingID,
                            postTime: Date.now(),
                            title: data.title,
                            content: data.content,
                            notifyScope: data.notifyScope,
                            notificationID: data.id,
                            dmlType: 'Insert',
                            notifyStatus: data.status,
                            file: data.file,
                            priority: data.priority,
                        });
                    } else {
                        error(res.data.msg);
                    }
                }
            }).catch((err) => {
                commit('updateError', 'Something went wrong, try again later');
                return new Error(err);
            });
        },
    },
    getters: {
        getAllNotifications(state: any) {
            return state.notifications;
        },
        getLoadingNotification(state: any) {
            return state.loadingNotification
        }
    },
    mutations: {
        updateListNotifications(state: any, notifications: any) {
            notifications.forEach((element: any) => {
                let stringDate = new Date(element.timeCreated);
                let alreadyRead = `${element.totalRead}` + '/' + `${element.totalFlat}`
                element.alreadyRead = alreadyRead
                element.timeCreated = moment(String(stringDate)).format("DD/MM/YYYY A");
                element.sent = element.status == 2 ? 'Sent' : 'Not send';
                element.content = textPipe(element.content);
                element.title = textPipe(element.title);
            });
            state.notifications = notifications
        },
        updateError(state: any, error: any) {
            state.errors = error
        },
        updateLoadingNotification(state: any, loading: any) {
            state.loadingNotification = loading
        }
    },
    state: {
        notifications: [],
        errors: {},
        loadingNotification: false,
    }
}