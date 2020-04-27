<template>
  <div class="phone-book">
    <v-card>
      <v-card-title>
        <v-row no-gutters>
          <v-col>
            Телефонная книга
            <v-btn
              :loading="loadingData"
              class="ml-2 amber lighten-2"
              fab
              x-small
              depressed
              @click.native="loadData()"
            >
              <v-icon>refresh</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="px-0">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th></th>
                <th></th>

                <th class="text-left" width="300px">Комментарий</th>
                <th class="text-left">Контакты</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, index) in phoneBook" :key="p.id">
                <td>№{{index+1}}</td>
                <td valign="top" style="padding-top:15px">
                  <v-menu>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" class="subtitle-1 ml-2">mdi-dots-horizontal</v-icon>
                    </template>

                    <v-list dense class="my-0 py-0">
                      <v-list-item dense @click="removePhoneBook(p.id)">
                        <v-list-item-title>Удалить запись</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td>

                <td valign="top">
                  <span class="name-phonebook">
                    <mytext store="phoneBook" row="name" :id="p.id" title :value.sync="p.name" />
                  </span>
                  <span class="comment-phonebook">
                  <mytextarea
                    store="phoneBook"
                    row="comment"
                    rowcol="1"
                    :id="p.id"
                    comment="true"
                    :value.sync="p.comment"
                  /></span>
                </td>
                <td class="phone-books-contacts" valign="top" style="padding-top:30px">
                  <v-row no-gutters>
                    <v-col v-for="c in p.contacts" :key="'cont_ph'+c.id" cols="12" class="py-1">
                      <v-card class="py-0 my-0" elevation="1">
                        <v-row>
                          <v-col cols="auto">
                            <v-menu>
                              <template v-slot:activator="{ on }">
                                <v-icon v-on="on" class="subtitle-1 ml-2">mdi-dots-horizontal</v-icon>
                              </template>

                              <v-list dense class="my-0 py-0">
                                <v-list-item dense @click="removePhoneBookContact(c.id)">
                                  <v-list-item-title>Удалить контакт</v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </v-col>
                          <v-col class="font-weight-bold py-1">
                            <mytext
                              store="phoneBookContacts"
                              row="fio"
                              :id="c.id"
                              title="ФИО"
                              :value.sync="c.fio"
                            />

                            <v-row no-gutters class="font-weight-regular">
                              <v-col class="my-0 py-0">
                                <mytext
                                  store="phoneBookContacts"
                                  row="tel"
                                  :id="c.id"
                                  title="Телефон"
                                  :value.sync="c.tel"
                                />
                              </v-col>
                              <v-col cols="auto" class="my-0 py-0">
                                <calling
                                  v-for="tel_format in c.tel_format"
                                  :key="'contact_pb_tel'+tel_format"
                                  :number="tel_format"
                                  site_sid="stabmart"
                                />
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col class="my-0 py-0" cols="4">
                            <mytextarea
                              store="phoneBookContacts"
                              row="comment"
                              rowcol="0"
                              :id="c.id"
                              title="Комментарий"
                              :value.sync="c.comment"
                            />
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-btn depressed x-small @click="addContact(p.id)">
                    <v-icon small>mdi-plus</v-icon>

                  </v-btn>
                </td>
              </tr>
              <tr>
                <td></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" width="470px">
      <v-card>
        <v-card-title class="amber lighten-2">Новая запись</v-card-title>
        <v-container>
          <v-row>
            <v-col cols="4">Название контакта (Тенси, Фиамм и т.д.):</v-col>
            <v-col cols="8">
              <v-text-field solo auto-grow v-model="newBookName"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">Комментарий:</v-col>
            <v-col cols="8">
              <v-textarea solo auto-grow v-model="newBookComment"></v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn text color="red" @click="dialog = false">Отменить</v-btn>
          <v-spacer />

          <v-btn
            depressed
            :loading="loading"
            color="amber lighten-2"
            @click="addNewRecord()"
          >Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogContact" width="400px">
      <v-card>
        <v-card-title>Новый контакт</v-card-title>
        <v-container>
          <v-row>
            <v-col cols="4">ФИО:</v-col>
            <v-col cols="8">
              <v-text-field solo auto-grow v-model="newBookContactFIO"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">Телефон:</v-col>
            <v-col cols="8">
              <v-text-field solo auto-grow v-model="newBookContactTel"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">Комментарий:</v-col>
            <v-col cols="8">
              <v-textarea solo auto-grow v-model="newBookContactComment"></v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn text color="red" @click="dialogContact = false">Отменить</v-btn>
          <v-spacer />

          <v-btn
            depressed
            :loading="loading"
            color="amber lighten-2"
            @click="addNewContact()"
          >Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn bottom color="amber lighten-2" fab fixed left @click="dialog=true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import calling from "@/components/app/calling";
import mytextarea from "@/components/app/mytextarea";
import mytext from "@/components/app/mytext";

export default {
  name: "phoneBook",
  data() {
    return {
      dialog: false,
      dialogContact: false,
      loadingData: false,
      loading: false,
      newBookName: "",
      newBookComment: "",
      newBookContactComment: "",
      newBookContactTel: "",
      newBookContactFIO: "",
      current_phone_book_id: null
    };
  },
  methods: {
    async removePhoneBook(id) {
      await this.$store.dispatch("phoneBook/removePhoneBook", {
        id: id
      });
      this.loadData();
    },
    async removePhoneBookContact(id) {
      await this.$store.dispatch("phoneBookContacts/removePhoneBookContact", {
        contact_id: id
      });
      this.loadData();
    },
    addContact(phone_book_id) {
      this.dialogContact = true;
      this.current_phone_book_id = phone_book_id;
    },
    async addNewContact() {
      await this.$store.dispatch("phoneBookContacts/createContact", {
        phone_book_id: this.current_phone_book_id,
        fio: this.newBookContactFIO,
        tel: this.newBookContactTel,
        comment: this.newBookContactComment
      });
      this.newBookContactFIO = "";
      this.newBookContactTel = "";
      this.newBookContactComment = "";
      this.dialogContact = false;
      this.loadData();
    },
    async addNewRecord() {
      await this.$store.dispatch("phoneBook/createSimple", {
        name: this.newBookName,
        comment: this.newBookComment
      });
      this.newBookName = "";
      this.newBookComment = "";
      this.dialog = false;
      this.loadData();
    },
    async loadData() {
      await this.$store.dispatch("phoneBook/getPhoneBook");
    }
  },
  watch: {
    // "$store.state.phoneBook.phone_book": {
    //   handler: function(newValue) {
    //     this.loadData();
    //   },
    //   deep: true
    // }
  },
  computed: {
    phoneBook() {
      return this.$store.getters["phoneBook/GET_PHONE_BOOK"];
    }
  },
  created() {
    this.$Progress.start();
  },
  async mounted() {
    this.loadData();
    this.$Progress.finish();
  },
  beforeDestroy() {},
  components: {
    calling,
    mytext,
    mytextarea
  }
};
</script>

<style>
.phone-book .comment-phonebook textarea {
  font-size: 12px !important;
}
.phone-book .name-phonebook input {
  font-size: 18px !important;
  font-weight: bold!important;
}
.phone-book input {
  padding: 0 !important;
}
.phone-book textarea {
  _height: 27px !important;
  min-height: 27px !important;
}
.phone-book .v-text-field__slot,
.phone-book textarea,
.phone-book .v-label {
  font-size: 14px !important;
}
.phone-books-contacts .v-input {
  padding: 5px 0 0 0 !important;
}
</style>