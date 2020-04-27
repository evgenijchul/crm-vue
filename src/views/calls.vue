<template>
  <div>
    <v-card>
      <v-card-title>
        <v-row no-gutters>
          <v-col>
            Входящие звонки (последние 100)
            <v-btn
              :loading="loadingData"
              class="ml-2 blue-grey"
              fab
              x-small
              dark
              depressed
              @click.native="reloadData()"
            >
              <v-icon>refresh</v-icon>
            </v-btn>
            <br />
            <v-alert
              v-if="allCallLoad"
              dense
              color="success"
            >Все звонки ({{calls.length}} шт) загружены</v-alert>
            <v-btn
              v-else
              x-small
              text
              :loading="loadingAllCall"
              @click.native="loadAllCall()"
            >Загрузить все звонки</v-btn>
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
              label="Поиск по номеру"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-data-table
          dense
          locale="ru"
          :headers="headers"
          :items="calls"
          item-key="id"
          group-by="date"
          group-desc
          class="elevation-1"
          show-group-by
          :footer-props="{
              showFirstLastPage: true,            
              prevIcon: 'mdi-arrow-left',
              nextIcon: 'mdi-arrow-right',
              'items-per-page-options': [10, 100, 1000]
            }"
        >
          <template v-slot:item.time="{ item }">
            {{item.time}}
            <br />
            {{item.site}}
          </template>

          <template v-slot:item.record="{ item }">
            <audio
              controls
              controlslist="nodownload"
              v-for="(a, i) in item.audio_file"
              :key="'audio'+i"
            >
              <source :src="'http://192.168.1.104'+a.file" type="audio/mp3" />
            </audio>
          </template>

          <template v-slot:item.number="{ item }">
            {{item.number}}
            <calling :number="item.number" :site_sid="item.site" />
          </template>
                    <template v-slot:item.create="{ item }">
            <v-chip
                  color="green"
                  @click="$router.push('/addDealFromTel/number/'+item.number+'/site/'+item.site)"
                  depressed
                  dark
                  x-small
                  style="line-height:12px;height:35px"
                  v-if="item.info.length===0"
                >
                  <v-icon left>mdi-plus</v-icon>Создать сделку
                  <br />на основе <br>телефона
                </v-chip>
          </template>

          <template v-slot:item.stat="{ item }">
            <v-row align="center" style="height: 100%;white-space:pre-wrap;">
             
              <v-col v-if="item.info.length===0">
                <mytextarea
                  store="calls"
                  row="comment"
                  rowcol="1"
                  :id="item.id"
                  comment="true"
                  :value.sync="item.comment"
                />
              </v-col>

              <v-col v-for="(i,index) in item.info" :key="index">
                <p class="overline mt-2 mb-0 pb-0">{{ i.info }}:</p>
                <v-row v-if="i.deals" no-gutters>
                  <v-col cols="12" v-for="(dl, deal_id) in i.deals" :key="deal_id">
                    <v-chip
                      label
                      small
                      @click="$store.dispatch('deals/show', deal_id)"
                    >Сделка №{{deal_id}}</v-chip>

                    <p
                      class="caption"
                      style="font-size:11px!important;line-height:11px!important;white-space: pre-line;"
                    >{{dl.title}}</p>
                  </v-col>
                </v-row>

                <v-row v-if="i.clients" no-gutters>
                  <v-col cols="12" v-for="(cl, client_id) in i.clients" :key="client_id">
                    <clientChip :client="cl" />
                    <v-row no-gutters>
                      <v-col cols="12" v-for="dl in cl.deals" :key="dl.id">
                        <v-chip
                          label
                          small
                          @click="$store.dispatch('deals/show', dl.id)"
                        >Сделка №{{dl.id}}</v-chip>
                        <p
                          class="caption"
                          style="font-size:11px!important;line-height:11px!important;white-space: pre-line;"
                        >{{dl.title}}</p>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-row v-if="i.contacts" no-gutters>
                  <v-row v-for="(co, co_id) in i.contacts" :key="co_id" no-gutters>
                    <v-col>
                      Имя контакта: {{co.name}}
                      <clientChip :client="co.client" />
                      <v-row no-gutters>
                        <v-col cols="12" v-for="dl in co.client.deals" :key="dl.id">
                          <v-chip
                            label
                            small
                            @click="$store.dispatch('deals/show', dl.id)"
                          >Сделка №{{dl.id}}</v-chip>
                          <p
                            class="caption"
                            style="font-size:11px!important;line-height:11px!important;white-space: pre-line;"
                          >{{dl.title}}</p>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-row>
              </v-col>
            </v-row>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import clientChip from "@/views/client/clientChip";
import calling from "@/components/app/calling";
import mytextarea from "@/components/app/mytextarea";

export default {
  name: "calls",
  data() {
    return {
      allCallLoad: false,
      loadingData: false,
      loadingAllCall: false,
      search: "",
      headers: [
        {
          text: "Дата",
          align: "left",
          value: "date",
          width:"10%"
        },

        { text: "Время", value: "time", width:"10%"},
        { text: "Record", value: "record", width:"10%"},

        { text: "Номер", value: "number",width:"170px" },
        { text: "", value: "create",width:"170px" },

        { text: "Кто звонил", value: "stat", width: "70%" }
      ]
    };
  },
  computed: {
    calls: {
      get() {
        // console.log(this.$store.getters["calls/GET_CALLS"]);
        return this.$store.getters["calls/GET_CALLS"].filter(
          call => call.number.indexOf(this.search) !== -1
          // call.site.toLowerCase().indexOf(this.search) !== -1
          // deal.stage.name.toLowerCase().indexOf(this.search) !== -1 ||
          // deal.type.name.toLowerCase().indexOf(this.search) !== -1 ||
          // deal.site.name.toLowerCase().indexOf(this.search) !== -1 ||
          // deal.comment.toLowerCase().indexOf(this.search) !== -1 ||
          // deal.title.toLowerCase().indexOf(this.search) !== -1
        );
      },
      set(value) {
        return value;
      }
    },
    editClientFlag() {
      return this.$store.state.flagEdit;
    }
  },
  watch: {
    editClientFlag(newValue) {
      if (newValue === true) {
        this.reloadData();
        this.$store.state.flagEdit = false;
      }
    }
  },
  methods: {
    async reloadData() {
      this.search = "";
      this.loadingData = true;
      await this.loadData();
      this.loadingData = false;
    },
    async loadData() {
      // this.loadingData = true;

      await this.$store.dispatch("calls/getCalls");

      // this.loadingData = false;
    },
    async loadAllCall() {
      this.loadingAllCall = true;

      await this.$store.dispatch("calls/getAllCalls");

      this.loadingAllCall = false;
      this.allCallLoad = true;
    }
  },
  created() {
    this.$Progress.start();
    //window.scrollTo(0, 0);
  },
  async mounted() {
    await this.loadData();
    this.$Progress.finish();
  },
  components: {
    clientChip,
    calling,
    mytextarea
  }
};
</script>

<style>
.theme--light.v-data-table .v-row-group__header,
.theme--light.v-data-table .v-row-group__summary {
  background: grey !important;
}
</style>