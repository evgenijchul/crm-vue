import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'
// import _ from 'lodash'

const initialState = {
    showDeal: false,
    deals: [],
    deal: {
        stage: [],
        type: [],
        site: []
    },
    dealId: 0,
    stages: [],
    history: [],
    client_deals: []
    // managerId: 0
};
const getters = {
    GET: state => {
        return state.deal;
    },
    GET_DEAL: state => {
        return state.deal;
    },
    GET_DEALS: state => {
        return state.deals;
    },
    GET_DEAL_ID: state => {
        return state.dealId;
    },
    GET_CLIENT_DEALS: state => {
        return state.client_deals;
    },

    GET_HISTORY: state => {

        let history = state.history;

        history.forEach( (value, index) => {
            history[index].title = history[index].date;
        });

        return history;
    },

};
const mutations = {
    SET_DEAL_ID: (state, dealId) => {
        state.dealId = dealId;
    },
    SET_DEAL: (state, deal) => {
        state.deal = deal;
        state.dealId = deal.id;
    },
    SET_DEALS: (state, deals) => {
        state.deals = deals;
    },

    SET_HISTORY: (state, history) => {
        state.history = history;
    },
    SET_CLIENT_DEALS: (state, client_deals) => {
        state.client_deals = client_deals;
    },
    reset(state) {
        Object.assign(state, initialState);
    }

};
const actions = {
    resetDealState: ({ state }) => {
        state.deal = {
            stage: [],
            type: [],
            site: []
        }
        state.showDeal = false;
        state.dealId = 0;
    },

    show: ({ dispatch, state }, deal_id) => {
        if (deal_id > 0) {
            state.dealId = deal_id;
            state.showDeal = true;

        }
        else {
            dispatch("message", ["error", "Ошибка show deals.js: Не задан deal_id"], { root: true });
        }
    },
    getDeal: async ({ commit, dispatch }, deal_id) => {
        if (typeof deal_id === "undefined") {
            commit("reset");
            return;
        }
        await axios
            .get('/deals/' + deal_id)
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка getDeal: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_DEAL', response.data);


                    commit('SET_DEAL_ID', response.data.id);

                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка getDeal: " + e], { root: true });
            });
    },
    create: async ({ commit, dispatch }, { site_sid }) => {
        if (typeof site_sid === "undefined") {
            dispatch("message", ["error", "Ошибка 3 create: Не задан site_sid"], { root: true });
            return;
        }
        await axios
            .post('/deals/create',
                { site_sid: site_sid }
            )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка create: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    // console.log(response.data);
                    commit('SET_DEAL', response.data);
                    dispatch("message", ["success", "Новая сделка №" + response.data.id + " создана"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка create: " + e], { root: true });
            });

    },
    createToClient: async ({ commit, dispatch }, { client_id, site_sid }) => {
        if (typeof client_id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 createToClient: Не задан client_id"], { root: true });
            return;
        }
        if (typeof site_sid === "undefined") {
            dispatch("message", ["error", "Ошибка 3 createToClient: Не задан site_sid"], { root: true });
            return;
        }

        await axios
            .get('/deals/create/client/' + client_id + "/site/" + site_sid
            )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 0 createToClient: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {

                    commit('SET_DEAL', response.data);
                    dispatch("message", ["success", "Новая сделка №" + response.data.id + " создана"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 1 createToClient: " + e], { root: true });
            });

    },
    createChildDeal: async ({ commit, dispatch }, { parent_deal_id }) => {
        if (typeof parent_deal_id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 createChildDeal: Не задан parent_deal_id"], { root: true });
            return;
        }


        await axios
            .get('/deals/' + parent_deal_id + "/create_child"
            )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 0 createChildDeal: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {

                    commit('SET_DEAL', response.data);
                    dispatch("message", ["success", "Новая сделка №" + response.data.id + " создана"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 1 createChildDeal: " + e], { root: true });
            });

    },

    saveRow: async ({ dispatch }, { id, row, data }) => {
        // row - поле из таблицы deal, data - значение этого поля
        let deal_id = id;
        if (data === null) { data = ""; }

        await axios.put('/deals/' + deal_id,
            { row: row, data: data },
            {
                headers: {
                }
            }
        )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 saveDealRow: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_DEAL',  response.data);   
                    console.log(response.data);
                    //store.dispatch("history/getAllHistory", deal_id);
                    dispatch("message", ["success", "Обновлено"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 saveDealRow: " + e], { root: true });
            });
    },



    searchDeals: async ({ commit, dispatch }, search) => {

        await axios
            .post('/deals/search',
                { search }
            ).then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка searchDeals 1: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_DEALS', response.data);

                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка searchDeals 2: " + e], { root: true });
            });




    },
    getAllDeals: async ({ commit, dispatch }) => {

        await axios
            .get('/deals')
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка getAllDeals: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_DEALS', response.data);
                    //console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка getAllDeals: " + e], { root: true });
            });




    },
    getClientDeals: async ({ commit, dispatch }, client_id) => {

        await axios
            .get('/deals/client/' + client_id)
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка getClientDeals: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_CLIENT_DEALS', response.data);
                    //console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка getClientDeals: " + e], { root: true });
            });




    },

    removeInvoice: async ({ state, getters, dispatch }, invoice_id) => {



        if (typeof invoice_id === "undefined") {
            dispatch("message", ["error", "Ошибка 4 removeInvoice: неверно заданы параметры"], { root: true });
            return;
        }

        await axios

            .delete('/deals/invoice/' + invoice_id + '/delete')
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка  removeInvoice: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    console.log(response.data);
                    // commit('SET_CONTACTS', response.data);                    
                    // state.history = state.history.filter(history => history.id !== history_id);
                    dispatch("message", ["success", "Счет удален"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка removeInvoice: " + e], { root: true });
            });

    },
    exportXMLInvoice: async ({ dispatch }, { invoice_id, idBankInvoice }) => {


        if (typeof invoice_id === "undefined") {
            dispatch("message", ["error", "Ошибка 4 exportXMLInvoice: неверно заданы параметры"], { root: true });
            return;
        }

        await axios
            .get('/deals/invoice/' + invoice_id + '/our_bank/' + idBankInvoice + '/export_xml')
            .then(response => {
                console.log(response);
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка  exportXMLInvoice: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    console.log(response.data);
                    // commit('SET_CONTACTS', response.data);                    
                    // state.history = state.history.filter(history => history.id !== history_id);
                    dispatch("message", ["success", "Счет экспортирован в XML файл"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка exportXMLInvoice: " + e], { root: true });
            });

    },

};

export default {
    namespaced: true,
    state: Object.assign({}, initialState),
    getters,
    mutations,
    actions,

};