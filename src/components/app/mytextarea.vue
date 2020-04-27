<template>
  <div class="edit-input" @dblclick="changeInput(row)">
    <v-textarea
      hide-details
      auto-grow
      :rows="rows"
      :label="title"
      :class="comment?'comment':styleInput"
      :ref="ref"
      :disabled="editRow===row ? false:true"
      :value="value"
      @input="updateValue($event)"
    ></v-textarea>

    <v-row class="btns" no-gutters>
      <v-col cols="8">
        <v-btn
          dark
          block
          class="mt-1 elevation-5 puls"
          color="pink"
          v-show="editRow===row"
          @click="saveRow(id,row, value)"
        >Сохранить</v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="3">
        <v-btn
          dark
          block
          x-small
          class="mt-1"
          color="grey"
          v-show="editRow===row"
          @click="editRow=''"
        >Отменить</v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: "mytextarea",
  
  props:{
    store:{
      type: String,
      required: true
    },
    row:{
      type: String,
      required: true
    },
    title:{
      type: String
    },
    comment:{
      type: Boolean
    },
    styleInput:{
      type: String
    },
    icon:{
      type: String
    },
    value:{
      type: String,
      required: true
    },
    id:{
      type: String,
      required: true
    },
    rowcol:{
      type: String
    },
  },
  data() {
    return {
      editRow: ""
    };
  },
  computed: {
    ref() {
      return this.store + this.row;
    },
    rows() {
      //console.log(this.rowcol);
      if (this.rowcol) {
        return this.rowcol;
      } else {
        return 2;
      }
    }
  },
  methods: {
    updateValue(event) {
      this.$emit("update:value", event);
      this.$emit("updateText");
    },
    changeInput(row) {
      this.editRow = row;
      setTimeout(() => {
        this.$refs[this.ref].$refs.input.focus();
      }, 0);
    },
    async saveRow(id, row, data) {
      this.editRow = null;
      await this.$store.dispatch(this.store + "/saveRow", { id, row, data });

      this.$emit("updateTextFinish");
      this.$store.state.flagEdit = true;
    }
  }
};
</script>

<style>
.edit-input input[disabled],
.edit-input textarea[disabled] {
  color: black !important;

  /* background: unset !important; 
  background-color:#e6e2eb  !important;  */
}

.edit-input textarea {
  font-size: 16px;
  color: black !important;
}
.edit-input .v-label {
  /* color: rgba(0,0,0,.87) !important; */
  font-weight: bold !important;
}
.edit-input {
  position: relative;
  padding-bottom: 3px;
}
.edit-input .btns {
  position: absolute;
  z-index: 5;
  width: 100%;
}
.edit-input:hover:after {
  content: "\F064F";
  font: normal normal normal 16px/1 "Material Design Icons";
  position: absolute;
  color: #537898;
  right: 7px;
  top: 5px;
}
</style>