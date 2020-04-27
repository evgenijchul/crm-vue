export default {
    methods: {
        showDeal: function (deal_id) {
            this.$store.state.showClient = false;
            this.$store.state.deals.showDeal = false;
            setTimeout(() => {
              this.$store.dispatch("deals/show", deal_id);
            }, 200);

            
      }
    }
  }