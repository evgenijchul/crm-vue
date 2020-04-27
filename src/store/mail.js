import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import store from '@/store'

const initialState = {

    files: [],
    toCopy: '',
    id: 0,

    loading_send: false,
    email_from: '',
    items_to: [],
    select_to: '',
    myHTML: '',
    subject: ''

};
const getters = {

    GET_FILES: state => {
        return state.files;
    },
    GET_toCopy: state => {
        return state.toCopy;
    },
    GET_ID: state => {
        return state.id;
    },

};
const mutations = {
    SET_FILES: (state, files) => {
        state.files = files;
    },
    SET_toCopy: (state, toCopy) => {
        state.toCopy = toCopy;
    },
    SET_ID: (state, id) => {
        state.id = id;
    },
};
const actions = {

    send: async ({ commit, dispatch }, { from, to, subject, text, files, deal_id }) => {

        if (typeof from === "undefined" || typeof to === "undefined" || typeof subject === "undefined" || typeof text === "undefined" || typeof files === "undefined") {
            dispatch("message", ["error", "Ошибка 3 send: неверно заданы параметры"], { root: true });
            return;
        }
        await axios
            .post('/mail/send',
                {
                    from: from,
                    to: to,
                    subject: subject,
                    text: text,
                    files: files,
                    deal_id: deal_id

                }
            )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка send: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    console.log(response.data);
                    // commit('SET_DEAL', response.data);
                    if (response.data === true) { dispatch("message", ["success", "Сообщение отправлено"], { root: true }); }
                    else { dispatch("message", ["error", "Сообщение НЕ отправлено!"], { root: true }); }
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка send: " + e], { root: true });
            });

    },
    create_kp: async ({ commit, dispatch }, { deal_id, sid }) => {

        if (typeof deal_id === "undefined" || typeof sid === "undefined") {
            dispatch("message", ["error", "Ошибка 3 create_kp: неверно заданы параметры"], { root: true });
            return;
        }

        if (globalVars.vueGoodsList.length === 0) {
            alert("Не заданы товары");
            return;
        }


        await axios
            .post("/documents/" + sid + "/deal/" + deal_id,

                Object.assign({ text: globalVars.annotationKP }, globalVars)

            )
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка create_kp: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {

                    let moreFiles = Object.assign([], response.data.moreFiles);
                    moreFiles.unshift("/tmp/" + response.data.filename);
                    // console.log(moreFiles);
                    commit('SET_FILES', moreFiles);
                    commit('SET_toCopy', response.data.toCopy);
                    commit('SET_ID', response.data.id);

                    dispatch("message", ["success", "Файл КП " + response.data.filename + " создан"], { root: true });
                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка create_kp: " + e], { root: true });
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