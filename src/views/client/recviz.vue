<template>
  <div>
    <v-card flat>
      <v-card-title>Реквизиты</v-card-title>
      <v-card-text>
        <v-card v-for="(r, index) in recviz" :key="r.id" class="elevation-4 mb-3">
          <h3 class="pl-2 pt-2" style="color:#CDDC39">
            {{index+1}}
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" class="subtitle-1 pr-3 mb-1">mdi-dots-horizontal</v-icon>
              </template>
              <v-list dense>
                <v-list-item class="my-0 py-0" @click="removeRecviz(r.id)">
                  <v-list-item-title>Удалить фирму</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <span v-if="$store.getters['deals/GET_DEAL_ID']">
              <v-chip v-if="deal_current_recvi_id === r.id" color="lime">Используется в сделке</v-chip>
              <v-btn v-else color small @click="setRecviToDeal(r.id)">
                <v-icon>mdi-arrow-left-bold</v-icon>Использовать для сделки
              </v-btn>
            </span>
          </h3>
          <v-tabs color="lime" vertical>
            <v-tab>Общие</v-tab>
            <v-tab>Банковские счета</v-tab>

            <v-tab-item>
              <v-card-title>
                <mytext store="recviz" row="name" :id="r.id" title="Название" :value.sync="r.name" />
              </v-card-title>
              <v-card-text dense>
                <mytext
                  store="recviz"
                  row="full_name"
                  :id="r.id"
                  title="Полное название"
                  :value.sync="r.full_name"
                />
                <mytextarea
                  store="recviz"
                  row="comment"
                  rowcol="1"
                  :id="r.id"
                  title="Комметарий"
                  comment="true"
                  :value.sync="r.comment"
                />
                <mytext store="recviz" row="inn" :id="r.id" title="ИНН" :value.sync="r.inn" />
                <mytext store="recviz" row="kpp" :id="r.id" title="КПП" :value.sync="r.kpp" />

                <mytext
                  store="recviz"
                  row="ur_adres"
                  :id="r.id"
                  title="Юридический адрес"
                  :value.sync="r.ur_adres"
                />
                <mytext
                  store="recviz"
                  row="fakt_adres"
                  :id="r.id"
                  title="Фактический адрес"
                  :value.sync="r.fakt_adres"
                />
                <mytext store="recviz" row="okpo" :id="r.id" title="ОКПО" :value.sync="r.okpo" />
                <mytext store="recviz" row="ogrn" :id="r.id" title="ОГРН" :value.sync="r.ogrn" />
                <mytext
                  store="recviz"
                  row="dir_dolzhnost"
                  :id="r.id"
                  title="Должность руководителя"
                  :value.sync="r.dir_dolzhnost"
                />
                <mytext
                  store="recviz"
                  row="dir_fio"
                  :id="r.id"
                  title="Руководитель ФИО"
                  :value.sync="r.dir_fio"
                />
              </v-card-text>
            </v-tab-item>

            <!-- Банковские счета -->
            <v-tab-item>
              <v-card-text dense>
                <v-card class="elevation-4 mb-3" v-for="(b, index_b) in r.banks" :key="b.id">
                  <h3 class="pl-2 pt-2" style="color:#CDDC39">
                    {{index+1}}.{{index_b+1}}
                    <v-menu>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on" class="subtitle-1 pr-3 mb-1">mdi-dots-horizontal</v-icon>
                      </template>
                      <v-list dense>
                        <v-list-item class="my-0 py-0" @click="removeBank(index, b.id)">
                          <v-list-item-title>Удалить банковский счет</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>

                    <v-chip dark v-if="b.main === 'Y'">Основной счет</v-chip>
                    <v-btn v-else small @click="setMainBank(index,index_b,b.id)">Установить основным</v-btn>
                  </h3>
                  <v-card-text>
                    <mytext
                      store="banks"
                      row="nomer_scheta"
                      :id="b.id"
                      title="Номер счета"
                      :value.sync="b.nomer_scheta"
                    />
                    <mytext store="banks" row="bik" :id="b.id" title="БИК" :value.sync="b.bik" />
                    <mytext store="banks" row="bank" :id="b.id" title="Банк" :value.sync="b.bank" />
                    <mytext
                      store="banks"
                      row="korr_schet"
                      :id="b.id"
                      title="Корр. счет"
                      :value.sync="b.korr_schet"
                    />
                  </v-card-text>
                </v-card>

                <v-card class="elevation-4 mb-3" v-if="r.newBank">
                  <v-card-title>Новый банковский счет</v-card-title>
                  <v-card-text>
                    <v-text-field
                      dense
                      label="Номер счета"
                      v-model="r.newBank.nomer_scheta"
                      autocomplete="off"
                    ></v-text-field>

                    <v-text-field dense label="БИК" v-model="r.newBank.bik" autocomplete="off"></v-text-field>
                    <v-text-field dense label="Банк" v-model="r.newBank.bank" autocomplete="off"></v-text-field>
                    <v-text-field
                      dense
                      label="Корр. счет"
                      v-model="r.newBank.korr_schet"
                      autocomplete="off"
                    ></v-text-field>
                    <v-btn
                      text
                      small
                      color="lime"
                      @click="addBankSimple(index, r.newBank)"
                    >Добавить банковский счет</v-btn>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-tab-item>
          </v-tabs>
        </v-card>

        <!-- Новые реквизиты -->
        <h2 class="mb-2 mt-5" style="color:#CDDC39">
          <v-icon v-if="newRecvi.show" color="#CDDC39" class="mb-1 mr-1">mdi-minus</v-icon>
          <v-icon v-else color="#CDDC39" class="mb-1 mr-1">mdi-plus-thick</v-icon>
          <v-btn text @click="newRecvi.show=!newRecvi.show">Новые реквизиты</v-btn>
        </h2>
        <v-card class="elevation-4 mb-3" v-show="newRecvi.show">
          <v-tabs color="lime" vertical>
            <v-tab>Общие</v-tab>

            <v-tab-item>
              <v-card-title>
                <v-text-field dense label="Название" v-model="newRecvi.name"></v-text-field>
              </v-card-title>
              <v-card-text dense>
                <v-text-field dense label="Полное название" v-model="newRecvi.full_name"></v-text-field>
                <v-textarea
                  filled
                  auto-grow
                  rows="1"
                  label="Комментарий"
                  v-model="newRecvi.comment"
                ></v-textarea>
                <v-text-field dense label="ИНН" v-model="newRecvi.inn"></v-text-field>
                <v-text-field dense label="КПП" v-model="newRecvi.kpp"></v-text-field>

                <v-text-field dense label="Юридический адрес" v-model="newRecvi.ur_adres"></v-text-field>
                <v-text-field dense label="Фактический адрес" v-model="newRecvi.fakt_adres"></v-text-field>
                <v-text-field dense label="ОКПО" v-model="newRecvi.okpo"></v-text-field>
                <v-text-field dense label="ОГРН" v-model="newRecvi.ogrn"></v-text-field>
                <v-text-field dense label="Должность руководителя" v-model="newRecvi.dir_dolzhnost"></v-text-field>
                <v-chip
                  x-small
                  style="margin-top:-20px;"
                  @click="newRecvi.dir_dolzhnost='Генеральный директор'"
                >Генеральный директор</v-chip>
                <v-text-field dense label="Руководитель ФИО" v-model="newRecvi.dir_fio"></v-text-field>

                <v-btn
                  @click="addRecviSimple()"
                  color="lime"
                  tile
                  :loading="loadingRecvi"
                  :disabled="loadingRecvi"
                >Добавить реквизиты</v-btn>
              </v-card-text>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import mytextarea from "@/components/app/mytextarea";
import mytext from "@/components/app/mytext";

export default {
  name: "recviz",
  props: ["clientId"],
  data() {
    return {
      loadingRecvi: false,
      newRecvi: {
        show: false,
        name: "",
        full_name: "",
        comment: "",
        inn: "",
        kpp: "",
        okpo: "",
        ur_adres: "",
        fakt_adres: "",
        ogrn: "",
        dir_fio: "",
        dir_dolzhnost: ""
      },
      banksMain: []
    };
  },

  methods: {
    async setRecviToDeal(recvi_id) {
      await this.$store.dispatch("deals/saveRow", {
        id: this.$store.getters["deals/GET_DEAL_ID"],
        row: "current_recvi_id",
        data: recvi_id
      });
      this.deal_current_recvi_id = recvi_id;
    },
    async setMainBank(index, index_b, bank_id) {
      await this.$store.dispatch("banks/saveRow", {
        id: bank_id,
        row: "main",
        data: "Y"
      });

      this.recviz[index].banks.forEach((value, i) => {
        this.recviz[index].banks[i].main = "";
      });

      this.recviz[index].banks[index_b].main = "Y";

      //console.log(this.recviz);
    },
    async addRecviSimple() {
      this.loadingRecvi = true;

      await this.$store.dispatch("recviz/addRecviSimple", {
        client_id: this.clientId,
        newRecvi: Object.assign({}, this.newRecvi)
      });

      if (this.recviz.length == 1) {
        // реквизит новый и единственный
        let last_recvi_id = this.recviz[this.recviz.length - 1].id;
        await this.setRecviToDeal(last_recvi_id);
      }

      Object.keys(this.newRecvi).forEach(key => {
        this.newRecvi[key] = "";
      });

      // _.each(this.newRecvi, (value, index) => {
      //   this.newRecvi[index] = "";
      // });

      this.loadingRecvi = false;
    },
    async addBankSimple(recvi_index, newBank) {
      if (this.recviz[recvi_index].banks.length === 0) {
        newBank.main = "Y";
      } else {
        newBank.main = "N";
      }

      await this.$store.dispatch("recviz/addBankSimple", {
        client_id: this.clientId,
        recvi_id: this.recviz[recvi_index].id,
        index_recvi: recvi_index,
        newBank: Object.assign({}, newBank)
      });

      Object.keys(this.recviz[recvi_index]).forEach(key => {
        this.recviz[recvi_index].newBank = [];
      });

      // _.each(this.recviz[recvi_index], () => {
      //   this.recviz[recvi_index].newBank = [];
      // });
    },
    async removeRecviz(recvi_id) {
      await this.$store.dispatch("recviz/removeRecvi", {
        client_id: this.clientId,
        recvi_id: recvi_id
      });
    },
    async removeBank(recvi_index, bank_id) {
      await this.$store.dispatch("recviz/removeBank", {
        client_id: this.clientId,
        recvi_id: this.recviz[recvi_index].id,
        index_recvi: recvi_index,
        bank_id: bank_id
      });
    },
    sortBank(recvi_index, bank_id) {
      this.$store.dispatch("clients/sortBank", { recvi_index, bank_id });
    }
  },
  watch: {},
  computed: {
    recviz: {
      get() {
        return this.$store.getters["recviz/GET_RECVIZ"];
      },
      set(value) {
        return value;
      }
    },
    deal_current_recvi_id: {
      get() {
        return this.$store.getters["deals/GET_DEAL"].current_recvi_id;
      },
      set(value) {
        this.$store.state.deals.deal.current_recvi_id = value;
      }
    }
  },
  components: {
    mytextarea,
    mytext
  }
};
</script>
<style>
</style>