import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {

    history: [],
    heightLeftColumn: 700

};
const getters = {
    GET_HISTORY: state => {
        return state.history;
    },
    GET: state => {
        return state.history;
    },

};
const mutations = {
    SET_HISTORY: (state, history) => {
        state.history = history;
    },
    reset(state) {
        Object.assign(state, initialState);
    }
};
const actions = {
    saveRow: async ({ getters, commit, dispatch }, { id, row, data }) => {
        // row - поле из таблицы , data - значение этого поля
        let deal_id = store.getters["deals/GET_DEAL_ID"];

        if (data === null) { data = ""; }

        if (typeof id === "undefined" || typeof deal_id === "undefined" || typeof row === "undefined" || typeof data === "undefined") {
            dispatch("message", ["error", "Ошибка 3 history.js saveRow: неверно заданы параметры"], { root: true });
            return;
        }

        await axios.put('/deals/' + deal_id + '/history/' + id,
            { row: row, data: data },
            {
                headers: {
                }
            }
        ).then(async response => {

            if (response.data.error === "Y") {
                dispatch("message", ["error", "Ошибка 1 history saveRow: " + response.data.code + " | " + response.data.message], { root: true });
            }
            else {

                dispatch("message", ["success", "Обновлено"], { root: true });

            }
        })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 history saveRow: " + e], { root: true });
            }); history
    },

    getAllHistory: async ({ getters, commit, dispatch }, deal_id) => {

        await axios
            .get('/deals/' + deal_id + '/history')
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 getAllHistory: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_HISTORY', response.data);
                    //console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 getAllHistory: " + e], { root: true });
            });




    },
    addHistorySimple: async ({ commit, getters, dispatch }, { deal_id, newHistory }) => {

        if (typeof deal_id === "undefined" || deal_id === 0) {
            dispatch("message", ["error", "Ошибка  addHistorySimple: не правильно заданы параметры"], { root: true });
            return;
        }

        await axios
            .post('/deals/' + deal_id + '/history/add',
                newHistory
            )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 addHistorySimple: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_DEAL', response.data);
                    //dispatch("getClient", client_id);
                    //console.log(getters["GET_CONTACTS"]);
                    //newHistory.id = response.data.id;
                    //commit("SET_HISTORY", [...getters["GET_HISTORY"], ...[newHistory]]);
                    //console.log(response.data);
                    dispatch("message", ["success", "Новое событие создано"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 addHistorySimple: " + e], { root: true });
            });


    },

    remove: async ({ state, getters, dispatch }, { deal_id, history_id }) => {



        if (typeof deal_id === "undefined" || typeof history_id === "undefined") {
            dispatch("message", ["error", "Ошибка 4 remove: неверно заданы параметры"], { root: true });
            return;
        }

        await axios

            .delete('/deals/' + deal_id + '/history/' + history_id + '/delete')
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка  remove: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    // commit('SET_CONTACTS', response.data);                    
                   // state.history = state.history.filter(history => history.id !== history_id);
                    dispatch("message", ["success", "Событие удалено"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка remove: " + e], { root: true });
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