<template>
  <div>
    <v-navigation-drawer
      right
      v-model="showDeal"
      :disable-resize-watcher="true"
      fixed
      stateless
      temporary
      style="z-index:98;background: transparent!important;"
      width="100%"
      v-resize="onResize"
    >
      <v-row no-gutters>
        <v-col cols="auto" style="width:48px" @click="clickOutside"></v-col>
        <v-col>
          <v-content v-if="dealData">
            <v-card>
              <v-container fluid fill-height class="pt-0">
                <v-row no-gutters>
                  <!-- левый столбец -->
                  <v-col cols="12" sm="6" id="left-column">
                    <!-- название сделки -->
                    <v-row
                      no-gutters
                      justify="start"
                      align="center"
                      class="blue-grey darken-3 pb-0 white--text"
                    >
                      <v-col cols="auto" class="pt-5 pl-5 pb-3">
                        <h1 class="headline font-weight-bold">Сделка №{{ dealData.id }}</h1>
                      </v-col>
                      <v-col cols="auto">
                        <v-menu origin="center center">
                          <template v-slot:activator="{ on }">
                            <v-btn
                              text
                              :color="dealData.type.color"
                              v-on="on"
                            >{{ dealData.type.name || "Не задан тип" }}</v-btn>
                          </template>
                          <v-list
                            dark
                            dense
                            tile
                            color="blue-grey darken-3 elevation-0"
                            class="py-0"
                          >
                            <v-list-item
                              v-for="dt in dealTypes"
                              :key="dt.id"
                              @click="changeType(dt)"
                              :style="{ 'margin':'0px', 'background-color': dt.color }"
                            >{{ dt.name }}</v-list-item>
                          </v-list>
                        </v-menu>
                      </v-col>
                      <v-col cols="auto" class="mr-auto">
                        <v-menu origin="center center">
                          <template v-slot:activator="{ on }">
                            <v-btn
                              text
                              :color="dealData.site.color"
                              v-on="on"
                            >{{ dealData.site.name || "Не задан сайт" }}</v-btn>
                          </template>
                          <v-list
                            dark
                            dense
                            tile
                            color="blue-grey darken-3 elevation-0"
                            class="py-0"
                          >
                            <v-list-item
                              v-for="ds in dealSites"
                              :key="ds.id"
                              @click="changeSite(ds)"
                              :style="{ 'margin':'0px', 'background-color': ds.color }"
                            >{{ ds.name }}</v-list-item>
                          </v-list>
                        </v-menu>
                      </v-col>
                      <v-col cols="auto " class="pr-5">
                        <v-menu>
                          <template v-slot:activator="{ on }">
                            <v-icon v-on="on" class="white--text subtitle-1">mdi-dots-horizontal</v-icon>
                          </template>
                          <v-list>
                            <v-list-item @click="deleteDeal(dealData.id);">
                              <v-list-item-title>Удалить</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="createChildDeal(dealData.id);">
                              <v-list-item-title>Создать дочернюю сделку</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-col>
                    </v-row>
                    <!-- ответственный менеджер -->

                    <v-row no-gutters class="blue-grey darken-3 pb-5 pl-2" >
                      <v-col cols="auto">
                        <v-chip small dark color="blue-grey darken-3" class="overline pr-1" >Ответственный менеджер:</v-chip>
                      </v-col>
                      <v-col class="pl-0" v-if="respManager">
                        <v-btn
                          v-if="manager.roles.some(r=>r.id==1)== false"
                          x-small
                          text
                          dark
                          outlined
                        >{{respManager.fio}}</v-btn>
                        <v-menu v-else origin="center center">
                          <template v-slot:activator="{ on }">
                            <v-btn v-on="on" x-small dark text outlined  class="overline">{{respManager.fio}}</v-btn>
                          </template>

                          <v-list>
                            <v-list-item-group>
                              <v-list-item
                                dense
                                v-for="m in managerAll"
                                :key="'managerAllResp'+m.id"
                                @click="changeRespManager(m.id)"
                              >{{m.fio}}</v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-menu>
                      </v-col>
                    </v-row>

                    <!-- Стадии сделки -->
                    <v-row no-gutters class="blue-grey darken-3 white--text pl-5 pt-5">
                      <v-col cols="12" sm="5" class="pb-3" v-if="manager.roles">
                        <!-- Сделку в стадии Выполнено, перевести в другую стадию могут только Руковолители -->
                        <v-btn
                          v-if="manager.roles.some(r=>r.id==1)== false && dealData.stage.id == 7"
                          outlined
                          :color="dealData.stage.color"
                        >{{dealData.stage.name}}</v-btn>

                        <v-menu v-else origin="center center" transition="scale-transition">
                          <template v-slot:activator="{ on }">
                            <v-btn
                              small
                              v-on="on"
                              :style="'background-color:' + dealData.stage.color + ';'"
                            >{{dealData.stage.name}}</v-btn>
                          </template>

                          <v-list class="stages py-0">
                            <v-list-item-group color="indigo">
                              <v-list-item
                                v-for="s in stagesDeal"
                                :key="s.id"
                                style="min-height:0;"
                                exact-active-class="border"
                              >
                                <v-list-item-content>
                                  <v-list-item-title
                                    v-text="s.name"
                                    class="border-active"
                                    :class="[ dealData.stage.id===s.id ?'border':'']"
                                    :style="{ 'padding':'10px', 'background-color': s.color }"
                                    @click="changeStage(s)"
                                  ></v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-menu>
                      </v-col>
                      
                    </v-row>

                    <v-row no-gutters>
                      <v-col>
                        <v-container>
                          <v-row no-gutters>
                            <!--клиент-->
                            <v-col cols="12" class="client-wrap elevation-0">
                              <v-divider></v-divider>

                              <v-btn text color="shades" small @click="showClient(0)">
                                <v-icon>mdi-account-plus</v-icon>Добавить клиента
                              </v-btn>
                              <v-btn
                                :text="showAllClient?false:true"
                                color="shades"
                                small
                                :dark="showAllClient?true:false"
                                @click="selectClient()"
                              >
                                <v-icon>mdi-account-multiple-outline</v-icon>Выбрать другого клиента
                              </v-btn>

                              <div v-if="showAllClient" class="fly-clients elevation-20">
                                <v-card
                                  class="mx-auto overflow-y-auto"
                                  style="max-height:400px;width:100%;"
                                >
                                  <v-sheet class="pa-1 primary lighten-2">
                                    <v-text-field
                                      v-model="searchClient"
                                      dark
                                      flat
                                      solo-inverted
                                      hide-details
                                      clearable
                                      clear-icon="mdi-close-circle-outline"
                                    ></v-text-field>
                                  </v-sheet>
                                  <v-card-text>
                                    <v-treeview
                                      :filter="filterClient"
                                      :items="allClients"
                                      :search="searchClient"
                                      open-on-click
                                      dense
                                      activatable
                                    >
                                      <template v-slot:prepend="{ item }">
                                        <small>({{item.id}})</small>
                                      </template>
                                      <template v-slot:label="{ item }">
                                        <span>{{item.name}}</span>
                                      </template>
                                      <template v-slot:append="{ item }">
                                        <v-btn
                                          text
                                          small
                                          color="yellow darken-4"
                                          @click="changeClient(item.id)"
                                        >выбрать</v-btn>
                                      </template>
                                    </v-treeview>
                                  </v-card-text>
                                </v-card>
                              </div>

                              <div
                                v-if="client.length!==0"
                                class="elevation-0 mx-1"
                                style="border:1px solid #F57F17;"
                              >
                                <v-card class="elevation-0">
                                  <v-sheet elevation="0" class="mt-3">
                                    <v-card-title
                                      class="pb-0 pt-0"
                                      @click="showClient(client.id)"
                                      style="background-color: #FFF9C4;"
                                    >
                                      <v-icon color="yellow darken-4">mdi-account-card-details</v-icon>

                                      <v-avatar
                                        v-if="client.coldeals > 1"
                                        left
                                        size="30"
                                        class="yellow darken-4 mx-1"
                                      >{{client.coldeals}}</v-avatar>
                                      <P class="my-0 py-0" style="line-height: 1.5rem;">
                                        {{client.name || "[Без имени]"}}&nbsp;
                                        <small>(№{{client.id}})</small>
                                      </P>
                                    </v-card-title>
                                  </v-sheet>
                                  <v-card-text class="pt-0 px-0">
                                    <v-row no-gutters>
                                      <v-col cols="12" sm="12" v-if="client.comment">
                                        <p class="comment">{{client.comment}}</p>
                                      </v-col>

                                      <!-- Реквизиты -->

                                      <v-col cols="12" sm="6">
                                        <v-simple-table dense v-if="recvi">
                                          <tr v-if="recvi.full_name || recvi.name">
                                            <td colspan="2">{{recvi.full_name || recvi.name}}</td>
                                          </tr>
                                          <tr v-if="recvi.inn">
                                            <td>ИНН</td>
                                            <td>{{recvi.inn}}</td>
                                          </tr>
                                          <tr v-if="recvi.kpp">
                                            <td>КПП</td>
                                            <td>{{recvi.kpp}}</td>
                                          </tr>
                                        </v-simple-table>
                                      </v-col>
                                      <v-col cols="12" sm="6" v-if="discounts.length">
                                        <v-simple-table dense>
                                          <thead>
                                            <tr>
                                              <th class="text-left">Бренд</th>
                                              <th class="text-left">Скидка</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr v-for="d in discounts" :key="d.id">
                                              <td>{{d.brand}}</td>
                                              <td>{{d.discount}}</td>
                                            </tr>
                                          </tbody>
                                        </v-simple-table>
                                      </v-col>
                                    </v-row>
                                  </v-card-text>
                                </v-card>
                                <!--Контакты клиента-->
                                <v-card
                                  class="elevation-0 pt-0"
                                  v-for="(contact, index) in contacts"
                                  :key="contact.id"
                                >
                                  <v-card-title
                                    class="pb-0 pt-0 subtitle-1 font-weight-bold"
                                    style="width: fit-content;"
                                  >
                                    {{contact.name}}
                                    <v-chip
                                      v-if="dealData.current_delivery_contact_id === contact.id || contacts.length ===1 || (!dealData.current_delivery_contact_id && index===0)"
                                      x-small
                                      color="yellow darken-4"
                                    >Основной контакт</v-chip>

                                    <v-menu v-else>
                                      <template v-slot:activator="{ on }">
                                        <v-icon
                                          v-on="on"
                                          class="subtitle-1 pr-3 mb-1"
                                        >mdi-dots-horizontal</v-icon>
                                      </template>
                                      <v-list dense>
                                        <v-list-item
                                          class="my-0 py-0"
                                          @click="selectActContact(contact.id)"
                                        >
                                          <v-list-item-title>Установить основным</v-list-item-title>
                                        </v-list-item>
                                      </v-list>
                                    </v-menu>
                                  </v-card-title>
                                  <v-card-text>
                                    <p v-if="contact.comment" class="comment">{{contact.comment}}</p>

                                    <v-simple-table
                                      dense
                                      class="client-contact"
                                      style="width:unset"
                                    >
                                      <tr v-if="contact.tel">
                                        <td>Телефон</td>

                                        <td v-if="dealData.site">
                                          {{contact.tel}}
                                          <calling
                                            v-for="(tel_format, index) in contact.tel_format"
                                            :key="'contact_pb_tel'+index"
                                            :number="tel_format"
                                            :site_sid="dealData.site.url.match(/http\:\/\/([^\/\.\:]*)/i)[1]"
                                          />
                                        </td>
                                      </tr>
                                      <tr v-if="contact.email">
                                        <td>почта</td>
                                        <td>
                                          {{contact.email}}
                                          <v-menu>
                                            <template v-slot:activator="{ on }">
                                              <v-btn
                                                outlined
                                                fab
                                                x-small
                                                color="light-blue"
                                                depressed
                                                dark
                                                v-on="on"
                                              >
                                                <v-icon class>mdi-email-send-outline</v-icon>
                                              </v-btn>
                                            </template>

                                            <v-list dense class="my-0 py-0">
                                              <v-list-item
                                                dense
                                                @click="sendMail(contact.email, contact.name)"
                                              >
                                                <v-list-item-title>Пустое письмо</v-list-item-title>
                                              </v-list-item>
                                              <v-list-item
                                                dense
                                                @click="sendMail(contact.email, contact.name, 'Отправляли Вам счет на оплату, не подскажите, запрос еще актуален или аннулировать счет ?', 'Актуальность счета')"
                                              >
                                                <v-list-item-title>По актуальности счета</v-list-item-title>
                                              </v-list-item>
                                              <v-list-item
                                                dense
                                                @click="sendMail(contact.email, contact.name, 'Отправляли Вам коммерческое предложение, не подскажите, запрос еще актуален или нет?','Актуальность КП')"
                                              >
                                                <v-list-item-title>По актуальности КП</v-list-item-title>
                                              </v-list-item>
                                            </v-list>
                                          </v-menu>
                                        </td>
                                      </tr>
                                      <tr v-if="contact.icq">
                                        <td>ICQ</td>
                                        <td>{{contact.icq}}</td>
                                      </tr>
                                      <tr v-if="contact.skype">
                                        <td>SKYPE</td>
                                        <td>{{contact.skype}}</td>
                                      </tr>
                                    </v-simple-table>
                                  </v-card-text>
                                </v-card>
                              </div>
                              <v-divider></v-divider>
                            </v-col>

                            <!-- Информация по сделке -->
                            <v-col cols="12" class="deal-wrap">
                              

                              <v-card class="elevation-0">
                                <!-- <v-card-title class="pb-0 pt-4">Информация по сделке</v-card-title> -->
                                <v-card-text>
                                  <mytextarea
                                    store="deals"
                                    row="address"
                                    :id="dealData.id"
                                    title="Адрес доставки"
                                    :value.sync="dealData.address"
                                  />
                                  <mytextarea
                                    store="deals"
                                    row="comment"
                                    rowcol="3"
                                    :id="dealData.id"
                                    title="Комметарий к сделке"
                                    comment="true"
                                    :value.sync="dealData.comment"
                                  />
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-col>
                    </v-row>
                  </v-col>
                  <!-- правый столбец -->
                  <v-col cols="12" sm="6" id="right-column">
                    <!-- история по сделке -->
                    <history :deal_id="dealData.id" />
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="12">
                    <v-divider></v-divider>
                    <!-- товары -->
                    <goodsList />
                  </v-col>
                </v-row>

              

           
              
              </v-container>
            </v-card>
          </v-content>
        </v-col>
      </v-row>
    </v-navigation-drawer>
  </div>
</template>

<script>
import goodsList from "@/views/deal/goodsList";

import mytextarea from "@/components/app/mytextarea";
import calling from "@/components/app/calling";
import history from "@/views/deal/history";

export default {
  data() {
    return {
      showDeal: true,
      caseSensitive: false,
      searchClient: "",
      showAllClient: false,
      allClients: [],
      heightLeftColumn: null,
      showContact: null,
      currentDeliveryContactId: 1
    };
  },

  computed: {
    windowWidthProc() {
      let w = this.windowWidth;
      if (w < 700) {
        return "95%";
      } else if (w < 850) {
        return "95%";
      } else if (w < 1000) {
        return "95%";
      } else {
        return "95%";
      }
    },
    manager() {
      //console.log(this.$store.getters["managers/GET_MANAGER"]);
      return this.$store.getters["managers/GET_MANAGER"];
    },
    managerAll() {
      return this.$store.getters["managers/GET_MANAGER_ALL"];
    },
    recvi() {
      // console.log(this.$store.getters["recviz/GET_RECVIZ"]);
      return this.$store.getters["recviz/GET_RECVIZ"].filter(
        r => r.id === this.dealData.current_recvi_id
      )[0];
    },
    respManager() {
      return this.$store.getters["managers/GET_MANAGER_ALL"].filter(
        m => m.id === this.dealData.manager_id
      )[0];
    },
    dealData: {
      get() {
        // console.log(this.$store.getters["deals/GET_DEAL"]);
        return this.$store.getters["deals/GET_DEAL"];
      },
      set(value) {
        return value;
      }
    },
    dealTypes() {
      return this.$store.getters["type/GET_TYPES"];
    },
    dealSites() {
      return this.$store.getters["sites/GET_SITES"];
    },
    stagesDeal() {
      return this.$store.getters["stages/GET_STAGES"];
    },

    client() {
      return this.$store.getters["clients/GET_CLIENT"];
    },
    // contacts() {
    //   return this.$store.getters["contacts/GET_CONTACTS"];
    // },
    discounts() {
      return this.$store.getters["discounts/GET_DISCOUNTS"];
    },
    contacts() {
      return this.$store.getters["contacts/GET_CONTACTS"];
    },
    filterClient() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    }
  },
  methods: {
    async changeRespManager(manager_id) {
      await this.$store.dispatch("deals/saveRow", {
        id: this.dealData.id,
        row: "manager_id",
        data: manager_id
      });

      await this.$store.dispatch("deals/getDeal", this.dealData.id);
    },
    eventESC(event) {
      if (event.keyCode === 27) {
        this.clickOutside();
      }
    },
    clickOutside() {
      if (
        this.$store.state.showClient !== true &&
        this.$store.state.showMail !== true
      )
        this.$store.state.deals.showDeal = false;
    },
    sendMail(mail_to, name_to, $text = "", $subject = "") {
      this.$store.state.showMail = true;
      this.$store.state.mail.files = [];
      let deal_id = this.$store.getters["deals/GET_DEAL_ID"];

      this.$store.state.mail.email_from = this.$store.getters[
        "deals/GET_DEAL"
      ].site.mail;

      let to = [];
      to.push({ email: mail_to, text: name_to + " <" + mail_to + ">" });

      this.$store.state.mail.items_to = to;
      this.$store.state.mail.select_to = mail_to;

      let signature = "";
      if (this.$store.state.mail.email_from == "info@5000wt.ru") {
        signature = this.$store.getters["managers/GET_MANAGER"]
          .mail_signature_5000wt;
      } else if (this.$store.state.mail.email_from == "info@stabmart.ru") {
        signature = this.$store.getters["managers/GET_MANAGER"]
          .mail_signature_stabmart;
      }

      this.$store.state.mail.myHTML =
        "Здравствуйте! <br><br>" + $text + "<br><br>" + signature;
      this.$store.state.mail.subject = $subject;
      this.$store.state.mail.loading_send = false;
    },

    async deleteDeal(deal_id) {
      await this.$store.dispatch("deals/saveRow", {
        id: deal_id,
        row: "active",
        data: "N"
      });
      this.$router.push({
        name: "deals"
      });
      this.$store.state.deals.showDeal = false;
      this.$store.state.flagEdit = true;
    },
    async createChildDeal(deal_id) {
      this.$router.push({
        name: "createChildDeal",
        params: { deal_id: deal_id }
      });
    },

    async changeClient(client_id) {
      await this.$store.dispatch("deals/saveRow", {
        id: this.dealData.id,
        row: "client_id",
        data: client_id
      });
      await this.$store.dispatch("deals/saveRow", {
        id: this.dealData.id,
        row: "current_recvi_id",
        data: "NULL"
      });
      await this.$store.dispatch("deals/saveRow", {
        id: this.dealData.id,
        row: "current_delivery_contact_id",
        data: "NULL"
      });
      this.dealData.current_recvi_id = null;

      await this.$store.dispatch("clients/getClient", client_id);
      await this.$store.dispatch("contacts/getContacts", client_id);
      await this.$store.dispatch("discounts/getDiscounts", client_id);
      await this.$store.dispatch("recviz/getRecviz", client_id);

      this.showAllClient = false;
      this.$store.state.flagEdit = true;
    },
    async changeStage(stage) {
      await this.$store.dispatch("deals/saveRow", {
        id: this.dealData.id,
        row: "stage_id",
        data: stage.id
      });
      this.dealData.stage = stage;
      //console.log(stage);
      this.$store.state.flagEdit = true;
    },
    async changeType(type) {
      await this.$store.dispatch("deals/saveRow", {
        id: this.dealData.id,
        row: "type_id",
        data: type.id
      });
      this.dealData.type = type;
      this.$store.state.flagEdit = true;
      //console.log(stage);
    },
    async changeSite(site) {
      await this.$store.dispatch("deals/saveRow", {
        id: this.dealData.id,
        row: "site_id",
        data: site.id
      });
      this.dealData.site = site;
      //console.log(stage);
      await this.loadData();
    },

    showClient(clientId) {
      this.$store.commit("clients/SET_CLIENT_ID", clientId);
      this.$store.state.showClient = true;
    },
    async selectActContact(contact_id) {
      this.dealData.current_delivery_contact_id = contact_id;
      const id = this.dealData.id;
      const data = contact_id;
      const row = "current_delivery_contact_id";
      await this.$store.dispatch("deals/saveRow", { id, row, data });
    },
    async selectClient() {
      this.showAllClient = !this.showAllClient;
      await this.$store.dispatch("clients/getAllClients");
      // this.allClients = this.$store.getters["clients/GET_CLIENTS"];

      // this.allClients = _.each(
      //    this.$store.getters["clients/GET_CLIENTS"],
      //   (value, index) => {
      //     return { id: value.id, name: value.name };
      //   }
      // );
      this.allClients = Object.assign(
        [],
        this.$store.getters["clients/GET_CLIENTS"]
      );
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    async loadData() {
      // console.log("loadData" + this.$store.state.deals.dealId);
      await this.$store
        .dispatch("deals/getDeal", this.$store.state.deals.dealId)
        .then(async () => {
          let client_id = this.$store.getters["deals/GET_DEAL"].client_id;
          if (client_id) {
            await this.$store.dispatch("clients/getClient", client_id);
            await this.$store.dispatch("recviz/getRecviz", client_id);
            await this.$store.dispatch("contacts/getContacts", client_id);
            await this.$store.dispatch("discounts/getDiscounts", client_id);
          }
          await this.$store.dispatch("history/getAllHistory", this.dealData.id);

          await this.$store.dispatch("goodsInDeal/getGoods", this.dealData.id);

          await this.$store
            .dispatch("task/getTaskDeal", this.dealData.id)
            .then(() => {});
        });
    },
    updateHeightLeftColumn() {
      this.$store.state.history.heightLeftColumn = this.$el.querySelector(
        "#left-column"
      ).clientHeight;
    }
  },
  watch: {
    showDeal(newValue) {
      this.$store.state.showDeal = newValue;
    }
    // "$route.params": {
    //   async handler() {
    //     await this.loadData();
    //     //document.title = "Сделка №"+this.dealData.id;
    //   },
    //   deep: true
    // },
    // async "$store.state.deals.deal.site.id"(newValue, oldValue) {
    //   console.log(oldValue);
    //   console.log(newValue);

    // }
    // "$store.state.deal.site.id"() {
    //   console.log("ssd");
    // }
  },
  created() {
    this.$Progress.start();
    //window.scrollTo(0, 0);
  },
  async mounted() {
    await this.loadData();

    this.updateHeightLeftColumn();

    this.showDeal = true;
    this.$Progress.finish();

    document.addEventListener("keydown", this.eventESC);

    // document.title = "Сделка №"+this.dealData.id;
  },
  components: {
    goodsList,
   
    mytextarea,
    calling,
    
    history,
    
  },

  beforeDestroy() {
    //console.log("beforeDestroy");
    document.removeEventListener("keydown", this.eventESC);
    this.$store.dispatch("deals/resetDealState");
    this.$store.dispatch("clients/resetClientState");
    this.$store.commit("contacts/reset");
    this.$store.commit("discounts/reset");
    this.$store.commit("recviz/reset");
    this.$store.commit("goodsInDeal/reset");
    this.$store.commit("task/reset");
    this.$store.commit("dellin/reset");
  }
};
</script>

<style>
.border-active {
  margin: 0px;
}
.border,
.border-active:active {
  border: 2px dashed orange;
  padding: 8px !important;
}
.stages .v-list-item {
  margin: 0;
  padding: 0;
}
.stages .v-list-item .v-list-item__content {
  margin: 0;
  padding: 0;
}

.client-wrap .v-data-table table,
.deal-wrap .v-data-table table {
  width: unset !important;
}
#left-column {
  position: relative;
}
#right-column {
  /* border-left: 4px solid #eaeaea; */
  background-color: #f5f5f5;
  box-shadow: inset 7px 0 9px -7px rgba(0, 0, 0, 0.7);
  -moz-box-shadow: inset 7px 0 9px -7px rgba(0, 0, 0, 0.7);
  -webkit-box-shadow: inset 7px 0 9px -7px rgba(0, 0, 0, 0.7);
}
.fly-clients {
  position: absolute;
  z-index: 5;
  width: 100%;
}
.fly-clients .v-card__text {
  padding: 0;
}
.fly-clients .v-treeview-node {
  padding: 0;
  margin: 0;
}
.fly-clients .v-icon {
  color: black !important;
}
.client-contact td {
  height: auto;
}
</style>