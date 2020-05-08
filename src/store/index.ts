import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
// import VueAxios from 'vue-axios'
// Vue.use(VueAxios, axios)
Vue.use(Vuex)

 import ManagersModule, {managersModule} from './modules/managers';


// import catalog from '@/store/catalog';
// import goodsInDeal from '@/store/goodsInDeal';

// import clients from '@/store/clients';
// import managers from '@/store/managers';
// import deals from '@/store/deals';
// import contacts from '@/store/contacts';
// import discounts from '@/store/discounts';
// import stages from '@/store/stages';
// import recviz from '@/store/recviz';
// import banks from '@/store/banks';
// import history from '@/store/history';
// import historyTech from '@/store/historyTech';
// import type from '@/store/type';
// import sites from '@/store/sites';
// import calls from '@/store/calls';
// import mail from '@/store/mail';
// import files from '@/store/files';
// import regs from '@/store/regs';
// import task from '@/store/task';
// import dellin from '@/store/dellin';
// import phoneBook from '@/store/phoneBook';
// import phoneBookContacts from '@/store/phoneBookContacts';



// const store = new Vuex.Store({

//   state: {
//     message: {
//       type: "",
//       text: ""      
//     },
//     urlApi:"",
//     dev:false,
//     showClient: false,
//     showMail: false,
//     flagEdit: false // флаг, что какое-то изменение (тектового поля) произошло

//   },
//   getters: {

//   },
//   mutations: {

//   },
//   actions: {
//     message: async ({ state }, [type, text]) => {
//       // state.message = state.message + JSON.stringify(text);
//       state.message.type = type;
//       state.message.text = state.message.text + "   " + JSON.stringify(text);
//     },

//   },
//   modules: {
//     dellin,phoneBookContacts, phoneBook, task, auth, catalog, goodsInDeal, clients, managers, deals, contacts, discounts, stages, recviz, banks, history, historyTech, type, sites, calls, mail, files, regs
//   }
// });
export interface IRootState {
  managers: ManagersModule;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})