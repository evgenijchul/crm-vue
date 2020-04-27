<template>
  <v-bottom-sheet v-model="showMail">
    <v-sheet height="100%">
      <v-row no-gutters>
        <v-col cols="auto">
          <v-btn
            class="my-2 ml-2"
            depressed
            dark
            color="light-blue"
            :loading="loading_send"
            @click="send()"
          >
            <v-icon>mdi-email-send</v-icon>Отправить
          </v-btn>
        </v-col>
      </v-row>

      <v-card style="position: relative;  z-index: 9;">
        <v-simple-table dense style="background-color:#f5f5f5">
          <tbody>
            <tr>
              <td class="text-right" width="120px">От:</td>
              <td>
                <v-text-field disabled dense hide-details :value="email_from"></v-text-field>
              </td>
            </tr>
            <tr>
              <td class="text-right">Кому:</td>
              <td>
                <v-select
                  v-model="select_to"
                  :items="items_to"
                  item-text="text"
                  item-value="email"
                  attach
                  chips
                  dense
                  multiple
                  hide-details
                ></v-select>
              </td>
            </tr>
            <tr>
              <td class="text-right">Тема:</td>
              <td>
                <v-text-field
                  dense
                  hide-details
                  v-model="subject"
                  class="pl-1"
                  style="background-color: white;"
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="background-color:white">
                <wysiwyg v-model="myHTML" />
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <!-- <v-textarea hide-details solo rows="15" class="pt-1" name="input-7-4" value="adsdasd gguy"></v-textarea> -->
      <v-chip
        class="ma-1"
        color="light-blue"
        text-color="white"
        small
        left
        v-for="(file , index) in files"
        :key="index"
      >
        <v-icon left>mdi-attachment</v-icon>
        <a @click.prevent="openFileURL(file)" style="color:white;">{{file.replace(/\/.*\//g,'')}}</a>
        <v-icon right small @click="removeFile(file)">mdi-delete-forever</v-icon>
      </v-chip>
      <small>(файлы на сервере, не редактируются)</small>
    </v-sheet>
  </v-bottom-sheet>
</template>
<script>
export default {
  name: "createMail",
  data() {
    return {};
  },

  computed: {
    showMail: {
      get() {
        return this.$store.state.showMail;
      },
      set(value) {
        this.$store.state.showMail = value;
        return value;
      }
    },
    deal_id() {
      return this.$store.getters["deals/GET_DEAL_ID"];
    },
    email_from() {
      return this.$store.state.mail.email_from;
    },
    items_to() {
      return this.$store.state.mail.items_to;
    },
    select_to: {
      get() {
        return this.$store.state.mail.select_to;
      },
      set(value) {
        this.$store.state.mail.select_to = value;
        return value;
      }
    },
    myHTML: {
      get() {
        return this.$store.state.mail.myHTML;
      },
      set(value) {
        this.$store.state.mail.myHTML = value;
        return value;
      }
    },
    subject: {
      get() {
        return this.$store.state.mail.subject;
      },
      set(value) {
        this.$store.state.mail.subject = value;
        return value;
      }
    },
    files() {
      return this.$store.state.mail.files;
    },
    loading_send() {
      return this.$store.state.mail.loading_send;
    }
  },
  methods: {
    openFileURL(file) {
      openFileURL(file);
    },
    removeFile(file) {
      this.$store.state.mail.files = this.$store.state.mail.files.filter(
        f => f != file
      );
    },
    async send() {
      if (!this.deal_id) {
        alert("Don't deal_id");
        return;
      }
      this.$store.state.mail.loading_send = true;
      await this.$store.dispatch("mail/send", {
        from: this.email_from,
        to: this.select_to,
        subject: this.subject,
        text: this.myHTML,
        files: this.files,
        deal_id: this.deal_id
      });
      this.showMail = !this.showMail;
      this.$store.state.mail.loading_send = false;

      await this.$store.dispatch("history/getAllHistory", this.deal_id);
    }
  },

  watch: {},
  async mounted() {},
  components: {}
};
</script>

<style scoped>
.v-data-table td {
  padding: 0 5px;
}
</style>