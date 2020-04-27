import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {
    phone_book: [],


};
const getters = {
    GET_PHONE_BOOK: state => {
        return state.phone_book;
    },

};
const mutations = {
    SET_PHONE_BOOK: (state, phone_book) => {
        state.phone_book = phone_book;
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


        await axios.put('/phoneBook/' + id,
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

    createSimple: async ({ context, commit, dispatch }, {name,comment}) => {


        await axios
            .post('/phoneBook/add',
                {name, comment}               
            )
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1  createSimple: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_CLIENT', response.data);
                     console.log(response.data);
                    dispatch("message", ["success", "Новая запись создана"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2  createSimple: " + e], { root: true });
            });
    },

    getPhoneBook: async ({ getters, commit, dispatch }) => {

        await axios
            .get('/phoneBook')
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 getPhoneBook: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_PHONE_BOOK', response.data);
                    console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 getAllRegs: " + e], { root: true });
            });




    },

    removePhoneBook: async ({ state, getters, dispatch }, { id }) => {

        if (typeof id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 removePhoneBook: Не задан id "], { root: true });
            return;
        }
        await axios
            .delete('/phoneBook/' + id + '/delete')
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 removePhoneBook: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_REG', response.data);
                    console.log(response.data);
                    dispatch("message", ["success", "Удалено"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 removePhoneBook: " + e], { root: true });
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