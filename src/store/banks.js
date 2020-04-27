import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {
    our_banks: []
};
const getters = {
    GET_OURBANKS: state => {
        return state.our_banks;
    },
};
const mutations = {
    SET_OURBANKS: (state, our_banks) => {
        state.our_banks = our_banks;
    },
};
const actions = {
    saveRow: async ({ getters, commit, dispatch }, { id, row, data }) => {
        // id записи, row - поле из таблицы , data - значение этого поля
        let client_id = store.getters["clients/GET_CLIENT_ID"];
        if (data === null) { data = ""; }

        if (typeof client_id === "undefined" || client_id === 0) {
            dispatch("message", ["error", "Ошибка banks.js saveRow: не правильно заданы параметры"], { root: true });
            return;
        }

        await axios.put('/clients/' + client_id + '/banks/' + id,
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
                dispatch("message", ["success", "Обновлено"], { root: true });
            }
        })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 recviz saveRow: " + e], { root: true });
            });
    },

    getOurBanks: async ({ getters, commit, dispatch }) => {
        await axios
            .get('/banks/our_banks')
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка getOurBanks: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_OURBANKS', response.data);

                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка getOurBanks: " + e], { root: true });
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