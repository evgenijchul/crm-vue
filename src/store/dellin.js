import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {
    appkey: "F273BB4D-E8E0-4C89-B805-B2BDAD0644D8",
    login: "info@stabmart.ru",
    password: "sm5653048",

    ordersToDeal:[]
};
const getters = {

};
const mutations = {

    reset(state) {
        Object.assign(state, initialState);
    }

};
const actions = {
    getAnswerDellin: async ({ state, commit, dispatch }, { deal_id }) => {



        await axios
            .get("/transport/deal/" + deal_id + "/dellin")
            .then(response => {
                console.log(response.data);
                state.ordersToDeal = response.data;
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка discounts.js.js getDiscounts: " + e], { root: true });
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