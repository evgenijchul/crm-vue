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

    // reset(state) {
    //     Object.assign(state, initialState);
    // }

};
const actions = {

    postHistoryTech: async ({ dispatch }, { deal_id, text, type }) => {
        // row - поле из таблицы deal, data - значение этого поля
        if (typeof deal_id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 postHistoryTech: Не задан deal_id"], { root: true });
            return;
        }



        await axios.post('/deals/' + deal_id + '/history_tech',
            { text: text, type: type },
            {
                headers: {
                }
            }
        )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 postHistoryTech: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_DEAL',  response.data);   
                    console.log(response.data);
                    //store.dispatch("history/getAllHistory", deal_id);
                    //dispatch("message", ["success", "Обновлено"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 postHistoryTech: " + e], { root: true });
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