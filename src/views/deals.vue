<template>
  <div>
    <v-card>
      <v-card-title class="pb-0">
        <v-row no-gutters>
          <v-col>
            Сделки
            <span
              v-if="this.$route.params.email || this.$route.params.client_id"
            >Клиента: {{this.$route.params.email}} {{this.$route.params.client_id}}</span>
            <v-btn
              :loading="loadingData"
              class="ml-2 green"
              fab
              x-small
              dark
              depressed
              @click.native="reloadData()"
            >
              <v-icon>refresh</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="auto" style="position:relative;">
            <v-btn
              v-show="searchInvoice"
              @click="searchInvoice=''"
              text
              style="position:absolute;left:-65px;top:7px;z-index:5"
            >
              <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
            <v-text-field
            class="pt-0"
              v-model="searchInvoice"
              append-icon="search"
              label="Счет №ст..."
              hide-details
            >Счет №ст</v-text-field>
          </v-col>
          <v-col cols="1"></v-col>
          <v-col style="position:relative;">
            <v-btn
              v-show="search"
              @click="search=''"
              text
              
              style="position:absolute;left:-65px;top:7px;z-index:5"
            >
              <v-icon>mdi-delete-forever</v-icon>
            </v-btn>
            <v-text-field
            class="pt-0"
              v-model="search"
              append-icon="search"
              label="Поиск по сделкам"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12"></v-col>
          <v-col cols="auto" class="pt-3">
            <v-btn text small @click="showList=!showList" color="green">По стадиям/списком</v-btn>
          </v-col>
          <v-col cols="auto" class="pt-3">
            <v-btn-toggle tile group v-model="justMyDeals">
              <v-btn small value="false">Все сделки</v-btn>

              <v-btn small value="true">Только мои</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-card-title>
      <div v-if="showList">
        <v-data-table
          :headers="headers"
          :items="dealsData"
          :footer-props="{
              showFirstLastPage: true,
            
              prevIcon: 'mdi-arrow-left',
              nextIcon: 'mdi-arrow-right',
              'items-per-page-options': [20, 200, 1000]
            }"
          class="elevation-1"
        >
          <template v-slot:item.id="{ item }">
            <v-row no-gutters>
              <v-col cols="12">
                <div
                  style="float:left;"
                  v-if="!item.flagTask && (item.stage.id === '1' || item.stage.id === '2' || item.stage.id === '3')"
                >
                  <v-icon small color="red" title="Нет задач">mdi-information</v-icon>
                </div>
                <div
                  class="font-weight-black title mr-1 pt-1"
                  style="line-height: 17px;float:left;cursor: pointer;"
                  @click.prevent="showDeal(item.id)"
                >{{ item.id }}</div>

                <div class="caption">{{ item.date_begin }}</div>
              </v-col>
              <v-col>
                <div
                  v-if="item.type"
                  class="overline mr-1"
                  style
                  :style="{ 'color':item.type.color}"
                >{{item.type.name}}</div>
                <!-- <div
                  v-if="item.site"
                  class="overline"
                  :style="{'color':item.site.color}"
                >{{item.site.name}}</div>-->
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.title="{ item }">
            <v-row
              dense
              align="center"
              style="height: 100%;white-space:pre-wrap;"
              @click="showDeal(item.id)"
            >
              <v-col>{{ item.title || '[Без оборудования]'}}</v-col>
            </v-row>
          </template>
          <template v-slot:item.stage.name="{ item }">
            <v-chip
              small
              label
              :color="item.stage.color"
              :outlined="item.stage.id==7||item.stage.id==8?true:false"
            >{{ item.stage.name }}</v-chip>
          </template>
          <template v-slot:item.client.name="{ item }">
            <clientChip :client="item.client" />
            <!-- <v-chip @click="showClient(item.client_id)" color="orange"  text-color="white">{{ item.client }}<v-icon right>mdi-star</v-icon></v-chip> -->
          </template>
          <template v-slot:item.comment="{ item }">
            <div class="manager-write comment-text">{{ item.last_task || item.comment }}</div>
          </template>
        </v-data-table>
      </div>

      <div v-else style="margin-top:-10px;">
        <pipeline :deals="dealsData" />
      </div>
    </v-card>

    <v-btn bottom color="green" dark fab fixed left @click="addDeal()">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import pipeline from "@/components/app/pipeline";
import clientChip from "@/views/client/clientChip";

export default {
  name: "deals",
  data() {
    return {
      justMyDeals: false,
      showList: false,
      loadingData: false,
      search: "",
      searchInvoice: "",

      dragging: false,
      headers: [
        { text: "№", value: "id", width: "160px" },
        {
          text: "Название",
          sortable: false,
          value: "title"
        },
        {
          text: "Стадия",
          value: "stage.name",
          width: "100px",
          sortable: false
        },
        {
          text: "Клиент",
          value: "client.name",
          width: "100px",
          sortable: false
        },
        { text: "Задачи", value: "comment", width: "300px", sortable: false }
      ]
    };
  },
  methods: {
    async reloadData() {
      this.search = "";
      this.$route.params.email = false;
      this.loadingData = true;
      await this.loadData();
      this.loadingData = false;
    },
    addDeal() {
      this.$router.push({ name: "newDeal" });
    },
    getColor(stage) {
      // из базы
      if (stage > 400) return "red";
      else if (stage > 200) return "orange";
      else return "green";
    },

    showDeal(deal_id) {
      this.$store.dispatch("deals/show", deal_id);
    },

    async loadData() {
      // this.loadingData = true;
      if (this.$route.params.email) {
        await this.$store.dispatch("deals/searchDeals", {
          email: this.$route.params.email
        });
      } else if (this.$route.params.client_id) {
        await this.$store.dispatch("deals/searchDeals", {
          client_id: this.$route.params.client_id
        });
      } else {
        await this.$store.dispatch("deals/getAllDeals");
      }
      // this.loadingData = false;
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
    manager() {
      //console.log(this.$store.getters["managers/GET_MANAGER"]);
      return this.$store.getters["managers/GET_MANAGER"];
    },
    dealsData: {
      get() {
        var search = this.search.toLowerCase();
        var searchInvoice = this.searchInvoice.replace(/[^0-9]/g, "");
        var manager_id = this.manager.id;

        if (this.justMyDeals == "true") {
          return this.$store.getters["deals/GET_DEALS"].filter(
            deal => deal.manager === manager_id
          );
        } else if (searchInvoice.length > 0) {
          return this.$store.getters["deals/GET_DEALS"].filter(deal =>
            deal.invoices.some(function(item) {
              return item.id == searchInvoice;
            })
          );
        } else {
          return this.$store.getters["deals/GET_DEALS"].filter(
            deal =>
              deal.id.indexOf(search) !== -1 ||
              deal.client.name.toLowerCase().indexOf(search) !== -1 ||
              deal.stage.name.toLowerCase().indexOf(search) !== -1 ||
              deal.type.name.toLowerCase().indexOf(search) !== -1 ||
              deal.site.name.toLowerCase().indexOf(search) !== -1 ||
              deal.comment.toLowerCase().indexOf(search) !== -1 ||
              deal.title.toLowerCase().indexOf(search) !== -1
          );
        }
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
    if (this.$route.params.email || this.$route.params.client_id) {
      this.showList = true;
    }

    await this.loadData();
    this.$Progress.finish();
  },
  beforeDestroy() {
    this.$store.commit("deals/reset");
  },
  components: {
    pipeline,
    clientChip
  }
};
</script>