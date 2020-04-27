<template>
  <div>
    <v-card>
      <v-card-title>


        <v-row>
          <v-col v-if="manager.roles" cols="12">
            <v-card>
              <v-card-title>На диске: Свободно: {{disk_free_space.free_human}} из {{disk_free_space.total_human}} </v-card-title>
              <v-card-text>
                <v-progress-linear color="pink" :value="100*(disk_free_space.total-disk_free_space.free)/disk_free_space.total"></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-title>Предыдущий месяц: {{statManager.previos_month_format}} руб.</v-card-title>
              <v-card-text>
                <v-progress-linear :value="100*statManager.previos_month/3000000"></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-card-title>Текущий месяц: {{statManager.current_month_format}} руб.</v-card-title>
              <v-card-text>
                <v-progress-linear :value="100*statManager.current_month/3000000"></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-container>
          <v-row>
            <v-col>
              <mytext
                store="managers"
                row="fio"
                :id="manager.id"
                title="ФИО"
                :value.sync="manager.fio"
              />
            </v-col>
            <v-col>
              <mytext
                store="managers"
                row="vicarious"
                :id="manager.id"
                title="Приказ №... от ..."
                :value.sync="manager.vicarious"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <mytext
                store="managers"
                row="insade_phone"
                :id="manager.id"
                title="Внутренний номер телефона"
                :value.sync="manager.insade_phone"
              />
              <v-chip
                v-for="(phone, index) in insade_phones"
                :key="'phone'+index"
                :color="phone==manager.insade_phone?'red':''"
                @click="changeInsadePhone(phone)"
                class="mr-2"
              >{{phone}}</v-chip>
            </v-col>
          </v-row>
          <!-- signature -->
          <v-divider class="my-7"></v-divider>
          <v-btn text @click="showSignature=!showSignature">Подписи для почты</v-btn>
          <v-row v-if="showSignature">
            <v-col>
              <mytextarea
                store="managers"
                row="mail_signature_5000wt"
                :id="manager.id"
                title="Подпись для почты 1"
                :value.sync="manager.mail_signature_5000wt"
              />
            </v-col>
            <v-col>
              <mytextarea
                store="managers"
                row="mail_signature_stabmart"
                :id="manager.id"
                title="Подпись для почты 2"
                :value.sync="manager.mail_signature_stabmart"
              />
            </v-col>
          </v-row>
          <!-- пароль -->
          <v-divider class="my-7"></v-divider>
          <v-btn text @click="showPassword=!showPassword">Изменить пароль</v-btn>
          <v-row v-if="showPassword" no-gutters>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                :rules="[rules.password, rules.length(6)]"
                type="password"
                label="Пароль"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="repeatPassword"
                hide-details
                type="password"
                label="Пароль"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn depressed small color="primary" @click.prevent="updatePassword()">Обновить</v-btn>
            </v-col>
            <v-col>{{textPassword}}</v-col>
          </v-row>
        </v-container>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
import mytextarea from "@/components/app/mytextarea";
import mytext from "@/components/app/mytext";

export default {
  name: "user",
  data() {
    return {
      bufferValue: 100,
      test: 10,
      test2: 90,
      showSignature: false,
      showPassword: false,
      textPassword: "",
      password: "",
      repeatPassword: "",
      rules: {
        email: v => (v || "").match(/@/) || "Please enter a valid email",
        length: len => v =>
          (v || "").length >= len ||
          `Недопустимая длина символа, требуется ${len}`,
        password: v =>
          (v || "").match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/) ||
          "Пароль должен содержать заглавную букву, числовой символ",
        required: v => !!v || "This field is required"
      }
    };
  },
  methods: {
    async changeInsadePhone(phone) {
      await this.$store.dispatch("managers/saveRow", {
        id: null,
        row: "insade_phone",
        data: phone
      });
      await this.$store.dispatch("managers/getManager");
    },
    async updatePassword() {
      if (this.password.length == 0) {
        this.textPassword = "Password empty!";
        return;
      }

      if (this.password !== this.repeatPassword) {
        this.textPassword = "Password mismatch!";
        return;
      } else {
        this.textPassword = "";
      }

      await this.$store.dispatch("managers/saveRow", {
        id: null,
        row: "password",
        data: this.password
      });
      // this.password = "";
      // this.repeatPassword = "";
    }
  },
  watch: {},
  computed: {
    disk_free_space() {
      return this.$store.state.managers.disk_free_space;
    },
    statManager() {
      return this.$store.state.managers.stat;
    },
    insade_phones() {
      return this.$store.state.managers.managerAll
        .map(p => {
          return p["insade_phone"];
        })
        .filter(p => {
          return p;
        }).sort();
    },
    manager() {
      //console.log(this.$store.getters["managers/GET_MANAGER"]);
      return this.$store.getters["managers/GET_MANAGER"];
    }
  },
  created() {},
  async mounted() {
    await this.$store.dispatch("managers/getStat");
    await this.$store.dispatch("managers/disk_free_space");
  },
  beforeDestroy() {
    // this.$store.commit("user/reset");
  },
  components: {
    mytext,
    mytextarea
  }
};
</script>