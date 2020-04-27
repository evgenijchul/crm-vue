<template>
  <div>
    <v-container id="calendar" fluid>
      <v-row no-gutters>
        <v-col>
          <v-card class="elevation-1">
            <v-card-title class="mb-0 pb-0">Добавить в календарь</v-card-title>

            <v-card-text>
              <v-row no-gutters>
                <v-col cols="12" class="mt-2">
                  <v-btn
                    color="teal"
                    dark
                    small
                    depressed
                    style="display: none;"
                    id="addToCalendarTop"
                    :data-deal-id="deal_id"
                  >верх</v-btn>
                </v-col>
                <v-col cols="12" class="mt-2">
                  <button
                    id="authorize-button"
                    class="btn btn-secondary"
                    style="display: none;"
                  >[Авторизуйтесь]. Логин: stabmart. Пароль: Shumaher5653048</button>
                  <v-btn
                    color="teal"
                    dark
                    small
                    depressed
                    style="display: none;"
                    id="addToCalendar"
                    :data-deal-id="deal_id"
                  >Середина</v-btn>
                </v-col>
                <v-col cols="12" class="mt-2">
                  <v-btn
                    color="teal"
                    dark
                    small
                    depressed
                    class="textToCalendar"
                    :data-deal-id="deal_id"
                  >Текст для календаря</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  name: "calendar",
  props: ["deal_id"],
  data() {
    return {
      showCheck: false,
      loading: false
    };
  },

  methods: {},
  watch: {},
  computed: {},
  mounted() {
    callCalendar();
  }
};
</script>
<style>
#calendar {
  padding: 0;
}
</style>