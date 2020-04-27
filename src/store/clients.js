import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {
    clients: [],
    client: [],
    clientId: 0,

};
const getters = {
    GET_CLIENTS: state => {
        return state.clients;
    },
    GET: state => {
        return state.client;
    },
    GET_CLIENT: state => {
        return state.client;
    },
    GET_CLIENT_ID: state => {
        return state.clientId;
    },


};
const mutations = {
    SET_CLIENTS: (state, clients) => {
        state.clients = clients;
    },
    SET_CLIENT: (state, client) => {
        state.client = client;
        state.clientId = client.id;
    },
    SET_CLIENT_ID: (state, clientId) => {
        state.clientId = clientId;
    },


    reset(state) {
        Object.assign(state, initialState);
    }

};
const actions = {


    resetClientState: ({ state }) => {

        state.client = [];
        state.clientId = 0;

    },

    saveRow: async ({ getters, commit, dispatch }, { id, row, data }) => {

        // row - поле из таблицы , data - значение этого поля
        let client_id = id;
        let deal_id = store.getters["deals/GET_DEAL_ID"];
        if (data === null) { data = ""; }

        if (typeof client_id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 clients saveRow: Не задан client_id"], { root: true });
            return;
        }


        if (client_id === 0 && deal_id === 0) // если не задана сделка, создадим клиента
        {
            await dispatch("createSimple");

            client_id = getters["GET_CLIENT_ID"];
        }
        else if (client_id === 0) { // если == 0, создадим клиента к сделке
            await dispatch("create");
            client_id = getters["GET_CLIENT_ID"];
        }

        await axios.put('/clients/' + client_id,
            { row: row, data: data },
            {
                headers: {
                }
            }
        ).then(async response => {

            if (response.data.error === "Y") {
                dispatch("message", ["error", "Ошибка 1 clients saveRow: " + response.data.code + " | " + response.data.message], { root: true });
            }
            else {

                await dispatch('getClient', client_id);

                // !!!
                //await store.dispatch('deals/getDeal', store.getters['deals/GET_DEAL'].id);

                dispatch("message", ["success", "Обновлено"], { root: true });
                //return response.data.id;
            }
        })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 clients saveRow: " + e], { root: true });
            });
    },

    create: async ({ context, commit, dispatch }, arrData) => {

        let deal_id = store.getters["deals/GET_DEAL_ID"];

        if (typeof deal_id === "undefined" || deal_id === 0) {
            dispatch("message", ["error", "Ошибка 3 clients create: Не задан deal_id "], { root: true });
            return;
        }
        await axios
            .post('/clients/create',
                { deal_id: deal_id, arrData: arrData },
                {
                    headers: {
                    }
                }
            )
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 clients.js create: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_CLIENT', response.data);
                    // console.log(response.data);
                    dispatch("message", ["success", "Новая клиент №" + response.data.id + " создан"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 clients.js create: " + e], { root: true });
            });
    },
    createSimple: async ({ context, commit, dispatch }) => {


        await axios
            .post('/clients/create_simple',
                {
                    headers: {
                    }
                }
            )
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 clients.js createSimple: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_CLIENT', response.data);
                    // console.log(response.data);
                    dispatch("message", ["success", "Новая клиент №" + response.data.id + " создан"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 clients.js createSimple: " + e], { root: true });
            });
    },
    removeClient: async ({ state, getters, dispatch }, id) => {



        console.log(id);


        state.clients = state.clients.filter(client => client.id !== id);
    },


    getClients: async ({ getters, commit, dispatch }) => {
        let TEST = [
            {
                id: 3424,
                sort: 0,
                name: "Клиент 1",
                town: "Kaluga",
                comment: "ad sas dasdasdasdasd",
            },
            {
                id: 32424,
                sort: 0,
                name: "Клиент 2",
                town: "Питер",
                comment: "ad sas dasdasdasdasd",
            },
            {
                id: 34324,
                sort: 0,
                name: "Клиент 3",
                town: "Moscow",
                comment: "adцукasdasdasd",
            },
            {
                id: 34524,
                sort: 0,
                name: "Клиент 4",
                town: "Обнинск",
                comment: "цукцукцasd",
            },



        ]


        commit('SET_CLIENTS', TEST)
    },

    getClient: async ({ state, commit, dispatch }, client_id) => {


        if (typeof client_id == "undefined" || client_id === 0) {
            commit("SET_CLIENT_ID", 0);
            commit("SET_CLIENT", []);

            //commit("reset");
            return 0;
        }
        // dispatch("getRecviz");
        // dispatch("getDiscounts");
        // dispatch("getContacts");

        await axios
            .get('/clients/' + client_id)
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка getClient: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_CLIENT', response.data);
                    // console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка getClient: " + e], { root: true });
            });
    },
    getAllClients: async ({ getters, commit, dispatch }) => {

        await axios
            .get('/clients')
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 getAllClients: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_CLIENTS', response.data);
                    // console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 getAllClients: " + e], { root: true });
            });




    },












    sortBank: async ({ state, getters, dispatch }, { recvi_index, bank_id }) => {
        // делаем банковский счет с  bank_id первым в массиве state.recviz[recvi_index] путем установки для него sort=10, а для остальных sort=20,30 и т.д.

        let banks = state.recviz[recvi_index].banks;

        // var bank = state.recviz[recvi_index].banks.splice(bank_index, 1);   // removes the item
        // state.recviz[recvi_index].banks.unshift(bank[0]); // adds it back to the beginning

        let sort = 20;
        for (var i = 0; i < banks.length; i++) {
            if (banks[i].id === bank_id) {
                banks[i].sort = 10
            }
            else {
                banks[i].sort = sort;
                sort = sort + 10;
            }
        }
        //banks = _.sortBy(banks, 'sort');
        state.recviz[recvi_index].banks = banks;

    },
    sortContacts: async ({ state, getters, dispatch }, contact_id) => {

        let contacts = state.contacts;


        let sort = 20;
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].id === contact_id) {
                contacts[i].sort = 10
            }
            else {
                contacts[i].sort = sort;
                sort = sort + 10;
            }
        }
       // contacts = _.sortBy(contacts, 'sort');
       // console.log(contacts);
        state.contacts = contacts;

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