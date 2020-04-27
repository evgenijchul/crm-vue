import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {

    stages: [],

};
const getters = {
    GET_STAGES: state => {
        return state.stages;
    },
    GET: state => {
        return state.stages;
    },

};
const mutations = {
    SET_STAGES: (state, stages) => {
        state.stages = stages;
    },

    // reset(state) {
    //     Object.assign(state, initialState);
    // }

};
const actions = {

    getStages: async ({ getters, commit, dispatch }) => {
        await axios
            .get('/deals/get_stages')
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка getStages: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_STAGES', response.data);
                    //console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка getStages: " + e], { root: true });
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