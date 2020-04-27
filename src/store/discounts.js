import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {

    discounts: [],

};
const getters = {
    GET_DISCOUNTS: state => {
        return state.discounts;
    },
    GET: state => {
        return state.discounts;
    },

};
const mutations = {
    SET_DISCOUNTS: (state, discounts) => {
        state.discounts = discounts;
    },

    reset(state) {
        Object.assign(state, initialState);
    }

};
const actions = {
    saveRow: async ({  dispatch }, { id, row, data }) => {
        // id записи, row - поле из таблицы , data - значение этого поля
        let client_id = store.getters["clients/GET_CLIENT_ID"];
        if (data === null) { data = ""; }
        
        await axios.put('/clients/' + client_id + '/discounts/' + id,
            { row: row, data: data },
            {
                headers: {
                }
            }
        ).then(async response => {

            if (response.data.error === "Y") {
                dispatch("message", ["error", "Ошибка 1 discounts.js saveRow: " + response.data.code + " | " + response.data.message], { root: true });
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
                dispatch("message", ["error", "Ошибка 2 discounts.js saveRow: " + e], { root: true });
            });
    },

    getDiscounts: async ({  commit, dispatch }, client_id) => {
        await axios
            .get('/clients/' + client_id + "/discounts")
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка discounts.js getDiscounts: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    commit('SET_DISCOUNTS', response.data);
                  //  console.log(response.data);
                    //dispatch("message", ["success", "Сделки выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка discounts.js.js getDiscounts: " + e], { root: true });
            });
    },

    addDiscountSimple: async ({ commit, getters, dispatch }, { client_id, newDiscount }) => {
       
        if (typeof client_id === "undefined" || client_id ===0) {
            dispatch("message", ["error", "Ошибка  recvi: не правильно заданы параметры"], { root: true });
            return;
        }
        
        await axios
            .post('/clients/' + client_id + '/discounts/add',
                newDiscount
            )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 addDiscountSimple: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_DEAL', response.data);
                    //dispatch("getClient", client_id);
                    //console.log(getters["GET_CONTACTS"]);
                    newDiscount.id = response.data.id;
                    commit("SET_DISCOUNTS", [...getters["GET_DISCOUNTS"], ...[newDiscount]]);
                    //console.log(response.data);
                    dispatch("message", ["success", "Новая скидка создана"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 addDiscountSimple: " + e], { root: true });
            });


    },
    removeDiscount: async ({ state,  dispatch }, { client_id, discountId }) => {


        await axios
            .delete('/clients/' + client_id + "/discounts/" + discountId + "/delete")
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка discounts.js removeDiscount: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    // commit('SET_CONTACTS', response.data);
                    state.discounts = state.discounts.filter(discount => discount.id !== discountId);
                    dispatch("message", ["success", "Сделка удалена"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка discounts.js.js removeDiscount: " + e], { root: true });
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