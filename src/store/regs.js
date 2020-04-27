import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {
    regs: [],
    reg: []

};
const getters = {
    GET_REGS: state => {
        return state.regs;
    },
    GET_REG: state => {

        return state.reg;
    },
};
const mutations = {
    SET_REGS: (state, regs) => {
        state.regs = regs;
    },
    SET_REG: (state, reg) => {
        state.reg = reg;
    },
    reset(state) {
        Object.assign(state, initialState);
    }

};
const actions = {
    saveRow: async ({ getters, commit, dispatch }, { id, row, data }) => {

        // row - поле из таблицы , data - значение этого поля
        if (data === null) { data = ""; }

        if (typeof id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 saveRow: Не задан id"], { root: true });
            return;
        }


        await axios.put('/files/reg/' + id,
            { row: row, data: data },
            {
                headers: {
                }
            }
        ).then(async response => {

            if (response.data.error === "Y") {
                dispatch("message", ["error", "Ошибка 1 saveRow: " + response.data.code + " | " + response.data.message], { root: true });
            }
            else {

                //await dispatch('getReg', id);
                console.log(response.data);
                // !!!
                //await store.dispatch('deals/getDeal', store.getters['deals/GET_DEAL'].id);

                dispatch("message", ["success", "Обновлено"], { root: true });
                //return response.data.id;
            }
        })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 saveRow: " + e], { root: true });
            });
    },


    createSimple: async ({ context, commit, dispatch }, newReg) => {

        await axios
            .post('/files/regs/add',
                {newReg:newReg},
                {
                    headers: {
                    }
                }
            )
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1  createSimple: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_CLIENT', response.data);
                     console.log(response.data);
                    dispatch("message", ["success", "Новый Reg создан"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2  createSimple: " + e], { root: true });
            });
    },
    removeReg: async ({ state, getters, dispatch }, { reg_id }) => {

        if (typeof reg_id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 removeReg: Не задан reg_id "], { root: true });
            return;
        }
        await axios
            .get('/files/remove_reg/' + reg_id)
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 removeReg: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_REG', response.data);
                    console.log(response.data);
                    dispatch("message", ["success", "Reg удален"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 removeReg: " + e], { root: true });
            });

    },


    getAllRegs: async ({ getters, commit, dispatch }) => {

        await axios
            .get('/files')
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 getAllRegs: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_REGS', response.data);
                    console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 getAllRegs: " + e], { root: true });
            });




    },
    getReg: async ({ getters, commit, dispatch }, reg_id) => {

        if (typeof reg_id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 getReg: Не задан reg_id "], { root: true });
            return;
        }
        await axios
            .get('/files/' + reg_id)
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 getReg: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_REG', response.data);
                    console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 getReg: " + e], { root: true });
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