<template>
  <div class="elevation-0 mx-1" elevation="0" style="border:1px #252530 solid">
    <v-card class="px-3 py-2" elevation="0">
      <v-btn
        depressed
        x-small
        text
        :disabled="disableLoad"
        @click="getAnswerDellin()"
        color="amber darken-2"
      >
        Данные об отправке с Деловых линий
        <v-icon v-show="disableLoad" small class="mdi-spin">mdi-rotate-right</v-icon>
      </v-btn>

      <p v-if="orders===false">Данных нет</p>

      <v-card v-else v-for="(order, index) in orders" :key="index" elevation="2">
        <v-row no-gutters>
          <v-col cols="4" class="caption">Статус отправки:</v-col>
          <v-col cols="8" class="caption font-weight-bold">{{order.stateName}}</v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>

          <v-col cols="4" class="caption">Дата отправки:</v-col>
          <v-col cols="8" class="caption">{{formatDate(order.orderDates.arrivalToOspSender)}}</v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>

          <v-col cols="4" class="caption">Адрес терминала хранения:</v-col>
          <v-col cols="8" class="caption font-weight-bold">{{order.terminalAddress}}</v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>

          <v-col cols="4" class="caption">Получатель:</v-col>
          <v-col cols="8" class="caption" v-if="order.receiver">
            <b>{{order.receiver.name}}</b>
            , ИНН {{order.receiver.inn}}
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>

          <v-col v-if="order.payer" cols="4" class="caption">Плательщик:</v-col>
          <v-col v-if="order.payer" cols="8" class="caption">
            <v-chip outlined color="red" small label>{{order.payer}}</v-chip>
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>

          <v-col cols="4" class="caption">Общая сумма по накладной:</v-col>
          <v-col cols="8" class="caption" v-if="order.totalSum">
            {{order.totalSum}} руб. Оплачено:
            <span v-if="order.isPaid">Да.</span>
            <span v-else>Нет.</span>
          </v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>

          <v-col cols="4" class="caption">Дата прибытия груза на терминал-получатель:</v-col>
          <v-col
            cols="8"
            class="caption"
            v-if="order.orderDates"
          >{{formatDate(order.orderDates.arrivalToOspReceiver)}}</v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>

          <v-col
            v-if="order.orderDates.arrivalToReceiver"
            cols="4"
            class="caption"
          >Дата доставки груза до адреса:</v-col>
          <v-col
            v-if="order.orderDates.arrivalToReceiver"
            cols="8"
            class="caption"
          >{{formatDate(order.orderDates.arrivalToReceiver)}}</v-col>
          <v-col v-if="order.orderDates.arrivalToReceiver" cols="12">
            <v-divider></v-divider>
          </v-col>

          <v-col cols="2" class="caption">Груз:</v-col>
          <v-col
            cols="10"
            class="caption"
            v-if="order.freight"
          >{{order.freight.name}}. Масса: {{order.freight.weight}} кг. Объем: {{order.freight.volume}} м3. Мест: {{order.freight.places}}.</v-col>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="3" class="caption">Файлы:</v-col>
          <v-col cols="9" class="caption">
            <v-chip
              x-small
              v-for="(docum_uid, index) in order.documents_uid"
              :key="'uid'+index"
              @click="openFileURL(docum_uid)"
            >{{docum_uid}}.pdf</v-chip>
          </v-col>

          <v-col cols="12" class="caption mt-2">
            <v-btn
              block
              color="light-blue"
              dark
              depressed
              small
              @click="sendDellin(order.documents_uid, order.orderId, order.freight.weight, order.orderDates.arrivalToOspReceiver, order.orderDates.arrivalToReceiver)"
            >
              <v-icon>mdi-email-send-outline</v-icon>Отправить накладную
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "dellin",
  props: ["deal_id"],
  data() {
    return {
      loading: false,
      disableLoad: false
    };
  },
  methods: {
    formatDate(dateStr) {
      if(!dateStr) {
        return;
      }
      //2020-02-26 -> 26.02.2020
      //2020-02-26 00:00:00 -> 26.02.2020
      let arr = dateStr.split(" ");
      
      arr = arr[0].split("-");
      if (arr.length === 3) return arr[2] + "." + arr[1] + "." + arr[0];
      else return dateStr;
    },
    sendDellin(
      documents_uid,
      orderId,
      massa,
      arrivalToOspReceiver,
      arrivalToReceiver
    ) {
      this.$store.state.showMail = true;
      this.$store.state.mail.loading_send = true;
      let deal_id = this.$store.getters["deals/GET_DEAL_ID"];

      this.$store.state.mail.email_from = this.$store.getters[
        "deals/GET_DEAL"
      ].site.mail;

      this.$store.state.mail.items_to = this.$store.getters[
        "contacts/GET_CONTACTS"
      ].map(function(c) {
        return { email: c.email, text: c.name + " <" + c.email + ">" };
      });
      // console.log(this.$store.state.mail.items_to);
      this.$store.state.mail.select_to = [
        this.$store.getters["contacts/GET_CONTACTS"][0].email
      ];
      this.$store.getters["contacts/GET_CONTACTS"].forEach(c => {
        if (
          c.id ===
          this.$store.getters["deals/GET_DEAL"].current_delivery_contact_id
        ) {
          this.$store.state.mail.select_to = [c.email];
        }
      });

      this.$store.state.mail.loading_send = false;

      var file = [];
      documents_uid.forEach(uid => {
        file.push("/downloads/dellin/" + uid + ".pdf");
      });

      this.$store.state.mail.files = file;

      let signature = "";
      if (this.$store.state.mail.email_from == "info@5000wt.ru") {
        signature = this.$store.getters["managers/GET_MANAGER"]
          .mail_signature_5000wt;
      } else if (this.$store.state.mail.email_from == "info@stabmart.ru") {
        signature = this.$store.getters["managers/GET_MANAGER"]
          .mail_signature_stabmart;
      }

      // console.log(arrivalToReceiver);

      var dateDelivery =
        "<br>Дата прибытия груза на терминал-получатель: " +
        this.formatDate(arrivalToOspReceiver);

      if (arrivalToReceiver) {
        dateDelivery =
          dateDelivery +
          "<br>Дата доставки груза до адреса: " +
          this.formatDate(arrivalToReceiver);
      }

      this.$store.state.mail.myHTML =
        "Здравствуйте! <br><br> Ваш заказ был отправлен транспортной компанией «Деловые Линии». Во вложенном файле находится накладная об отправке. <br><br>Статус доставки груза: <a href='https://www.dellin.ru/tracker/orders/" +
        orderId +
        "'>https://www.dellin.ru/tracker/orders/" +
        orderId +
        "</a><br>Масса груза: " +
        massa +
        " кг. " +
        dateDelivery +
        "<br><br>" +
        signature;
      this.$store.state.mail.subject =
        "Ваш заказ был отправлен транспортной компанией «Деловые Линии»";
    },
    openFileURL(uid) {
      openFileURL("downloads/dellin/" + uid + ".pdf");
    },
    async getAnswerDellin() {
      this.$store.state.dellin.ordersToDeal = [];
      this.disableLoad = true;
      await this.$store.dispatch("dellin/getAnswerDellin", {
        deal_id: this.deal_id
      });
      this.disableLoad = false;
      this.$emit("updateHeightLeftColumn");
      //this.$store.state.history.heightLeftColumn =1000;
    }
  },
  watch: {},
  computed: {
    orders() {
      return this.$store.state.dellin.ordersToDeal;
    }
  },
  mounted() {}
};
</script>
<style>
</style>