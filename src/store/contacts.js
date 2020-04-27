import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {

    contacts: [],

};
const getters = {
    GET_CONTACTS: state => {
        return state.contacts;
    },
    GET: state => {
        return state.contacts;
    },

};
const mutations = {
    SET_CONTACTS: (state, contacts) => {
        state.contacts = contacts;
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
        
        await axios.put('/clients/' + client_id + '/contacts/' + id,
            { row: row, data: data },
            {
                headers: {
                }
            }
        ).then(async response => {

            if (response.data.error === "Y") {
                dispatch("message", ["error", "Ошибка 1 contacts saveRow: " + response.data.code + " | " + response.data.message], { root: true });
            }
            else {

                //await dispatch('getClient', client_id);

                // console.log(response.data);
                //await store.dispatch('deals/getDeal', store.getters['deals/GET_DEAL'].id);

                dispatch("message", ["success", "Обновлено"], { root: true });
                //return response.data.id;
            }
        })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 contacts saveRow: " + e], { root: true });
            });
    },

    getContacts: async ({ getters, commit, dispatch }, client_id) => {
        await axios
            .get('/clients/' + client_id + "/contacts")
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка contacts.js getContacts: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_CONTACTS', response.data);
                    //console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка contacts.js getContacts: " + e], { root: true });
            });
    },

    addContactSimple: async ({ commit, getters, dispatch }, { client_id, newContact }) => {

        await axios
            .post('/clients/' + client_id + '/contacts/add',
                newContact
            )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка addContactSimple: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_DEAL', response.data);
                    //dispatch("getClient", client_id);

                   // newContact.id = response.data.id;
                   // commit("SET_CONTACTS", [...getters["GET_CONTACTS"], ...[newContact]]);
                    // console.log(response.data);
                    dispatch("message", ["success", "Новый контакт создан"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка addContactSimple: " + e], { root: true });
            });


    },
    removeContact: async ({ state, getters, dispatch }, { client_id, contactId }) => {

        if (typeof client_id === "undefined" || client_id === 0 || typeof contactId === "undefined") {
            dispatch("message", ["error", "Ошибка 3 clients.js removeContact: неверны заданы параметры "], { root: true });
            return;
        }
        await axios
            .delete('/clients/' + client_id + "/contacts/" + contactId + "/delete")
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка contacts.js removeContact: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    // commit('SET_CONTACTS', response.data);
                  //  state.contacts = state.contacts.filter(c => c.id !== contactId);
                    dispatch("message", ["success", "Контакт удален"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка contacts.js.js removeContact: " + e], { root: true });
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