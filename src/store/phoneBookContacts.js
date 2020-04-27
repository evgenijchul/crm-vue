import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {
};
const getters = {

};
const mutations = {

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


        await axios.put('/phoneBook/contacts/' + id,
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

    createContact: async ({ context, commit, dispatch }, { phone_book_id, fio, tel, comment }) => {

        if (typeof phone_book_id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 createContact: Не задан phone_book_id "], { root: true });
            return;
        }
        await axios
            .post('/phoneBook/' + phone_book_id + '/contacts/add',
                { fio, tel, comment }
            )
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 createContact: " + response.data.code + " | " + response.data.message], { root: true });
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

    removePhoneBookContact: async ({ state, getters, dispatch }, { contact_id }) => {

        if (typeof contact_id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 removePhoneBookContact: Не задан contact_id "], { root: true });
            return;
        }
        await axios
            .delete('/phoneBook/contacts/' + contact_id + '/delete')
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 removePhoneBookContact: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_REG', response.data);
                    console.log(response.data);
                    dispatch("message", ["success", "Удалено"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 removePhoneBookContact: " + e], { root: true });
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