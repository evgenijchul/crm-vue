<template>
  <div class="date-time">
    <v-menu
      ref="dateMenu"
      v-model="dateMenu"
      :close-on-content-click="false"
      class="my-0 py-0 mx-0 px-0"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          color="teal"
          v-model="dateFormatted"
          hide-details
          class="my-0 py-0 mx-0 px-0 ml-1"
          dense
          @blur="date = parseDate(dateFormatted)"
          v-on="on"
        ></v-text-field>
      </template>
      <v-container style="background-color:white">
        <v-row no-gutters>
          <v-col cols="auto">
            <v-list dense>
              <v-list-item-group v-model="dateQuick" color="teal">
                <v-list-item @click="transferMinute(15)">Через 15 мин</v-list-item>
                <v-list-item @click="transferMinute(60)">Через час</v-list-item>
                <v-list-item @click="transferDate(1)">Завтра</v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="transferDate(7)">Через неделю</v-list-item>
                <v-list-item @click="transferDate(30)">Через месяц</v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col cols="auto" style="border-left:1px solid #ccc">
            <v-row align-items="center">
              <!-- время для задачи -->
              <v-spacer></v-spacer>
              <v-col cols="auto" class="body-2 mt-2">Время:</v-col>
              <v-col cols="auto" style="position:relative;">
                <vue-timepicker
                  close-on-complete
                  hide-clear-button
                  v-model="taskTime"
                  :minute-interval="5"
                  hide-disabled-items
                  :hour-range="[[7, 18]]"
                  color="teal"
                ></vue-timepicker>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-date-picker
              first-day-of-week="1"
              color="teal"
              locale="ru-RU"
              v-model="date"
              @input="dateMenu = false"
              no-title
              scrollable
            ></v-date-picker>
          </v-col>
        </v-row>
      </v-container>
    </v-menu>
  </div>
</template>
<script>
import VueTimepicker from "vue2-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";

export default {
  name: "date_time",
  props: ["value"],
  data: vm => ({
    dateQuick: "",
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    dateMenu: false,
    clock: "",
    taskTime: "00:00"
  }),
  computed: {
    currentTime() {
      //2020-01-28 21:16:00
      var CurrentTime = new Date();

      let clock =
        (CurrentTime.getHours() < 10 ? "0" : "") +
        CurrentTime.getHours() +
        ":" +
        (CurrentTime.getMinutes() < 10 ? "0" : "") +
        CurrentTime.getMinutes() +
        ":00";
      return CurrentTime.toISOString().substr(0, 10) + " " + clock;
    }
  },
  watch: {
    taskTime(val) {
      if (val === "00:00") {
        this.clock = "";
      } else {
        this.clock = val;
      }
    },
    clock(val) {
      this.updateValue();
    },
    dateMenu(newValue, oldValue) {
      if (newValue === true && oldValue === false) {
        // при открытии окна
        this.taskTime = "00:00"; //обнуляем время
        this.clock = "";
      } else {
        this.dateFormatted = this.formatDate(this.date) + " " + this.clock;
      }
    },
    // taskTime(val) {
    //   if (val) {
    //     this.clock = val;
    //   }

    // },
    date(val) {
      this.dateFormatted = this.formatDate(this.date) + " " + this.clock;
      this.updateValue();
    }
  },
  methods: {
    updateValue() {
      let clock = "";
      if (this.clock.length === 0) {
        clock = "23:59:59";
      } else {
        clock = this.clock + ":59";
      }
      this.$emit("update:value", this.date + " " + clock);
    },
    transferMinute(value_minute) {
      // console.log("transferMinute");
      var CurrentTime = new Date();
      CurrentTime.setMinutes(CurrentTime.getMinutes() + value_minute);
      this.clock =
        (CurrentTime.getHours() < 10 ? "0" : "") +
        CurrentTime.getHours() +
        ":" +
        (CurrentTime.getMinutes() < 10 ? "0" : "") +
        CurrentTime.getMinutes();
      this.date = "";
      this.date = CurrentTime.toISOString().substr(0, 10);

      this.dateFormatted = this.formatDate(this.date) + " " + this.clock;
      this.dateMenu = false;
    },
    transferDate(value_day) {
      // console.log("transferDate");
      var CurrentTime = new Date();
      CurrentTime.setDate(CurrentTime.getDate() + value_day);

      if (this.taskTime === "00:00") this.clock = "";
      else this.clock = this.taskTime;
      //   console.log(new Date().toLocaleString("ru-RU", {timeZone: "Europe/Moscow"}).substr(12, 8));

      //   console.log(new Date().toLocaleString("ru-RU", {timeZone: "Europe/Moscow"}).substr(0, 10));
      this.date = CurrentTime.toISOString().substr(0, 10);

      if (value_day == 1) {
        this.dateMenu = false;
      }
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [day, month, year] = date.split(".");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  },
  components: {
    VueTimepicker
  }
};
</script>



<style>
.date-time {
  width: 133px;
}
.date-time .vue__time-picker .dropdown {
  position: absolute !important;
  top: unset !important;
  bottom: unset !important;
}
</style>
