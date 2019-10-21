const io = require('socket.io-client');
import { Observable } from 'rxjs';
import { ServerConfig } from './../config/serverConfig'
const JWT = require('jwt-decode');

const socket = io(ServerConfig.SOCKET_URL,
    {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity
    });
const token = localStorage.getItem('token');
let decoded: any;
if (token) {
    decoded = JWT(token);
}
export const appSocketService = {
    newUserConnect(data: any) {
        console.log("DaTA New user", data);
        socket.emit('new-user', data, function (dataRes: any) {
            console.log("-----newUserConnnect: ", dataRes);
        });
    },
    // create notification
    sendNotification(data: any) {
        data.dataType = 'Notification';
        data.fromUserID = decoded.id;
        data.phone = decoded.phone;
        data.email = decoded.email;
        data.fullName = decoded.fullName;
        console.log("------: data comment ", data);
        socket.emit('send-notification', data, function (dataRes: any) {
            console.log("data emit ", data);
            debugger;
            console.log('------Send notification', dataRes);
        });
    },

    // nhan ve notification
    receiveNotification() {
        let observable = new Observable(obserble => {
            socket.on('new-notification', (data: any) => {
                obserble.next(data);
            })
            return () => { socket.disconnect(); }
        })
        return observable;

    }

}
