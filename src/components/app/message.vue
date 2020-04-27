<template>
  <v-snackbar
    v-if="this.$store.state.message.type=='success'"
    top
    :timeout="1000"
    v-model="show"
    :color="this.$store.state.message.type"
  >{{this.$store.state.message.text}}</v-snackbar>

  <v-snackbar
    v-else
    top
    :timeout="5000"
    multi-line
    v-model="show"
    :color="this.$store.state.message.type"
  >
    {{this.$store.state.message.text}}
    <v-btn text color="accent" @click.native="show = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: "message",
  data() {
    return {};
  },
  computed: {
    show: {
      get: function() {
        if (this.$store.state.message.text.length > 0) {
          return true;
        } else {
          return false;
        }
      },
      set: function(newValue) {
        if (newValue === false) {
          this.$store.state.message.text = "";
          this.$store.state.message.type = "";
        }
        return newValue;
      }
    }
  }
};
</script>