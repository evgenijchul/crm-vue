<template>
  <div>
    <v-card>
      <v-card-title>
        <v-row no-gutters>
          <v-col>
            Клиенты
            <v-btn
              :loading="loadingData"
              class="ml-2 yellow darken-4"
              fab
              x-small
              dark
              depressed
              @click.native="reloadData()"
            >
              <v-icon>refresh</v-icon>
            </v-btn>
          </v-col>
          <v-col style="position:relative;">
            <v-btn
              v-show="search"
              @click="search=''"
              text
              style="position:absolute;left:-70px;top:17px;z-index:5"
            >
              <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Поиск"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <div>
        <v-data-table
          :headers="headers"
          :items="clientsData"
          class="elevation-1"
          :footer-props="{
              showFirstLastPage: true,
            
              prevIcon: 'mdi-arrow-left',
              nextIcon: 'mdi-arrow-right',
              'items-per-page-options': [10, 100, 1000]
            }"
        >
          <template v-slot:item.actions="{ item }">
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" class="subtitle-1">mdi-dots-horizontal</v-icon>
              </template>
              <v-list dense>
                <v-list-item @click="removeClient(item.id)" class="my-0 py-0">
                  <v-list-item-title>Удалить</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template v-slot:item.name="{ item }">
            <clientChip :client="item" />
          </template>
          
          <template v-slot:item.comment="{ item }">
            <div class="manager-write comment-text">{{ item.last_task || item.comment }}</div>
          </template>

          <template v-slot:item.stat="{ item }">
            <v-card
              v-for="dh in item.deals"
              :key="dh.id"
              style="width:250px; float:left;"
              class="my-2 mr-1"
            >
              <v-card-title class="px-0 py-0">
                <v-chip label x-small @click="showDeal(dh.id)">Сделка №{{dh.id}}</v-chip>
                <v-chip x-small label :color="dh.stage.color" class="ml-2">{{ dh.stage.name }}</v-chip>
              </v-card-title>
              <v-card-text class="caption mx-1 px-1 mb-0 pb-0">
                <p style="white-space:pre-wrap;">{{dh.title}}</p>
                <p>{{dh.comment}}</p>
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <v-btn bottom color="yellow darken-4" dark fab fixed left @dblclick="addClient()">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import mixins from '@/mixins.js'
import clientChip from "@/views/client/clientChip";

export default {
  name: "deals",
  mixins: [mixins],
  data() {
    return {
      loadingData: false,
      search: "",

      headers: [
        { text: "", value: "actions", width: "30px" },
        { text: "№", value: "id", width: "50px" },
        {
          text: "Название или ФИО",
          sortable: false,
          value: "name"
        },
        {
          text: "Комментарий",
          value: "comment",
   
          sortable: false
        },
        {
          text: "Сделки",
          value: "stat",
          width: "",
          sortable: false
        }
      ]
    };
  },
  methods: {
    async reloadData() {
      this.search = "";
      this.loadingData = true;
      await this.loadData();
      this.loadingData = false;
    },
    addClient() {
      this.$store.commit("clients/SET_CLIENT_ID", 0);
      this.$store.state.showClient = true;
    },
    async removeClient(client_id) {
      await this.$store.dispatch("clients/saveRow", {
        id: client_id,
        row: "active",
        data: "N"
      });
      this.loadData();
    },

    async loadData() {
      //this.loadingData = true;
      // if (this.$route.params.email) {
      //   await this.$store.dispatch("clients/getAllClients", {
      //     email: this.$route.params.email
      //   });
      // } else {

      await this.$store.dispatch("clients/getAllClients");
      // }
      //this.loadingData = false;
    }
  },
  watch: {
    editClientFlag(newValue) {
      if (newValue === true) {
        this.reloadData();
        this.$store.state.flagEdit = false;
      }
    },
    "$route.params": {
      async handler() {
        await this.loadData();
      },
      deep: true
    }
  },
  computed: {
    clientsData: {
      get() {
      //  console.log(this.$store.getters["clients/GET_CLIENTS"][0]);
        var search = this.search
          .toLowerCase()
          .replace(/[^0-9a-zA-Zа-яА-Я]/g, "");
        // console.log(this.$store.getters["deals/GET_DEAL"]);
        return this.$store.getters["clients/GET_CLIENTS"].filter(function(
          client
        ) {
          return (
            client.contacts.some(function(item) {
              return (
                (item.tel
                  ? item.tel
                      .replace(/[^0-9a-zA-Zа-яА-Я]/g, "")
                      .indexOf(search) !== -1
                  : false) ||
                (item.email
                  ? item.email
                      .replace(/[^0-9a-zA-Zа-яА-Я]/g, "")
                      .indexOf(search) !== -1
                  : false) ||
                (item.icq
                  ? item.icq
                      .replace(/[^0-9a-zA-Zа-яА-Я]/g, "")
                      .indexOf(search) !== -1
                  : false) ||
                (item.skype
                  ? item.skype
                      .replace(/[^0-9a-zA-Zа-яА-Я]/g, "")
                      .indexOf(search) !== -1
                  : false) ||
                (item.comment
                  ? item.comment
                      .replace(/[^0-9a-zA-Zа-яА-Я]/g, "")
                      .indexOf(search) !== -1
                  : false)
              );
            }) ||
            client.recvi.some(function(item) {
              return (
                (item.name
                  ? item.name
                      .replace(/[^0-9a-zA-Zа-яА-Я]/g, "")
                      .indexOf(search) !== -1
                  : false) ||
                (item.inn
                  ? item.inn
                      .replace(/[^0-9a-zA-Zа-яА-Я]/g, "")
                      .indexOf(search) !== -1
                  : false) ||
                (item.kpp
                  ? item.kpp
                      .replace(/[^0-9a-zA-Zа-яА-Я]/g, "")
                      .indexOf(search) !== -1
                  : false) ||
                (item.comment
                  ? item.comment
                      .replace(/[^0-9a-zA-Zа-яА-Я]/g, "")
                      .indexOf(search) !== -1
                  : false)
              );
            }) ||
            client.id.indexOf(search) !== -1 ||
            client.name.toLowerCase().indexOf(search) !== -1 ||
            client.comment.toLowerCase().indexOf(search) !== -1
          );
        });
      },
      set(value) {
        return value;
      }
    },

    editClientFlag() {
      return this.$store.state.flagEdit;
    }
  },
  created() {
    this.$Progress.start();
  },
  async mounted() {
    this.loadData();
    this.$Progress.finish();
  },
  beforeDestroy() {
    this.$store.commit("clients/reset");
  },
  components: {
    clientChip
  }
};
</script>