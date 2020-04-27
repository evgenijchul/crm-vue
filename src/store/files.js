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
   

    create: async ({ context, commit, dispatch }, { formData, name, date_active, reg_id }) => {

        var file_src = '';


        await axios
            .post('/files/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            .then(response => {
                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 create: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    // commit('SET_CLIENT', response.data);
                    file_src = response.data;

                    dispatch("message", ["success", "Файл загружен"], { root: true });
                    
                    axios.post('/files/create',
                            { name, date_active, file_src, reg_id }
                        )
                        .then(response => {
                            if (response.data.error === "Y") {
                                dispatch("message", ["error", "Ошибка 4 create: " + response.data.code + " | " + response.data.message], { root: true });
                            }
                            else {
                                // commit('SET_CLIENT', response.data);
                                console.log(response.data);
                                dispatch("message", ["success", "Файл записан"], { root: true });
                                //return response.data.id;
                            }
                        })
                        .catch(e => {
                            dispatch("message", ["error", "Ошибка 5 create: " + e], { root: true });
                        });


                    //return response.data.id;
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 create: " + e], { root: true });
            });




    },


    removeFile: async ({ state, getters, dispatch }, { file_id }) => {

        if (typeof file_id === "undefined") {
            dispatch("message", ["error", "Ошибка 3 removeReg: Не задан file_id "], { root: true });
            return;
        }
        await axios
            .get('/files/remove_file/' + file_id)
            .then(response => {

                if (response.data.error === "Y") {
                    dispatch("message", ["error", "Ошибка 1 removeFile: " + response.data.code + " | " + response.data.message], { root: true });
                }
                else {
                    //commit('SET_REG', response.data);
                    console.log(response.data);
                    dispatch("message", ["success", "Fiel удален"], { root: true })
                }
            })
            .catch(e => {
                dispatch("message", ["error", "Ошибка 2 removeFile: " + e], { root: true });
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