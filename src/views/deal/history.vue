<template>
  <v-container id="history" style="padding-bottom:0;padding-top:0;">
    <v-row
      no-gutters
      id="deal-history"
      :style="{'max-height': heightLeftColumn  + 'px'}"
      class="overflow-y-auto"
    >
      <v-col>
        <v-timeline dense>
          <v-timeline-item
            v-for="h in historyDeal"
            :key="h.id"
            :icon="h.typec==='tech'?h.type:'mdi-file-document-box-outline'"
            :color="h.typec==='tech'?'grey':'primary'"
            small
            fill-dot
            class="pr-2"
            light
          >
            <template v-if="h.manager && h.typec!=='tech'" v-slot:icon>
              <v-avatar>
                <img :src="$store.state.url_api+h.manager.foto" />
              </v-avatar>
            </template>
            <template v-else-if="h.manager && h.typec=='tech'" v-slot:icon>
              <v-avatar>
                <img :src="$store.state.url_api+h.manager.foto" />
              </v-avatar>
            </template>

            <v-card v-if="h.typec==='tech'" class="elevation-0">
              <v-card-title
                class="font-italic font-weight-light caption py-0 my-0 pb-0"
              >{{h.date_print}}</v-card-title>
              <v-card-text
                class="py-0 my-0 pb-1 font-italic font-weight-light caption"
                style="white-space:pre-wrap;line-height:14px"
                v-html="h.text"
              >Vue.compile(h.text)</v-card-text>
            </v-card>
            <v-card v-else class="elevation-2">
              <v-card-title class="caption pb-0">
                {{h.date_print}}
                <v-menu>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" class="subtitle-1 ml-2">mdi-dots-horizontal</v-icon>
                  </template>

                  <v-list dense class="my-0 py-0">
                    <v-list-item dense @click="removeHistory(h.id)">
                      <v-list-item-title>Удалить событие</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-title>
              <v-card-text>
                <p v-if="h.text_todo" class="pb-0 mb-0">
                  <s>{{h.text_todo}}</s>
                </p>
                <mytextarea
                  store="history"
                  row="text"
                  rowcol="0"
                  :id="h.id"
                  title
                  styleInput="history-input"
                  :value.sync="h.text"
                />
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
        <!-- Задачи для сделки -->
        <!-- <v-divider v-show="taskDeal" class="my-9" vertical></v-divider> -->

        <v-row v-for="(task,index) in taskDeal" :key="'task'+task.id" no-gutters class="mx-3">
          <v-col cols="12" :style="index===0?'padding-top:50px':''">
            <v-alert
              prominent
              outlined
              dense
              :color="currentTime > task.date?'red':'teal'"
              icon="mdi-checkbox-marked-circle-outline"
            >
              <h5 style="color:#6b6d72;font-weight:normal">
                {{task.date_print}}
                <template v-if="task.manager_autor.id!==task.manager.id">
                  <v-chip pill x-small>
                    <v-avatar left style="width:17px!important;margin-right:0;">
                      <v-img
                        max-height="17px"
                        max-width="17px"
                        :src="$store.state.url_api+task.manager_autor.foto"
                      ></v-img>
                    </v-avatar>
                    {{task.manager_autor.fio}}
                  </v-chip>
                  <v-icon small>mdi-arrow-right-bold-outline</v-icon>
                </template>

                <v-chip pill x-small>
                  <v-avatar left style="width:17px!important;margin-right:0;">
                    <v-img
                      max-height="17px"
                      max-width="17px"
                      :src="$store.state.url_api+task.manager.foto"
                    ></v-img>
                  </v-avatar>
                  {{task.manager.fio}}
                </v-chip>

                <v-menu>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" class="subtitle-1 ml-2">mdi-dots-horizontal</v-icon>
                  </template>

                  <v-list dense class="my-0 py-0">
                    <v-list-item dense @click="removeTask(task.id)">
                      <v-list-item-title>Удалить задачу</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </h5>

              <h4 style="color:black;font-size: 15px;">{{task.task}}</h4>
              <v-row no-gutters>
                <v-col>
                  <v-textarea
                    outlined
                    auto-grow
                    rows="1"
                    class="mt-0"
                    hide-details
                    label="Добавить результат"
                    color="teal"
                    v-model="task.result"
                  ></v-textarea>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="teal"
                    dark
                    small
                    depressed
                    class="ml-1"
                    @click="addResult(task.id, task.result)"
                  >Выполнить</v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </v-col>
        </v-row>

        <!-- <v-divider v-if="taskDeal" class="my-4" vertical></v-divider> -->

        <v-row
          no-gutters
          class="mx-3 mt-9"
          id="new-history"
          style="position:relative;padding-bottom:44px;"
        >
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="auto">
                <v-btn
                  @click="select='history'"
                  small
                  depressed
                  tile
                  :dark="select=='history'"
                  :outlined="select!='history'"
                  color="primary"
                  :ripple="false"
                >Событие:</v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  @click="select='task'"
                  small
                  depressed
                  tile
                  :dark="select=='task'"
                  :outlined="select!='task'"
                  color="teal"
                  :ripple="false"
                >
                  Задача на:
                  <dateTime v-if="select=='task'" :value.sync="date" />
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <managers v-if="select=='task'" :value.sync="managerTask" />
              </v-col>
            </v-row>

            <template v-if="select=='task'">
              <v-chip x-small @click="newTaskText='Связаться с клиентом. '">Связаться с клиентом</v-chip>
              <v-chip x-small @click="newTaskText='Позвонить клиенту. '">Позвонить клиенту</v-chip>
              <v-chip
                x-small
                @click="newTaskText='Написать клиенту на почту. '"
              >Написать клиенту на почту</v-chip>
            </template>
          </v-col>
          <v-col cols="12">
            <template v-if="select=='history'">
              <v-textarea
                @click="scrollHistoryFull()"
                filled
                outlined
                auto-grow
                class="pb-0 mb-0"
                light
                dense
                single-line
                v-model="newHistoryText"
                hide-details
                background-color="white"
              ></v-textarea>

              <v-btn
                tile
                depressed
                class="mt-1"
                :disabled="loadingHistory"
                :loading="loadingHistory"
                color="primary"
                @click="addNewHistory()"
              >
                <v-icon left>mdi-file-document-outline</v-icon>Добавить событие
              </v-btn>
            </template>
            <template v-else-if="select=='task'">
              <v-textarea
                @click="scrollHistoryFull()"
                class="pb-0 mb-0"
                style
                auto-grow
                light
                filled
                outlined
                dense
                single-line
                v-model="newTaskText"
                color="teal"
                hide-details
              ></v-textarea>
              <v-btn
                class="mt-1"
                dark
                depressed
                tile
                :disabled="loadingTask"
                :loading="loadingTask"
                color="teal"
                @click="addNewTask()"
              >
                <v-icon left>mdi-check-circle-outline</v-icon>Поставить задачу
              </v-btn>
            </template>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import mytextarea from "@/components/app/mytextarea";
import dateTime from "@/components/app/date_time";
import managers from "@/components/app/managers";

export default {
  name: "history",
  props: ["deal_id"],
  data: vm => ({
    select: "history",
    loadingHistory: false,
    loadingTask: false,
    newHistoryText: "",
    newTaskText: "",
    managerTask: {},
    date: new Date().toISOString().substr(0, 10) + " 23:59:59"
  }),
  methods: {
    openFileURL(file) {
      openFileURL(file);
    },
    async removeHistory(id) {
      await this.$store.dispatch("history/remove", {
        deal_id: this.deal_id,
        history_id: id
      });
      await this.$store.dispatch("history/getAllHistory", this.deal_id);
    },
    async removeTask(task_id) {
      await this.$store.dispatch("task/remove", task_id);
      await this.$store.dispatch("task/getTaskDeal", this.deal_id);

      this.$store.state.flagEdit = true;
    },

    scrollHistoryFull() {
      var historyWrap = this.$el.querySelector("#deal-history");
      historyWrap.scrollTop = historyWrap.scrollHeight - this.heightLeftColumn;
    },
    async addNewHistory() {
      this.loadingHistory = true;
      await this.$store.dispatch("history/addHistorySimple", {
        deal_id: this.deal_id,
        newHistory: { text: this.newHistoryText }
      });
      await this.$store.dispatch("history/getAllHistory", this.deal_id);
      this.loadingHistory = false;

      this.newHistoryText = "";
    },
    async addNewTask() {
      this.loadingTask = true;

      await this.$store.dispatch("task/addTask", {
        newTask: {
          manager_id: this.managerTask.id,
          deal_id: this.deal_id,
          task: this.newTaskText,
          date: this.date
        }
      });
      await this.$store.dispatch("task/getTaskDeal", this.deal_id);
      this.loadingTask = false;

      this.newTaskText = "";

      this.$store.state.flagEdit = true;
    },
    async addResult(task_id, result) {
      await this.$store.dispatch("task/saveRow", {
        id: task_id,
        row: "result",
        data: result
      });
      await this.$store.dispatch("task/addToHistory", {
        task_id: task_id
      });

      await this.$store.dispatch("history/getAllHistory", this.deal_id);
      await this.$store.dispatch("task/getTaskDeal", this.deal_id);
    },
    scroll() {
      var historyWrap = this.$el.querySelector("#deal-history");
      var historyWrapNew = this.$el.querySelector("#new-history");
      historyWrap.scrollTop =
        historyWrap.scrollHeight -
        historyWrapNew.scrollHeight / 1.5 -
        this.heightLeftColumn;
    }
  },
  computed: {
    manager() {
      return this.$store.getters["managers/GET_MANAGER"];
    },
    managerAll() {
      return this.$store.getters["managers/GET_MANAGER_ALL"];
    },
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
    },
    taskDeal() {
      return this.$store.getters["task/GET_TASK_DEAL"].map(t => {
        t.manager = this.managerAll.filter(m => m.id == t.manager_id)[0];
        t.manager_autor = this.managerAll.filter(
          m => m.id == t.manager_id_autor
        )[0];

        return t;
      });
    },
    historyDeal() {
      // return this.$store.getters["history/GET_HISTORY"];

      var managerAll = this.managerAll;
      return this.$store.getters["history/GET_HISTORY"].map(function(h) {
        h.manager = managerAll.filter(m => m.id === h.manager_id)[0];
        return h;
      });
    },
    heightLeftColumn() {
      return this.$store.state.history.heightLeftColumn;
    }
  },
  watch: {
    "$store.state.history": {
      handler() {
        this.scroll();
      },
      deep: true
    }
  },
  async mounted() {
    // await this.$store.dispatch("managers/getManager");
    // this.managerTask = this.$store.getters["managers/GET_MANAGER"];
    this.scroll();
  },
  beforeDestroy() {
    this.$store.commit("history/reset");
  },
  components: {
    mytextarea,
    dateTime,
    managers
  }
};
</script>

<style>
/* @import 'vue2-timepicker/dist/VueTimepicker.css'; */

#history
  .v-text-field.v-input--dense:not(.v-text-field--outlined):not(.v-text-field--single-line)
  input {
  padding: 0;
}

#history .v-timeline-item {
  padding-bottom: 7px;
}

#history .v-alert {
  margin-bottom: 5px;
}
#history
  .theme--light.v-text-field
  > .v-input__control
  > .v-input__slot:before {
  border: unset;
}

#history .v-text-field {
  padding-top: 0px;
  margin-top: 0;
}
</style>