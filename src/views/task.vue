<template>
  <div id="task">
    <v-card>
      <v-alert color="error" v-for="t in taskOverdue" :key="'overdue'+t.id">
        <v-menu>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" class="subtitle-1 ml-0">mdi-dots-horizontal</v-icon>
                    </template>

                    <v-list dense class="my-0 py-0">
                      <v-list-item dense @click="removeTask(t.id)">
                        <v-list-item-title>Удалить задачу</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
        {{t.end}}
        <br />
        <b>{{t.task}}</b>
        <br />
        <v-btn v-if="t.deal_id" outlined @click="goLink(t.deal_id)">Сделка №{{t.deal_id}}</v-btn>
      </v-alert>
      <v-card-text>
        <v-sheet height="64">
          <v-toolbar flat color="white">
            <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">Сегодня</v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn outlined color="grey darken-2" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>День</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Неделя</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Месяц</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 дня</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            locale="ru-RU"
            :short-weekdays="short"
            :first-interval="intervals.first"
            :interval-minutes="intervals.minutes"
            :interval-count="intervals.count"
            :interval-height="intervals.height"
            :interval-style="intervalStyle"
            ref="calendar"
            v-model="focus"
            color="teal"
            :events="events"
            :event-color="getEventColor"
            :weekdays="weekdays"
            :now="today"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card v-if="selectedEvent.deal_id" color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-toolbar-title>
                  {{selectedEvent.name}}
                  <v-menu>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" class="subtitle-1 ml-2">mdi-dots-horizontal</v-icon>
                    </template>

                    <v-list dense class="my-0 py-0">
                      <v-list-item dense @click="removeTask(selectedEvent.id)">
                        <v-list-item-title>Удалить задачу</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="goLink(selectedEvent.deal_id)"
                >Перейти к сделке</v-btn>
              </v-card-actions>
            </v-card>
            <v-card v-else color="grey lighten-4" min-width="350px" flat>
              <v-toolbar :color="selectedEvent.color" dark>
                <v-toolbar-title>
                
                  <v-menu>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" class="subtitle-1 ml-2">mdi-dots-horizontal</v-icon>
                    </template>
                    <v-list dense class="my-0 py-0">
                      <v-list-item dense @click="removeTask(selectedEvent.id)">
                        <v-list-item-title>Удалить задачу</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <p style="white-space: pre-wrap;">{{selectedEvent.name}}</p>

              </v-card-text>
              
            </v-card>
          </v-menu>
        </v-sheet>
      </v-card-text>
    </v-card>

    <v-btn bottom color="teal" dark fab fixed left @click="dialog = !dialog">
      <v-icon>mdi-check-circle-outline</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" width="500px">
      <v-card>
        <v-card-title class="teal white--text">Поставить задачу</v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col cols="auto">Задача на:</v-col>
            <v-col cols="auto">
              <dateTime :value.sync="date" />
            </v-col>
            <v-col cols="auto">
              <managers :value.sync="managerTask" />
            </v-col>
            <v-col cols="12">
              <v-textarea solo auto-grow v-model="newTaskText" hide-details></v-textarea>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn text color="red" @click="dialog = false">Отменить</v-btn>
          <v-spacer />

          <v-btn dark depressed :loading="loadingTask" color="teal" @click="addNewTask()"><v-icon>mdi-checkbox-marked-circle-outline</v-icon>Поставить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import dateTime from "@/components/app/date_time";
import managers from "@/components/app/managers";

const stylings = {
  default(interval) {
    return undefined;
  },
  workday(interval) {
    const inactive =
      interval.weekday === 0 ||
      interval.weekday === 6 ||
      interval.hour < 9 ||
      interval.hour >= 17;
    const startOfHour = interval.minute === 0;
    const dark = this.dark;
    const mid = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

    return {
      backgroundColor: inactive
        ? dark
          ? "rgba(0,0,0,0.4)"
          : "rgba(0,0,0,0.05)"
        : undefined,
      borderTop: startOfHour ? undefined : "1px dashed " + mid
    };
  },
  past(interval) {
    return {
      backgroundColor: interval.past
        ? this.dark
          ? "rgba(0,0,0,0.4)"
          : "rgba(0,0,0,0.05)"
        : undefined
    };
  }
};
export default {
  name: "task",
  data() {
    return {
      dialog: false,
      loadingData: false,
      focus: "",
      short: false,
      intervals: { first: 8, minutes: 60, count: 11, height: 40 },
      type: "week",
      weekdays: [1, 2, 3, 4, 5, 6, 0],
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days"
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      today: null,
      loadingTask: false,
      newTaskText: "",
      managerTask: {},
      date: new Date().toISOString().substr(0, 10) + " 23:59:59"
    };
  },
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    },
    intervalStyle() {
      return stylings["past"].bind(this);
    },
    events() {
      return this.$store.getters["task/GET_TASK_MANAGER"];
    },
    taskOverdue() {
      var CurrentTime = new Date();

      var clock =
        (CurrentTime.getHours() < 10 ? "0" : "") +
        CurrentTime.getHours() +
        ":" +
        (CurrentTime.getMinutes() < 10 ? "0" : "") +
        CurrentTime.getMinutes() +
        ":00";

      return this.$store.getters["task/GET_TASK_MANAGER"].filter(
        t => t.date < CurrentTime.toISOString().substr(0, 10) + " " + clock
      );
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
    async removeTask(task_id) {
      // console.log(task_id);
      await this.$store.dispatch("task/remove", task_id);
      await this.$store.dispatch("task/getTaskDeal", this.deal_id);
      this.selectedOpen = false;
    },
    async addNewTask() {
      this.loadingTask = true;

      await this.$store.dispatch("task/addTask", {
        newTask: {
          manager_id: this.managerTask.id,
          deal_id: null,
          task: this.newTaskText,
          date: this.date
        }
      });
      await this.$store.dispatch("task/getTaskDeal", this.deal_id);
      this.loadingTask = false;
      this.dialog = false;
      this.newTaskText = "";
    },
    goLink(deal_id) {
      // this.$router.push({
      //   name: "deal",
      //   params: { deal_id: deal_id }
      // });
      this.$store.dispatch("deals/show", deal_id);
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },

    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    },
    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() +
            1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
    },

    async reloadData() {
      this.search = "";
      this.loadingData = true;
      await this.loadData();
      this.loadingData = false;
    },
    async loadData() {
      this.loadingData = true;
      await this.$store.dispatch("task/getAllTaskManager");

      this.loadingData = false;
    }
  },
  created() {
    this.$Progress.start();
    //window.scrollTo(0, 0);
  },
  async mounted() {
    //  this.$refs.calendar.scrollToTime("08:00");
    await this.loadData();

    //  this.$refs.calendar.checkChange();

    this.$Progress.finish();
  },
  components: {
    dateTime,
    managers
  }
};
</script>

<style>
.theme--light.v-data-table .v-row-group__header,
.theme--light.v-data-table .v-row-group__summary {
  background: grey !important;
}
#task .day_round {
  /* height: 40px;
  min-width: 40px; */
}
.v-card__text span {
  white-space: pre-wrap;
}
</style>