<template>
  <div style="position:relative;z-index:100" class="mx-1 pb-2">
    <v-container id="goods-list" fluid class="elevation-1">
      <v-row no-gutters>
        <v-col>
          <v-card class="elevation-0">
            <!-- <v-card-title>Оборудование</v-card-title> -->
            <v-card-text class="px-2 py-2">
              <v-simple-table dense>
                <thead>
                  <tr>
                    <th class="text-left"></th>
                    <th class="text-left"></th>
                    <th width="35%" class="text-left">Название</th>
                    <th class="text-left">Цена</th>
                    <th width="85px" class="text-left">Кол-во</th>
                    <th width="75px">Скидка</th>
                    <th width="55px" dense></th>
                    <th class="text-left">Стоимость</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="good in arrGoodsList" :key="good.id">
                    <td :class="editRow===good.id? 'edit-row':''">
                      <v-btn
                        v-if="good.ext_url"
                        text
                        icon
                        :color="good.ext_url_color"
                        @click.prevent="openURL(good.ext_url)"
                        title="Открыть на сайте"
                        x-small
                      >
                        <v-icon>mdi-open-in-new</v-icon>
                      </v-btn>

                      <v-menu>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on="on" class="subtitle-1">mdi-dots-horizontal</v-icon>
                        </template>

                        <v-list dense>
                          <v-list-item @click="removeGood(good.id)" class="my-0 py-0">
                            <v-list-item-title>Удалить</v-list-item-title>
                          </v-list-item>
                          <!-- <v-list-item @click>
                            <v-list-item-title>Привязать к товару на сайте</v-list-item-title>
                          </v-list-item>-->
                        </v-list>
                      </v-menu>
                    </td>
                    <!-- картинка -->
                    <td :class="editRow===good.id? 'edit-row':''">
                      <v-img :src="good.picture" max-width="50"></v-img>
                    </td>
                    <!-- название -->
                    <td :class="editRow===good.id? 'edit-row':''">
                      <v-text-field
                        @blur="saveRow(good)"
                        dense
                        :value="good.name"
                        solo
                        autocomplete="off"
                        @input="changeName(good, $event)"
                      ></v-text-field>
                    </td>

                    <td :class="editRow===good.id? 'edit-row':''">
                      <!-- Цена -->
                      <v-text-field
                        @blur="saveRow(good)"
                        dense
                        solo
                        :value="formatPrice(good.price)"
                        @input="changePrice(good, $event)"
                        autocomplete="off"
                      ></v-text-field>
                    </td>

                    <!-- количество -->
                    <td :class="editRow===good.id? 'edit-row':''">
                      <v-text-field
                        @blur="saveRow(good)"
                        dense
                        solo
                        type="number"
                        :value="formatPrice(good.quantity)"
                        @input="changeQuantity(good, $event)"
                        autocomplete="off"
                        class="right sht"
                      ></v-text-field>
                    </td>

                    <!-- скидка -->
                    <td :class="editRow===good.id? 'edit-row':''">
                      <v-text-field
                        v-if="good.showrub === 'Y'"
                        @blur="saveRow(good)"
                        dense
                        type="number"
                        class="right"
                        style="margin-bottom: -7px;"
                        :value="formatPrice(good.sale)"
                        @input="changeSale(good,$event)"
                        color="deep-purple accent-3"
                        autocomplete="off"
                        :background-color="formatPrice(good.sale) <0? 'red':''"
                      ></v-text-field>
                      <v-text-field
                        v-else
                        @blur="saveRow(good)"
                        dense
                        type="number"
                        class="right"
                        style="margin-bottom: -7px;"
                        :value="Math.round(100*good.sale/(good.price*good.quantity)*1000)/1000"
                        @input="changeSaleProc(good,$event)"
                        color="deep-purple accent-3"
                        autocomplete="off"
                        :background-color="Math.round(100*good.sale/(good.price*good.quantity)*1000)/1000 <0? 'red':''"
                      ></v-text-field>
                    </td>

                    <!-- переключатель типа скидки -->
                    <td style="padding-left:0;margin:0;" :class="editRow===good.id? 'edit-row':''">
                      <v-btn-toggle
                        :value="good.showrub==='Y'?1:0"
                        @change="changeShowRub(good, $event)"
                        dense
                        color="deep-purple accent-3"
                      >
                        <v-btn>
                          <p class="headline font-weight-black">%</p>
                        </v-btn>
                        <v-btn>
                          <p class="title">руб.</p>
                        </v-btn>
                      </v-btn-toggle>
                    </td>

                    <!-- сумма -->
                    <td :class="editRow===good.id? 'edit-row':''">
                      <v-text-field
                        @blur="saveRow(good)"
                        dense
                        solo
                        :value="formatPrice(good.price*good.quantity-good.sale)"
                        @input="changeSum(good,$event)"
                        autocomplete="off"
                        :background-color="formatPrice(good.price*good.quantity-good.sale) <0? 'red':''"
                      ></v-text-field>
                    </td>

                    <td :class="editRow===good.id? 'edit-row':''">
                      <v-checkbox
                        :input-value="good.checkbox=='Y'?true:false"
                        color="deep-purple"
                        @change="changeCheckbox(good, $event)"
                      ></v-checkbox>
                    </td>
                  </tr>
                  <div v-show="editRow" style="position:absolute;z-index:9">                  
                      <v-btn small dark color="deep-purple" @click="addGoodSimple">Сохраните товары</v-btn>                   
                  </div>
                  <!-- Новые товар -->
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                      <v-text-field
                        dense
                        solo
                        @dblclick="showFlyCatalog"
                        v-model="newGoodName"
                        autocomplete="off"
                      ></v-text-field>
                      <v-btn text small color="primary" @click="addGoodSimple">Добавить товар</v-btn>

                      <div
                        style="position:absolute;z-index:9999;"
                        :style="{bottom: '-30px', left: '30px'}"
                        v-if="showFlyCatalogFlag"
                      >
                        <getFlyCatalog @addGood="addGood" @close="showFlyCatalogFlag=false" />
                      </div>
                    </td>

                    <td colspan="10" align="right" class="title">Итого: {{itogo | toCurrency}}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- v-on-clickaway="closeFlyCatalog" -->
  </div>
</template>
<script>
// import { directive as onClickaway } from "vue-clickaway";

// import _ from "lodash";

export default {
  name: "goodsList",
  data() {
    return {
      editRow: null,
      showFlyCatalogFlag: false,
      x: 0,
      y: 0,
      newGoodName: "",

    };
  },
  methods: {
    openURL(url) {
      openExtURL(url);
    },
    async saveRow(good) {
      await this.$store.dispatch("goodsInDeal/updateGood", {
        id: good.id,
        good: good
      });
      this.editRow = null;
      this.$store.state.flagEdit = true;
    },

    changeName(item, event) {
      item.name = event;
      this.editRow = item.id;
    },
    changeShowRub(item, number) {
      //this.editRow = item.id;

      if (number === 0) {
        item.showrub = "N";
      } else {
        item.showrub = "Y";
      }
      this.saveRow(item);
      // !!! this.saveRow(good.id, 'sale', good.sale)"
    },
    changeCheckbox(item, checkbox) {
      //this.editRow = item.id;
      //console.log(checkbox);
      if (checkbox) {
        item.checkbox = "Y";
      } else {
        item.checkbox = "N";
      }
      this.saveRow(item);
      // !!! this.saveRow(good.id, 'sale', good.sale)"
    },
    formatPrice(value) {
      let val = Math.round(value);
      return val; //.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    changeQuantity: function(item, event) {
      this.editRow = item.id;
      item.quantity = event; // Actual assignment
    },
    changePrice: function(item, event) {
      this.editRow = item.id;
      item.price = event; // Actual assignment
    },
    // changeSaleSwitch: function(item, event) {
    //   // console.log(item);
    //   // console.log(event);
    // },
    changeSum: function(item, event) {
      // console.log(item.price); // Old value
      //  console.log(event); // New value
      this.editRow = item.id;
      item.sale = item.price * item.quantity - event; // Actual assignment
    },
    changeSale: function(item, event) {
      this.editRow = item.id;
      item.sale = event; // Actual assignment
    },
    changeSaleProc: function(item, event) {
      this.editRow = item.id;
      item.sale = (event * item.price * item.quantity) / 100; // Actual assignment
    },
    async addGood(item) {
      //console.log(item);
      await this.$store.dispatch("goodsInDeal/addGoodFromSite", {
        ext_id: item.id
      });
      this.showFlyCatalogFlag = false;
      this.$store.state.flagEdit = true;
    },
    addGoodSimple() {
      this.$store.dispatch("goodsInDeal/addGoodSimple", {
        name: this.newGoodName,
        price: 0,
        quantity: 1,
        sale: 0,
        ext_id: 0,
        sort: 0,
        showrub: "N",
        checkbox: "Y"
      });
      this.newGoodName = "";
      this.$store.state.flagEdit = true;
    },
    async removeGood(id) {
      await this.$store.dispatch("goodsInDeal/removeGood", id);
      this.$store.state.flagEdit = true;
    },
    selectGood() {},
    showFlyCatalog(e) {
      e.preventDefault();

      this.x = e.pageX - 150;
      this.y = e.pageY - 70;

      this.showFlyCatalogFlag = !this.showFlyCatalogFlag;
    },
    closeFlyCatalog() {
      this.showFlyCatalogFlag = false;
    }
  },

  computed: {
    arrGoodsList() {
      return this.$store.getters["goodsInDeal/GET_GOODS"].map(g => {
        if (g["ext_id"] > 0) {
          g["ext_url"] =
            this.$store.getters["deals/GET_DEAL"].site.url +
            "?ELEMENT_ID=" +
            g["ext_id"];

          g["ext_url_color"] = this.$store.getters["deals/GET_DEAL"].site.color;
        }
        return g;
      });
    },
    itogo() {
      let itogo = 0;

      this.arrGoodsList.forEach(item => {
        if (item.checkbox == "Y")
          itogo = this.formatPrice(
            itogo + (item.price * item.quantity - item.sale)
          );
      });

      return itogo;
    }
  },
  watch: {
  

    arrGoodsList() {
      globalVars.vueGoodsList = this.$store.getters["goodsInDeal/GET_GOODS"];
    }
  },
  async mounted() {},
  // directives: {
  //   onClickaway: onClickaway
  // },
  components: {
    
  }
};
</script>
<style>
#goods-list {
  padding: 0;
  border: 1px solid #4a148c;
  
  
}
#goods-list .right input {
  text-align: right;
}
#goods-list .sht::after {
  content: "шт.";
  padding-top: 7px;
  padding-left: 2px;
}

#goods-list
  .v-text-field.v-text-field--solo.v-input--dense
  > .v-input__control {
  /* min-height: unset; */
  height: 38px;
  display: unset;
}
#goods-list .v-data-table td,
#goods-list .v-data-table th {
  padding: 4px 4px;
}

#goods-list .v-input__slot {
  padding: 0 4px !important;
}
#goods-list .v-input__slot input {
  font-family: Arial, Helvetica, sans-serif;
}
#goods-list .v-btn:not(.v-btn--round).v-size--default {
  min-width: 38px;
  text-transform: unset;
}
#goods-list
  .v-text-field.v-input--dense:not(.v-text-field--outlined):not(.v-text-field--solo)
  input {
  padding-bottom: 0 !important;
}
#goods-list .edit-row {
  border-bottom: 1px solid black;
  background-color: #ede7f6;
  
}
</style>