import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {

    types: [],

};
const getters = {
    GET_TYPES: state => {
        return state.types;
    },
    GET: state => {
        return state.types;
    },

};
const mutations = {
    SET_TYPES: (state, types) => {
        state.types = types;
    },

    // reset(state) {
    //     Object.assign(state, initialState);
    // }

};
const actions = {

    getTypes: async ({ getters, commit, dispatch }) => {
        await axios
            .get('/deals/get_types')
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка getTypes: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_TYPES', response.data);
                  //  console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка getTypes: " + e], { root: true });
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