<template>
  <div></div>
</template>
<script>
export default {
  name: "createNewDeal",
  async beforeCreate() {
    await this.$store.dispatch("deals/create", { site_sid: "5000wt" });
    const new_deal = this.$store.getters["deals/GET_DEAL"];
    //

    if (new_deal.id > 0) {
      
      await this.$store.dispatch("history_tech/postHistoryTech", {
        deal_id: new_deal.id,
        text: "Создана вручную.",
        type: "mdi-newspaper-variant-multiple"
      });

      // this.$store.dispatch("deals/show", new_deal.id);
      // this.$router.push("/deal/" + new_deal.id);
      this.$router.push({
        name: "deal",
        params: { deal_id: new_deal.id }
      });
    }
  }
};
</script>