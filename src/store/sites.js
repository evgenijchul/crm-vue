import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {

    sites: [],

};
const getters = {
    GET_SITES: state => {
        return state.sites;
    },
    GET: state => {
        return state.sites;
    },

};
const mutations = {
    SET_SITES: (state, sites) => {
        state.sites = sites;
    },

    // reset(state) {
    //     Object.assign(state, initialState);
    // }

};
const actions = {

    getSites: async ({ getters, commit, dispatch }) => {
        await axios
            .get('/deals/get_sites')
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка getSites: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_SITES', response.data);
                    // console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка getSites: " + e], { root: true });
            });
    },



};

export default {
    namespaced: true,
    state: Object.assign({}, initialState),
    getters,
    mutations,
    actions,
    modules: {

    }
};