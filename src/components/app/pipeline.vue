<template>
  <div>
    <table width="100%">
      <tr>
        <td colspan="10" align="right">
          <v-btn
            small
            text
            color="grey"
            @click="showFinishStage =!showFinishStage"
          >Показать/скрыть завершенные</v-btn>
        </td>
      </tr>
      <tr>
        <td
          colspan="3"
          style="border:1px black solid; border-bottom:none;"
          align="center"
          class="overline"
        >Начальные</td>
        <td
          colspan="3"
          style="border:1px black solid; border-bottom:none;"
          align="center"
          class="overline"
        >В работе</td>
        <td
          v-if="showFinishStage"
          colspan="2"
          style="border:1px black solid; border-bottom:none;"
          align="center"
          class="overline"
        >Завершенные</td>
      </tr>

      <tr>
        <td
          v-for="stage in stagesActual"
          :key="stage.id"
          style="border-bottom:4px black solid;"
          :style="{'border-color':stage.color}"
          align="center"
          :width="100/stagesActual.length+'%'"
          class="caption"
        >
          {{stage.name}} ({{dealsSlice[stage.name].length}})
          <!-- Для последний двух стадий выведем процент от общего кол-ва Завершенных сделок -->
          <span
            v-if="(stage.id ==7 || stage.id ==8)"
            class="body-2 font-weight-bold"
          >{{Math.round( 100*dealsSlice[stage.name].length / (dealsSlice['Выполнено'].length + dealsSlice['Не выполнено'].length) )}}%</span>
        </td>
      </tr>
      <tr>
        <td v-for="stage in stagesActual" :key="stage.id" valign="top">
          <v-row
            class="list-group-item elevation-1 my-2 px-1 py-1"
            v-for="deal in dealsSlice[stage.name]"
            :key="deal.id"
            no-gutters
          >
            <v-col class="overline mt-0 pt-0 font-weight-bold mb-1" cols="auto">
              <v-icon
                v-if="!deal.flagTask && (deal.stage.id === '1' || deal.stage.id === '2' || deal.stage.id === '3')"
                small
                color="red"
                class="mr-1"
                title="Нет задач"
              >mdi-information</v-icon>
              <v-chip label x-small @click.prevent="showDeal(deal.id)">№{{ deal.id }}</v-chip>
            </v-col>
            <v-col
              v-if="deal.type"
              class="overline ml-1"
              style
              :style="{ 'color':deal.type.color}"
            >{{deal.type.name}}</v-col>
            <v-col cols="auto" class="overline">{{ deal.date_begin }}</v-col>
            <v-col
              cols="12"
              class="caption"
              style="font-size:11px!important;line-height:unset;white-space: pre-line;"
            >{{ deal.title }}</v-col>
            <v-col cols="12">
              <v-chip x-small label :color="deal.stage.color">{{ deal.stage.name }}</v-chip>
            </v-col>
            <v-col cols="12">
              <v-chip
                v-if="deal.client.id"
                label
                :color="deal.client.coldeals > 1 ? 'yellow lighten-4':'yellow lighten-4'"
                style="width:150px; height:unset;"
                class="my-0"
                x-small
                @click="showClient(deal.id, deal.client.id)"
              >
                <v-avatar
                  v-if="deal.client.coldeals > 1"
                  left
                  class="orange darken-3"
                >{{deal.client.coldeals}}</v-avatar>

                <div style="white-space: normal;">{{ deal.client.name || "[ Без имени ]"}}</div>
              </v-chip>
            </v-col>
          </v-row>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "pipeline",
  props: {
    deals: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showFinishStage: false
    };
  },
  computed: {
    stagesActual() {
      if (this.showFinishStage) return this.$store.getters["stages/GET_STAGES"];
      else
        return this.$store.getters["stages/GET_STAGES"].filter(function(stage) {
          return stage.name !== "Не выполнено" && stage.name !== "Выполнено";
        });
    },
    dealsSlice() {
      let $arr = [];

      this.stagesActual.forEach(stage => {
        $arr[stage.name] = this.deals.filter(
          deal => deal.stage.name === stage.name
        );
      });
      // console.log($arr);
      return $arr;
    }
  },
  methods: {
    showDeal(deal_id) {
      this.$store.dispatch("deals/show", deal_id);
    },
    showClient(deal_id, clientId) {
      // this.$store.commit("deals/SET_DEAL_ID", deal_id);
      this.$store.commit("clients/SET_CLIENT_ID", clientId);
      this.$store.state.showClient = true;
    }
  },
  components: {}
};
</script>

<style lang="css" slot-scope>
.list-group-item {
  border: 1px #cccccc solid;
}
</style>