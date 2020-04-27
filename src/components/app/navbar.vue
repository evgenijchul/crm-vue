<template>
  <div style="position:fixed;top:0px;left:0;">
    <v-card max-width="45">
      <v-list max-width="50" dense link light>
        <v-list-item v-if="manager.id" class="d-block manager-info" align="center" justify="center">
          <router-link to="/user">
            <v-list-item-avatar class="mx-0 px-0">
              <v-img :src="$store.state.url_api+manager.foto"></v-img>
            </v-list-item-avatar>

            <v-list-item-title
              style="white-space: unset;font-size:10px;line-height:10px"
              v-text="manager.fio"
            ></v-list-item-title>
          </router-link>
          <v-btn x-small @click="logout" class="mt-2 px-0" text>Выход</v-btn>
        </v-list-item>

        <v-divider></v-divider>
      </v-list>

      <v-list nav dense max-width="50">
        <v-list-item-group v-model="itemActive">
          <router-link
            v-for="(item, i) in items"
            :key="i"
            tag="div"
            :to="item.link"
            :exact="item.exact"
            v-slot="{ href, route, navigate, isActive }"
          >
            <v-list-item
              class="d-block py-1"
              align="center"
              justify="center"
              :ripple="false"
              @click="navigate"
            >
              <!-- :color="isActive?item.color:''" -->
              <v-list-item-icon>
                <v-icon v-if="item.link != '/task' || taskOverdue===0" v-text="item.icon"></v-icon>
                <!-- Задачи -->
                <v-badge v-else overlap right :color="'red'">
                  <template v-slot:badge>
                    <span>{{taskOverdue}}</span>
                  </template>
                  <v-icon v-text="item.icon" :color="'red'"></v-icon>
                </v-badge>
              </v-list-item-icon>
              <v-list-item-content>
                <!-- <v-list-item-title v-text="item.title"></v-list-item-title> -->
              </v-list-item-content>
            </v-list-item>
          </router-link>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        // {
        //   i: 0,
        //   title: "Главная",
        //   icon: "mdi-home-city",
        //   link: "/",
        //   exact: true
        // },
        {
          i: 0,
          title: "Задачи",
          icon: "mdi-check-circle-outline",
          link: "/task",
          color: "teal"
        },
        {
          i: 1,
          title: "Сделки",
          icon: "mdi-cash-multiple",
          link: "/deals",
          color: "green"
        },

        {
          i: 2,
          title: "Клиенты",
          icon: "mdi-account-supervisor-outline",
          link: "/clients",
          color: "yellow darken-4"
        },
        {
          i: 3,
          title: "Звонки",
          icon: "mdi-phone-incoming-outline",
          link: "/calls",
          color: "blue-grey"
        },
        {
          i: 4,
          title: "Телефонная книга",
          icon: "mdi-phone-log-outline",
          link: "/phonebook",
          color: "blue-grey"
        }
      ]
    };
  },
  computed: {
    manager() {
      return this.$store.getters["managers/GET_MANAGER"];
    },
    itemActive: {
      get: function(newValue) {
        // сделаем активным текущий пункт меню
        // поиск номера элемента массива items по параметру link
        var path = this.$route.path; //  /deals
        var arrActive = this.items.filter(function(item) {
          return item.link === path;
        });

        if (typeof arrActive[0] !== "undefined") {
          return arrActive[0].i;
        } else {
          return -1;
        }
      },
      set: function(newValue) {}
    },
    // countDailyTask() {
    //   return this.$store.getters["task/GET_TASK_MANAGER"].filter(
    //     t => t.end.substr(0, 10) === new Date().toISOString().substr(0, 10)
    //   ).length;
    // },
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
      ).length;
    }
  },
  methods: {
    async getTaskManager() {
      await this.$store.dispatch("task/getAllTaskManager");
    },
    logout: function() {
      this.$store.dispatch("managers/logout").then(() => {
        this.$router.push("/login");
      });
    }
  },
  async mounted() {
    this.interval = setInterval(() => {
      this.getTaskManager();
    }, 3000);

    // console.log(window.location.hostname );
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style lang="css" slot-scope>
.v-list-item {
  margin-bottom: 0px;
  margin-top: 0px;
  _padding: 0 !important;
}
.v-list-item.manager-info {
  padding: 0 0px;
  margin: 0 0 10px 0;
}
.v-list-item .v-list-item__content {
  margin-top: 0 !important;
  padding-top: 0 !important;
}
.v-list-item .v-list-item__icon {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
.v-list-item__icon,
.v-list-item__avatar {
  margin-right: 0 !important;
}

.v-list--nav {
  padding: 0 !important;
  margin: 0;
}
</style>