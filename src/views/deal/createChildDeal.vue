<template>
  <div></div>
</template>
<script>
export default {
  name: "createChildDeal",
  async beforeCreate() {
    //console.log(this.$route.params.deal_id);

    // создадим сделку

    await this.$store.dispatch("deals/createChildDeal", {
      parent_deal_id: this.$route.params.deal_id
    });
    const new_deal = this.$store.getters["deals/GET_DEAL"];

    // // //this.$router.push("/deal/" + new_deal.id);

    if (new_deal.id > 0) {
      // await this.$store.dispatch("history_tech/postHistoryTech", {
      //   deal_id: new_deal.id,
      //   text:
      //     "Создана из: \nРодительской сделки: №" + this.$route.params.deal_id,
      //   type: "mdi-newspaper-variant-multiple"
      // });

      this.$router.push({
        name: "deal",
        params: { deal_id: new_deal.id }
      });
    }
  }
};
</script>