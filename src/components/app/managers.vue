<template>
  <div class="managers">
    <v-menu origin="center center">
      <template v-slot:activator="{ on }">
        <v-menu origin="center center" transition="scale-transition">
          <template v-slot:activator="{ on }">
            <v-btn x-small v-on="on" tile depressed>для: {{managerTask.fio}}</v-btn>
          </template>

          <v-list>
            <v-list-item-group>
              <v-list-item
                dense
                v-for="m in managerAll"
                :key="m.id"
                @click="changeTaskManager(m)"
              >{{m.fio}}</v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </template>
    </v-menu>
  </div>
</template>
<script>
export default {
  name: "managers",
  props: ["value"],
  data() {
    return {
      managerTask: {}
    };
  },
  computed: {
    managerAll() {
      return this.$store.getters["managers/GET_MANAGER_ALL"];
    },
    
  },
  watch: {},
  methods: {
    changeTaskManager(m) {
      this.managerTask = m;
      // console.log(m);
      this.$emit("update:value", m);
    }
  },
  async mounted() {
    this.managerTask = this.$store.getters["managers/GET_MANAGER"];
    this.$emit("update:value", this.managerTask);
  }
};
</script>

