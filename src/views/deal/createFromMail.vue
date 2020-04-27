<template>
  <div></div>
</template>
<script>
export default {
  name: "createNewDealFromMail",
  async beforeCreate() {
    //console.log(this.$route.params.email);

    // создадим сделку
    await this.$store.dispatch("deals/create", {
      site_sid: this.$route.params.site_sid
    });

    const new_deal = this.$store.getters["deals/GET_DEAL"];

    // создадим клиента
    await this.$store.dispatch("clients/create", {
      email: this.$route.params.email
    });
    //const new_client = this.$store.getters["clients/GET_CLIENT"];

    // //this.$router.push("/deal/" + new_deal.id);
    if (new_deal.id > 0) {
      
      await this.$store.dispatch("history_tech/postHistoryTech", {
        deal_id: new_deal.id,
        text:
          "Создана из: \nПочты: " +
          this.$route.params.email +
          ". Сайт: " +
          this.$route.params.site_sid,
        type: "mdi-newspaper-variant-multiple"
      });

      this.$router.push({
        name: "deal",
        params: { deal_id: new_deal.id }
      });
    }
  }
};
</script>