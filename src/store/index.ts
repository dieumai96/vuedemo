import Vue from 'vue';
import Vuex from 'vuex';
import flat from './modules/flat';
import building from './modules/building'
import notification from './modules/notification';
import auth from './modules/auth';

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        flat,
        notification,
        building,
        auth
    },
    strict: process.env.NODE_ENV != 'production',
})
