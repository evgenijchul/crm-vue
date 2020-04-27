<template>
  <v-navigation-drawer
    right
    v-model="showClient"
    :disable-resize-watcher="true"
    fixed
    temporary
    style="z-index:99;"
    :width="windowWidthProc"
    v-resize="onResize"
  >
    <v-card v-if="clientData">
      <!-- <v-card-title class="pb-0" color="yellow darken-4">
        <h1 class>{{title}}</h1>
      </v-card-title>-->

      <v-toolbar flat dense color="yellow darken-4">
        <v-toolbar-title>{{title}}</v-toolbar-title>

        <template v-slot:extension>
          <v-tabs v-model="tab" color="white" light show-arrows background-color="yellow darken-4">
            <v-tab href="#tab-1" :ripple="false">Основные</v-tab>
            <v-tab v-if="clientId" href="#tab-2" @click="loadRecviz()" :ripple="false">Реквизиты</v-tab>
            <v-tab
              v-if="clientId"
              href="#tab-3"
              @click="loadDealsHistory()"
              :ripple="false"
            >История сделок</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items touchless v-model="tab">
        <v-tab-item :transition="false" :reverse-transition="false" :value="'tab-1'">
          <v-card flat>
            <v-card-text>
              <v-card class="elevation-0">
                <v-row no-gutters>
                  <v-col sm="7">
                    <v-card-title class="pb-0 pr-0">
                      <mytext
                        store="clients"
                        row="name"
                        :id="clientData.id || 0"
                        title="Название фирмы или ФИО полностью"
                        icon="mdi-account-box"
                        @updateText="changeFIO()"
                        :value.sync="clientData.name"
                      />
                    </v-card-title>
                  </v-col>
                  <v-col sm="5">
                    <v-card-text class="pr-0">
                      <mytextarea
                        store="clients"
                        row="comment"
                        rowcol="1"
                        :id="clientData.id || 0"
                        title="Комметарий к клиенту"
                        comment="true"
                        :value.sync="clientData.comment"
                      />
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
              <v-card class="elevation-1">
                <!-- <v-card-title class="pb-0">Скидки клиента</v-card-title> -->
                <v-card-text class="py-0">
                  <v-simple-table dense>
                    <thead>
                      <tr>
                        <th class="text-left"></th>
                        <th class="text-left" width="150px">Бренд</th>
                        <th class="text-left" width="70px">Скидка</th>
                        <th class="text-left">Коментарий</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="discount in discounts" :key="discount.id">
                        <td>
                          <v-menu>
                            <template v-slot:activator="{ on }">
                              <v-icon v-on="on" class="subtitle-1">mdi-dots-horizontal</v-icon>
                            </template>
                            <v-list dense>
                              <v-list-item class="my-0 py-0" @click="removeDiscount(discount.id)">
                                <v-list-item-title>Удалить скидку</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </td>
                        <td>{{discount.brand}}</td>
                        <td>{{discount.discount}}%</td>
                        <td>{{discount.comment}}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                          <v-text-field dense v-model="newDiscount.brand"></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            dense
                            v-model.number="newDiscount.discount"
                            suffix="%"
                            class="py-0 my-0"
                            style="width:50px;height:39px"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field dense v-model="newDiscount.comment"></v-text-field>
                        </td>
                        <td>
                          <v-btn
                            small
                            depressed
                            tile
                            color="primary"
                            @click="addDiscountSimple"
                            :loading="loadingDiscount"
                            :disabled="loadingDiscount"
                          >Добавить скидку</v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </v-card>
              <!--Контакты клиента-->
              <h2 class="mb-2 mt-5 font-weight-light" style="color:#F57F17">Контакты</h2>
              <div v-if="contacts.length">
                <v-card
                  class="elevation-4 mb-1"
                  v-for="(contact, index) in contacts"
                  :key="contact.id"
                >
                  <h3 class="pl-2 pt-2" style="color:#F57F17">
                    {{index+1}}
                    <v-menu>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" class="subtitle-1 pr-3 mb-1">mdi-dots-horizontal</v-icon>
                      </template>
                      <v-list dense>
                        <v-list-item class="my-0 py-0" @click="removeContact(contact.id)">
                          <v-list-item-title>Удалить контакт</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </h3>
                  <v-row no-gutters>
                    <v-col sm="7">
                      <v-card-title class="my-0 py-0">
                        <mytext
                          store="contacts"
                          row="name"
                          icon="mdi-account-badge"
                          :id="contact.id"
                          title="ФИО полностью"
                          :value.sync="contact.name"
                        />
                      </v-card-title>
                    </v-col>
                    <v-col sm="5">
                      <mytextarea
                        store="contacts"
                        row="comment"
                        :id="contact.id"
                        title="Комметарий к контакту"
                        rowcol="1"
                        comment="true"
                        :value.sync="contact.comment"
                      />
                    </v-col>
                  </v-row>
                  <v-card-text class="pt-0">
                    <v-row>
                      <v-col cols="7" class="pt-0">
                        <mytext
                          store="contacts"
                          row="tel"
                          icon="mdi-phone"
                          :id="contact.id"
                          title="Телефон"
                          :value.sync="contact.tel"
                          @updateTextFinish="eventUpdatePhone()"
                        />

                        <mytext
                          store="contacts"
                          row="email"
                          icon="mdi-mail-ru"
                          :id="contact.id"
                          title="Почта"
                          :value.sync="contact.email"
                        />
                      </v-col>
                      <v-col cols="5" class="pt-0">
                        <mytext
                          store="contacts"
                          row="icq"
                          icon="mdi-message-outline"
                          :id="contact.id"
                          title="ICQ"
                          :value.sync="contact.icq"
                        />
                        <mytext
                          store="contacts"
                          row="skype"
                          icon="mdi-skype-business"
                          :id="contact.id"
                          title="SKYPE"
                          :value.sync="contact.skype"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
              <!-- Новый контакт -->
              <!-- :disabled="contacts.length >0 ? false:true"-->
              <h2 class="mb-2 mt-5" style="color:#F57F17">
                <v-icon v-if="newContact.show" color="#F57F17" class="mb-1 mr-1">mdi-minus</v-icon>
                <v-icon v-else color="#F57F17" class="mb-1 mr-1">mdi-plus-thick</v-icon>
                <v-btn text @click="newContact.show=!newContact.show">Новый контакт</v-btn>
              </h2>
              <v-card class="elevation-4 mb-1" v-show="newContact.show">
                <v-row no-gutters>
                  <v-col sm="7">
                    <v-card-title>
                      <v-text-field
                        prepend-icon="mdi-account-badge"
                        dense
                        label="ФИО"
                        v-model="newContact.name"
                      ></v-text-field>
                    </v-card-title>
                  </v-col>
                  <v-col sm="5">
                    <v-card-text>
                      <v-textarea
                        hide-details
                        filled
                        auto-grow
                        rows="1"
                        label="Комментарий к контакту"
                        class="comment"
                        v-model="newContact.comment"
                      ></v-textarea>
                    </v-card-text>
                  </v-col>
                </v-row>

                <v-card-text dense>
                  <v-row>
                    <v-col cols="7">
                      <v-text-field
                        prepend-icon="mdi-phone"
                        dense
                        label="Телефон"
                        v-model="newContact.tel"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="mdi-mail-ru"
                        dense
                        label="Почта"
                        v-model="newContact.email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field
                        prepend-icon="mdi-message-outline"
                        dense
                        label="ICQ"
                        v-model="newContact.icq"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="mdi-skype-business"
                        dense
                        label="SKYPE"
                        v-model="newContact.skype"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-btn
                    color="yellow darken-4"
                    tile
                    @click.prevent="addContactSimple()"
                    :loading="loadingContact"
                    :disabled="loadingContact"
                  >Добавить контакт</v-btn>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item :transition="false" :reverse-transition="false" :value="'tab-2'">
          <recviz :clientId="clientId"></recviz>
        </v-tab-item>
        <v-tab-item :transition="false" :reverse-transition="false" :value="'tab-3'">
          <v-card flat v-if="dealsHistory">
            <v-card-title>История сделок клиента</v-card-title>
            <v-card-text>
              <v-card v-for="dh in dealsHistory" :key="dh.id">
                <v-card-title>
                  <v-chip label small @click="showDeal(dh.id)">Сделка №{{dh.id}}</v-chip>
                  <v-chip small label :color="dh.stage.color" class="ml-2">{{ dh.stage.name }}</v-chip>
                </v-card-title>
                <v-card-text style="white-space:pre-wrap;">{{dh.title}}</v-card-text>
                <v-card-text>{{dh.comment}}</v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-navigation-drawer>
</template>
<script>
import mixins from "@/mixins.js";
// import { required, minLength } from "vuelidate/lib/validators";
import mytextarea from "@/components/app/mytextarea";
import mytext from "@/components/app/mytext";
import recviz from "@/views/client/recviz";

export default {
  name: "client",
  mixins: [mixins],
  data() {
    return {
      windowWidth: 0,
      showClient: false,
      tab: null,
      tab1: null,
      newDiscount: {
        brand: "",
        discount: 0,
        comment: ""
      },
      loadingContact: false,
      loadingDiscount: false,
      newContact: {
        show: false,
        name: "",
        comment: "",
        tel: "",
        email: "",
        icq: "",
        skype: ""
      }
    };
  },

  computed: {
    windowWidthProc() {
      let w = this.windowWidth;
      if (w < 700) {
        return "95%";
      } else if (w < 850) {
        return "90%";
      } else if (w < 1000) {
        return "80%";
      } else {
        return "70%";
      }
    },
    clientData: {
      get() {
        // console.log(this.$store.getters["clients/GET_CLIENT"]);
        return this.$store.getters["clients/GET_CLIENT"];
      },
      set(value) {
        return value;
      }
    },

    discounts() {
      return this.$store.getters["discounts/GET_DISCOUNTS"];
    },
    contacts() {
      return this.$store.getters["contacts/GET_CONTACTS"];
    },
    dealsHistory() {
      return this.$store.getters["deals/GET_CLIENT_DEALS"];
    },

    clientId() {
      return this.$store.getters["clients/GET_CLIENT_ID"];
    },

    title: {
      get() {
        if (this.clientId) {
          return "Клиент №" + this.clientId;
        } else {
          return "Новый клиент";
        }
      },
      set(value) {
        return value;
      }
    }
  },
  methods: {
    async eventUpdatePhone() {
      await this.$store.dispatch("contacts/getContacts", this.clientId);
    },
    clickOutside() {
      this.$store.state.showClient = false;
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    follow(deal_id) {
      this.$router.push("/deal/" + deal_id);
    },
    async loadRecviz() {
      await this.$store.dispatch("recviz/getRecviz", this.clientId);
    },
    async loadDealsHistory() {
      await this.$store.dispatch("deals/getClientDeals", this.clientId);
    },
    changeFIO() {
      if (this.contacts.length === 0) {
        this.newContact.name = this.clientData.name;
      }
    },
    async removeDiscount(discountId) {
      await this.$store.dispatch("discounts/removeDiscount", {
        client_id: this.clientId,
        discountId: discountId
      });
    },
    async addDiscountSimple() {
      this.loadingDiscount = true;
      await this.$store.dispatch("discounts/addDiscountSimple", {
        client_id: this.clientId,
        newDiscount: Object.assign({}, this.newDiscount)
      });

      Object.keys(this.newDiscount).forEach(key => {
        this.newDiscount[key] = "";
      });

      this.loadingDiscount = false;
    },
    async addContactSimple() {
      this.loadingContact = true;
      await this.$store.dispatch("contacts/addContactSimple", {
        client_id: this.clientId,
        newContact: Object.assign({}, this.newContact)
      });

      await this.$store.dispatch("contacts/getContacts", this.clientId);

      Object.keys(this.newContact).forEach(key => {
        this.newContact[key] = "";
      });

      this.loadingContact = false;
    },

    async removeContact(contactId) {
      await this.$store.dispatch("contacts/removeContact", {
        client_id: this.clientId,
        contactId: contactId
      });

      await this.$store.dispatch("contacts/getContacts", this.clientId);
    }
  },

  async mounted() {
    this.onResize();

    await this.$store
      .dispatch("clients/getClient", this.clientId)
      .then(async () => {
        await this.$store.dispatch("contacts/getContacts", this.clientId);
        await this.$store.dispatch("discounts/getDiscounts", this.clientId);
        this.showClient = true;
      });
  },
  watch: {
    showClient(newValue) {
      this.$store.state.showClient = newValue;
    }
  },
  components: {
    mytextarea,
    mytext,
    recviz
  },

  created() {},
  beforeDestroy() {}
};
</script>