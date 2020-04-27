import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'


const state = {
    allCatalog: []
};
const getters = {
    GET_CATALOG: state => {
        return state.allCatalog;
    },
};
const mutations = {

    SET_CATALOG: (state, allCatalog) => {

        state.allCatalog = allCatalog;
    },

};
const actions = {
    getAllCatalog: async ({ commit, dispatch }, data) => {

        let url = store.getters['deals/GET_DEAL'].site.url;
        await Vue.axios
            .get(url + '/__scripts/crm/catalog3.php')
            .then(
                response => {
                    if (response.status == 200) {            
                     

              
                        commit('SET_CATALOG', response.data);

                    }
                    else {
                         dispatch("message", ["error", "Ответ сервера " + response.status], { root: true });
                    }
                })
            .catch(function (error) {

                dispatch("message", ["error", error], { root: true });

            })
        // .finally(() => (console.log("finish")));
    },

};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};