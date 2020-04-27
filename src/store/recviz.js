import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {

    recviz: [],

};
const getters = {
    GET_RECVIZ: state => {
        return state.recviz;
    },
    GET: state => {
        return state.recviz;
    },


};
const mutations = {
    SET_RECVIZ: (state, recviz) => {
        state.recviz = recviz;
    },


    reset(state) {
        Object.assign(state, initialState);
    }

};
const actions = {
    saveRow: async ({ getters, commit, dispatch }, { id, row, data }) => {
        // id записи, row - поле из таблицы , data - значение этого поля
        let client_id = store.getters["clients/GET_CLIENT_ID"];
        if (data === null) { data = ""; }
        
        if (typeof client_id === "undefined" || client_id === 0) {
            dispatch("message", ["error", "Ошибка recviz.js saveRow: не правильно заданы параметры"], { root: true });
            return;
        }

        await axios.put('/clients/' + client_id + '/recviz/' + id,
            { row: row, data: data },
            {
                headers: {
                }
            }
        ).then(async response => {

            if (response.data.error === "Y") {
                dispatch("message", ["error", "Ошибка 1 recviz saveRow: " + response.data.code + " | " + response.data.message], { root: true });
            }
            else {

                //console.log(response.data);
                dispatch("message", ["success", "Обновлено"], { root: true });
                //return response.data.id;
            }
        })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 recviz saveRow: " + e], { root: true });
            });
    },

    getRecviz: async ({ getters, commit, dispatch }, client_id) => {
        await axios
            .get('/clients/' + client_id + "/recviz")
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка recviz.js getReviz: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {

                    response.data.map(e => {
                        return e.newBank = [];
                        // return e.newBank = { nomer_scheta:"", bik:"", bank:"", korr_schet:""};
                    });

                    commit('SET_RECVIZ', response.data);

                   // console.log("response.data");

                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка recviz.js getReviz: " + e], { root: true });
            });
    },

    addRecviSimple: async ({ commit, getters, dispatch }, { client_id, newRecvi }) => {

        if (typeof client_id === "undefined" || client_id === 0) {
            dispatch("message", ["error", "Ошибка recviz.js addRecviSimple: не правильно заданы параметры"], { root: true });
            return;
        }

        await axios
            .post('/clients/' + client_id + '/recviz/add',
                newRecvi
            )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 recviz.js addRecviSimple: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {

                    newRecvi.id = response.data.id;
                    newRecvi.main="";
                    newRecvi.newBank = [];
                    newRecvi.banks = [];
                    commit("SET_RECVIZ", [...getters["GET_RECVIZ"], ...[newRecvi]]);

                    dispatch("message", ["success", "Новые реквизиты созданы"], { root: true });
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 recviz.js addRecviSimple: " + e], { root: true });
            });


    },
    removeRecvi: async ({ state, getters, dispatch }, { client_id, recvi_id }) => {

        if (typeof client_id === "undefined" || client_id === 0 || typeof recvi_id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 recviz.js removeRecvi: неверны заданы параметры "], { root: true });
            return;
        }
        await axios
            .delete('/clients/' + client_id + "/recviz/" + recvi_id + "/delete")
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка recviz.js removeRecvi: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    state.recviz = state.recviz.filter(r => r.id !== recvi_id);
                    dispatch("message", ["success", "Реквизит удален"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка recviz.js removeRecvi: " + e], { root: true });
            });



    },

    addBankSimple: async ({ commit, getters, dispatch }, { client_id, recvi_id, index_recvi, newBank }) => {

        //  /clients/5/recviz/43/banks/add

        if (typeof client_id === "undefined" || client_id === 0 || typeof recvi_id === "undefined" || typeof index_recvi === "undefined") {
            dispatch("message", ["error", "Ошибка recviz.js addBankSimple: не правильно заданы параметры"], { root: true });
            return;
        }


        await axios
            .post('/clients/' + client_id + '/recviz/' + recvi_id + '/banks/add',
                newBank
            )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 recviz.js addBankSimple: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_DEAL', response.data);
                    //dispatch("getClient", client_id);

                    newBank.id = response.data.id;

                    let recviz = getters["GET_RECVIZ"];
                    recviz[index_recvi].banks = [...recviz[index_recvi].banks, ...[newBank]];

                    commit("SET_RECVIZ", recviz);

                    dispatch("message", ["success", "Новый банк создан"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 recviz.js addBankSimple: " + e], { root: true });
            });


    },
    removeBank: async ({ state, getters, dispatch }, { client_id, recvi_id, index_recvi, bank_id }) => {

        if (typeof client_id === "undefined" || typeof recvi_id === "undefined" || typeof index_recvi === "undefined" || typeof bank_id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 recviz.js removeBank: неверны заданы параметры "], { root: true });
            return;
        }
        // /clients/5/recviz/43/banks/3/delete
        await axios
            .delete('/clients/' + client_id + "/recviz/" + recvi_id + "/banks/" + bank_id + "/delete")
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка recviz.js removeBank: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    // commit('SET_CONTACTS', response.data);
                    state.recviz[index_recvi].banks = state.recviz[index_recvi].banks.filter(b => b.id !== bank_id);
                    dispatch("message", ["success", "Банк удален"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка recviz.js removeBank: " + e], { root: true });
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