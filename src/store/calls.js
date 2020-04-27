import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {

    calls: [],
    status: ""

};
const getters = {
    GET_CALLS: state => {
        return state.calls;
    },
    GET_STATUS: state => {
        return state.status;
    },
    GET: state => {
        return state.calls;
    },

};
const mutations = {
    SET_CALLS: (state, calls) => {
        state.calls = calls;
    },
    SET_STATUS: (state, status) => {
        state.status = status;
    },

    // reset(state) {
    //     Object.assign(state, initialState);
    // }

};
const actions = {


    // Сохранение поля в таблице in_call
    saveRow: async ({ getters, commit, dispatch }, { id, row, data }) => {

        // row - поле из таблицы , data - значение этого поля

        if (data === null) { data = ""; }

        await axios.put('/calls/in_call/' + id,
            { row: row, data: data }
        ).then(async response => {

            if (response.data.error === "Y") {
                dispatch("message", ["error", "Ошибка 1 saveRow: " + response.data.code + " | " + response.data.message], { root: true });
            }
            else {
                console.log(response.data);

                dispatch("message", ["success", "Обновлено"], { root: true });
                //return response.data.id;
            }
        })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 saveRow: " + e], { root: true });
            });
    },



    getCalls: async ({ getters, commit, dispatch }) => {
        await axios
            .get('/calls')
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка getCalls: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_CALLS', response.data);

                    // console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка getCalls: " + e], { root: true });
            });
    },
    getAllCalls: async ({ getters, commit, dispatch }) => {
        await axios
            .get('/calls/all')
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка getAllCalls: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_CALLS', response.data);

                    console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка getAllCalls: " + e], { root: true });
            });
    },
    calling: async ({ getters, commit, dispatch }, { number, site_sid }) => {


        await axios
            .get('/calls/call/' + number.replace(/[^0-9]/g, "") + '/site/' + site_sid)
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка calling: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_STATUS', response.data);
                    // console.log(response.data);

                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка calling: " + e], { root: true });
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