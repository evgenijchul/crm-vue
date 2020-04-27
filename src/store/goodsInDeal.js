import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {
    goods: [],
    good: []
};
const getters = {
    GET_GOODS: state => {

        return state.goods;
    },
    GET_GOOD: state => {
        return state.good;
    },
};
const mutations = {
    SET_GOODS: (state, goods) => {

        // goods.map(async (e) => {
        //     e.checkbox = true;
        //     return e;
        // });

        state.goods = goods;

    },
    SET_GOOD: (state, good) => {
        state.good = good;
    },
    reset(state) {
        Object.assign(state, initialState);
    }

};
const actions = {
    updateGood: async ({ getters, commit, dispatch }, { id, good }) => {

        let deal_id = store.getters["deals/GET_DEAL_ID"];
        if (typeof deal_id === "undefined" || typeof id === "undefined") {
            dispatch("message", ["error", "Ошибка 4 updateGood: неверно заданы входные параметры"], { root: true });
            return;
        }

        await axios.put('/deals/' + deal_id + '/goods/' + id,
            { data: good },
            {
                headers: {
                }
            }
        )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 updateGood: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_DEAL',  response.data);   
                    // console.log(response.data);
                    //dispatch("message", ["success", "Обновлено"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 updateGood: " + e], { root: true });
            });
    },

    addGoodFromSite: async ({ commit, getters, dispatch }, { ext_id }) => {

        await dispatch('getGoodInfo', ext_id);

        await dispatch('addGoodSimple', getters["GET_GOOD"]);
        commit("SET_GOOD", []);
    },

    addGoodSimple: async ({ commit, getters, dispatch }, newGood) => {
        // newGood:
        // 
        // ext_id: 0,
        // picture: "",
        // sort: 0,
        // name: name,
        // price: 0,
        // quantity: 1,
        // sale: 0        

        if (typeof newGood["name"] === "undefined") {
            dispatch("message", ["error", "Ошибка  addGoodFromSite: не задано название товара"], { root: true });
            return;
        }

        let deal_id = store.getters["deals/GET_DEAL_ID"];
        if (typeof deal_id === "undefined") {
            dispatch("message", ["error", "Ошибка 4 goodsInDeals.js addGoodSimple: не задана сделка"], { root: true });
            return;
        }

        await axios
            .post('/deals/' + deal_id + '/goods/add',
                newGood
            )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 addGoodSimple: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    newGood.id = response.data.id;
                    commit("SET_GOODS", [...getters["GET_GOODS"], ...[newGood]]);
                    dispatch("message", ["success", "Новый товар добавлен"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 addGoodSimple: " + e], { root: true });
            });
    },

    removeGood: async ({ state, getters, dispatch }, good_id) => {

        let deal_id = store.getters["deals/GET_DEAL_ID"];
        if (typeof deal_id === "undefined" || deal_id === 0 || typeof good_id === "undefined") {
            dispatch("message", ["error", "Ошибка 4 removeGood: неверно заданы параметры"], { root: true });
            return;
        }

        await axios
            .delete('/deals/' + deal_id + "/goods/" + good_id + "/delete")
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка  removeGood: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    // commit('SET_CONTACTS', response.data);                    
                    state.goods = state.goods.filter(good => good.id !== good_id);
                    dispatch("message", ["success", "Товар удален"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка removeGood: " + e], { root: true });
            });

    },


    getGoods: async ({ getters, commit, dispatch }, deal_id) => {

        //  let deal_id = store.getters["deals/GET_DEAL_ID"];
        if (typeof deal_id === "undefined" || deal_id === 0) {
           // dispatch("message", ["error", "Ошибка 4 getGoods: не задана сделка"], { root: true });
            return;
        }

        await axios
            .get('/deals/' + deal_id + '/goods')
            .then(async response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 getGoods: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {

// console.log(response.data);
                    const promise = response.data.map(async (e) => {
                        if (e.ext_id > 0) {
                            await dispatch('getGoodInfo', e.ext_id).then(data => {
                               // console.log(getters["GET_GOOD"]);
                                e.picture = getters["GET_GOOD"].picture;
                                e.features = getters["GET_GOOD"].features;
                                e.code = getters["GET_GOOD"].code;
                                e.site_id = getters["GET_GOOD"].site_id;
                            }
                            );
                        }
                        return e;
                    });
                    await Promise.all(promise);
                    // console.log(response.data);

                    commit('SET_GOODS', response.data);

                 //   dispatch("message", ["success", "Товары выведены"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 getGoods: " + e], { root: true });
            });







    },

    async getGoodInfo({ commit }, element_id) {

        let url = store.getters['deals/GET_DEAL'].site.url;        

        await Vue.axios
            .get(url + '/__scripts/crm/element.php', {
                params: {
                    ELEMENT_ID: element_id
                }
            })
            .then(response => {
                 
                if (response.status == 200 && response.data) {

                    commit('SET_GOOD', {
                        ext_id: response.data.ID,
                        picture: response.data.PREVIEW_PICTURE,
                        sort: 0,

                        site_id:store.getters['deals/GET_DEAL'].site.id,

                        name: response.data.NAME,
                        price: Math.round(response.data.price.VALUE),
                        quantity: 1,
                        sale: response.data.price.DISCOUNT_VALUE ? response.data.price.VALUE - response.data.price.DISCOUNT_VALUE : 0,
                        showrub: 'N',
                        checkbox: 'Y',
                        features: response.data.features,
                        code: response.data.CODE,

                    });


                }
                else{
                    commit('SET_GOOD',[]);
                }
            })
            .catch(error => {
                console.log(error);

            })
            .finally();
    }
};

export default {
    namespaced: true,
    state: Object.assign({}, initialState),
    getters,
    mutations,
    actions,
};