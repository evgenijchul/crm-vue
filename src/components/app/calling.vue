<template>
  <!-- окно подтверждения исходящего звонка клиенту -->
  <div style="display: inline;">
    <v-btn fab x-small outlined class="mx-1 my-0" @click="dialog=true" style="position:relative;">
      <v-icon>mdi-phone-forward-outline</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Позвонить?</v-card-title>

        <v-card-text>
          Сайт: {{site_sid}}
          <br />
          Номер: {{number}}
          <br />
          <u>
            Внутренний номер:
            <big>{{insade_phone}}</big>
          </u>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="dialog = false">Отмена</v-btn>

          <v-btn color="green darken-1" text @click="calling()">Позвонить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar">
      {{ status }}
      <v-btn color="pink" text @click="snackbar = false">Закрыть</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "calling",
  props: {
    number: {
      type: String,
      required: true
    },
    site_sid: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      snackbar: false,
      dialog: false
    };
  },
  computed: {
    insade_phone() {
      return this.$store.getters["managers/GET_MANAGER"].insade_phone;
    },
    status() {
      return this.$store.getters["calls/GET_STATUS"];
    }
  },
  methods: {
    async calling() {
      this.dialog = false;
      await this.$store.dispatch("calls/calling", {
        number: this.number,
        site_sid: this.site_sid
      });
      this.snackbar = true;
    }
  }
};
</script>

<style scoped>
.v-btn {
  white-space: unset;
}
</style>