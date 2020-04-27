<template>
  <div>
    <v-system-bar
      v-if="$store.state.dev"
      color="black"
      :height="11"
      dark
      window
      style="position:fixed;z-index:1111;width:100%"
    >
      <span class="caption left">Сайт разработки</span>
    </v-system-bar>

    <v-container fluid fill-height class="pt-0" style="padding-bottom:100px;">
      <v-row justify="start" align="start" no-gutters>
        <v-col cols="auto" class="pr-2 pt-2">
          <navbar></navbar>
        </v-col>

        <v-col class="pr-0 pt-0" style="padding-left:40px;">
          <v-content>
            <router-view></router-view>
          </v-content>
        </v-col>
      </v-row>

      <createMail v-if="this.$store.state.showMail"></createMail>
      <deal v-if="this.$store.state.deals.showDeal"></deal>
      <client v-if="this.$store.state.showClient"></client>
    </v-container>

    <script id="modalTemplateConfirm" type="text/html">
  <div
    role="document"
    class="v-dialog__content v-dialog__content--active"
    style="z-index: 202;"
    tabindex="0"
    id="{id_window}"
    style="display:none;"
  >
    <div class="v-dialog v-dialog--active" style="max-width: 590px;">
      <div class="v-card v-sheet theme--light">
        <div class="v-card__title headline">{title}</div>
        <div
          class="v-card__text"
        >{body}</div>
        <div class="v-card__actions">
          <div class="spacer"></div>
          <button
            type="button"
            class="v-btn v-btn--flat v-btn--text theme--light v-size--default red--text text--darken-1"
             id="no_{id_window}"
          >
            <span class="v-btn__content">{no}</span>
          </button>
          <button
            type="button"
            class="v-btn v-btn--flat v-btn--text theme--light v-size--default green--text text--darken-1"
             id="yes_{id_window}"
          >
            <span class="v-btn__content">{yes}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
    </script>
  </div>
</template>


<script>
import navbar from "@/components/app/navbar";
import client from "@/components/app/client";
import deal from "@/components/app/deal";
import createMail from "@/components/app/createMail";

export default {
  name: "MainLayout",
  data() {
    return {
      // date: new Date(),
      interval: null
    };
  },
  methods: {},
  async beforeCreate() {
    // this.interval = setInterval(() => {
    //   this.date = new Date();
    // }, 1000);

    //this.$store.dispatch("managers/getManager");
    // await this.$store.dispatch("managers/getManager");
    await this.$store.dispatch("managers/getManager");
    await this.$store.dispatch("stages/getStages");
    await this.$store.dispatch("type/getTypes");
    await this.$store.dispatch("sites/getSites");

    await this.$store.dispatch("banks/getOurBanks");
    await this.$store.dispatch("managers/getManagerAll");
  },

  watch: {
    "$route.params.deal_id"(deal_id) {
      if (deal_id) {
        this.$store.dispatch("deals/show", this.$route.params.deal_id);
      }
    }
  },
  mounted() {
    if (this.$route.params.deal_id) {
      this.$store.dispatch("deals/show", this.$route.params.deal_id);
    }
  },

  components: {
    navbar,
    client,
    createMail,
    deal
  }
};
</script>
