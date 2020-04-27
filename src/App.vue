<template>
  <v-app id="inspire">
    <vue-progress-bar></vue-progress-bar>
    <component :is="layout">
      <router-view />
    </component>
    <message />
  </v-app>
</template>



<script>
import EmptyLayout from "@/layouts/EmptyLayout";
import MainLayout from "@/layouts/MainLayout";
import message from "@/components/app/message";

export default {
  computed: {
    layout() {
      // console.log(this.$route.meta.layout);
      return this.$route.meta.layout;
    }
  },
  created() {
    // this.$Progress.start();
  },
  async mounted() {
    
  },
  components: {
    EmptyLayout,
    MainLayout,
    message
  }
};
</script>
<style lang="css">

@import "~vue-wysiwyg/dist/vueWysiwyg.css";

.container:first-child {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.manager-write {
  /* font-family: "Times New Roman" !important; */
}
.comment .v-input__slot {
  background: unset !important;
}
.comment-text {
  /* font-family: "Times New Roman", Times, serif !important; */
  white-space: pre-wrap;
}
.comment,
.comment textarea {
  /* font-family: "Times New Roman", Times, serif !important; */
  background-color: #e6e2eb !important;
  color: black !important;
  white-space: pre-wrap;
  padding-left: 7px;
}

.history-input .v-input__slot {
  background: unset !important;
}
.history-input,
.history-input textarea {
  /* font-family: "Times New Roman", Times, serif !important; */
  background-color: white !important;
  color: black !important;
  white-space: pre-wrap;
  _margin-top: 0 !important;
}

@keyframes shadow-pulse {
  0% {
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 0 0 7px rgba(0, 0, 0, 0.2);
  }
}

.puls {
  animation: shadow-pulse 1s infinite;
}
</style>