<template>
  <div>
 
    <v-chip
      v-if="client.id"
      label
      :color="client.coldeals > 1 ? 'yellow lighten-4':'yellow lighten-4'"
      style="width:150px; height:unset;"
      class="my-2"
      small
      @click="showClient(client.id)"
    >
      <v-avatar v-if="client.coldeals > 1" left class="orange darken-3">{{client.coldeals}}</v-avatar>

      <div style="white-space: normal;">{{ client.name || "[ Без имени ]"}}</div>
    </v-chip>
  </div>
</template>
<script>
export default {
  name: "clientChip",
  props: ["client"],
  data() {
    return {};
  },

  methods: {
    showClient(clientId) {
      // this.$store.commit("deals/SET_DEAL_ID", deal_id);
      this.$store.commit("clients/SET_CLIENT_ID", clientId);
      this.$store.state.showClient = true;
    }
  },
  watch: {},
  computed: {}
};
</script>
<style>

.v-chip.v-size--x-small {
 
    line-height: 15px;
}
</style>