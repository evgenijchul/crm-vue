import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)


const state = {

    token: localStorage.getItem('token') || '',
    // managerId: 0
    status: '',
    stat: [],
    manager: {},
    managerAll: [],
    disk_free_space: []

};
const getters = {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    GET_MANAGER: state => {
        return state.manager;
    },
    GET_MANAGER_ALL: state => {
        return state.managerAll;
    },
};
const mutations = {
    auth_request(state) {
        state.status = 'loading'
    },
    auth_success(state, token, manager) {
        state.status = 'success'
        state.token = token
    },
    auth_error(state) {
        state.status = 'error'
    },
    logout(state) {
        state.status = ''
        state.token = ''
    },


};
const actions = {

    saveRow: async ({ getters, commit, dispatch }, { id, row, data }) => {

        // row - поле из таблицы , data - значение этого поля
        if (data === null) { data = ""; }

        if (typeof id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 saveRow: Не задан id"], { root: true });
            return;
        }


        await axios.put('/managers/' + id,
            { row: row, data: data }
        ).then(async response => {

            if (response.data.error === "Y") {
                dispatch("message", ["error", "Ошибка 1 saveRow: " + response.data.code + " | " + response.data.message], { root: true });
            }
            else {
                dispatch("message", ["success", "Обновлено"], { root: true });
            }
        })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 saveRow: " + e], { root: true });
            });
    },

    getStat: async ({ getters, state, dispatch }) => {
        await axios
            .get('/managers/stat')
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 getStat: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {

                    // console.log(response.data);
                    state.stat = response.data;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка login: " + e], { root: true });
            });
    },
    getManager: async ({ getters, state, dispatch }) => {
        await axios
            .get('/managers/get')
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 getManager: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {

                    // console.log(response.data.roles);
                    state.manager = response.data;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка login: " + e], { root: true });
            });
    },
    getManagerAll: async ({ dispatch }) => {
        await axios
            .get('/managers/getAll')
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 getManagerAll: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    state.managerAll = response.data;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка login: " + e], { root: true });
            });
    },
    login: async ({ getters, commit, dispatch, state }, { login, password }) => {

        await axios
            .post('/managers/login',
                { login: login, password: password }
            )
            .then(response => {
                // console.log(response.data);
                if (response.data === false) {
                    dispatch("message", ["error", "Неправильный логин или пароль!"], { root: true });
                    dispatch('logout');

                }
                else {

                    const token = response.data.jwt
                    localStorage.setItem('token', token)
                    axios.defaults.headers.common['Authorization'] = token

                    commit('auth_success', token)
                    // state.manager = response.data.manager;

                    // resolve(resp)

                    //commit('SET_RECVIZ', response.data);

                    // console.log(response.data);

                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка login: " + e], { root: true });
            });

    },
    logout: async ({ getters, commit, dispatch }, ) => {

        commit('logout');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];

    },

    disk_free_space: async ({ getters, state, dispatch }) => {
        await axios
            .get('/tech/disk_free_space')
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 disk_free_space: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {

                    state.disk_free_space = response.data;

                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка disk_free_space: " + e], { root: true });
            });
    },

};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};