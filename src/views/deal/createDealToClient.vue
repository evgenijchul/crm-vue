<template>
  <div></div>
</template>
<script>
export default {
  name: "addDealToClient",
  async beforeCreate() {

    // console.log(this.$route.params.site_sid);

    // создадим сделку

    await this.$store.dispatch("deals/createToClient", {
      client_id: this.$route.params.client_id,
      site_sid: this.$route.params.site_sid
    });
    const new_deal = this.$store.getters["deals/GET_DEAL"];
   
    // //this.$router.push("/deal/" + new_deal.id);
    if (new_deal.id > 0) {
      this.$router.push({
        name: "deal",
        params: { deal_id: new_deal.id }
      });
    }
  }
};
</script>