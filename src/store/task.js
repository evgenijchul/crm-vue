import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {

    task_deal: [],
    task_manager: []

};
const getters = {
    GET_TASK_DEAL: state => {
        return state.task_deal;
    },
    GET_TASK_MANAGER: state => {
        return state.task_manager;
    },

};
const mutations = {
    SET_TASK_DEAL: (state, task_deal) => {
        state.task_deal = task_deal;
    },
    SET_TASK_MANAGER: (state, task_manager) => {
        state.task_manager = task_manager;
    },
    reset(state) {
        state.task_deal = [];
        //Object.assign(state, initialState);
    }
};
const actions = {
    saveRow: async ({ dispatch }, { id, row, data }) => {
        // row - поле из таблицы , data - значение этого поля

        if (data === null) { data = ""; }

        if (typeof id === "undefined" || typeof row === "undefined" || typeof data === "undefined") {
            dispatch("message", ["error", "Ошибка 3 task.js saveRow: неверно заданы параметры"], { root: true });
            return;
        }

        await axios.put('/task/' + id,
            { row: row, data: data },
            {
                headers: {
                }
            }
        ).then(async response => {

            if (response.data.error === "Y") {
                dispatch("message", ["error", "Ошибка 1 task saveRow: " + response.data.code + " | " + response.data.message], { root: true });
            }
            else {

                dispatch("message", ["success", "Обновлено"], { root: true });

            }
        })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 task saveRow: " + e], { root: true });
            }); history
    },

    getTaskDeal: async ({ commit, dispatch }, deal_id) => {

        await axios
            .get('/task/deal/' + deal_id)
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 getTaskDeal: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_TASK_DEAL', response.data);
                    //console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 getTaskDeal: " + e], { root: true });
            });




    },
    getAllTaskManager: async ({ commit, dispatch }) => {

        await axios
            .get('/task/manager')
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 getAllTaskManager: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_TASK_MANAGER', response.data);
                    // console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 getAllTaskManager: " + e], { root: true });
            });




    },
    addTask: async ({ dispatch }, { newTask }) => {

        if (newTask.task.length === 0) {
            dispatch("message", ["error", "Ошибка: не задан текст задания"], { root: true });
            return;
        }
        await axios
            .post('/task/add',
                newTask
            )
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 addTask: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_DEAL', response.data);
                    //dispatch("getClient", client_id);
                    //console.log(getters["GET_CONTACTS"]);
                    // newHistory.id = response.data.id;
                    /// commit("SET_HISTORY", [...getters["GET_HISTORY"], ...[newHistory]]);
                    // console.log(response.data);
                    dispatch("message", ["success", "Новое задание поставлено"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 addTask: " + e], { root: true });
            });


    },

    addToHistory: async ({ dispatch }, { task_id }) => {

        if (typeof task_id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 task.js addToHistory: неверно заданы параметры"], { root: true });
            return;
        }

        await axios
            .post('/task/' + task_id + '/add_to_history')
            .then(response => {
                // console.log(response.data);
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 addToHistory: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_DEAL', response.data);
                    //dispatch("getClient", client_id);
                    //console.log(getters["GET_CONTACTS"]);
                    // newHistory.id = response.data.id;
                    /// commit("SET_HISTORY", [...getters["GET_HISTORY"], ...[newHistory]]);
                    //  console.log(response.data);
                    //dispatch("message", ["success", "Новое задание поставлено"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 addToHistory: " + e], { root: true });
            });


    },
    remove: async ({ state, getters, dispatch },  task_id) => {



        if (typeof task_id === "undefined") {
            dispatch("message", ["error", "Ошибка 4 remove: неверно заданы параметры"], { root: true });
            return;
        }

        await axios

            .delete('/task/' + task_id + '/delete')
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка  remove: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    // commit('SET_CONTACTS', response.data);                    
                   // state.history = state.history.filter(history => history.id !== history_id);
                    dispatch("message", ["success", "Задача удалена"], { root: true })
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