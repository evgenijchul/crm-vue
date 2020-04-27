<template>
  <div class="edit-input-text" @dblclick="changeInput(row)">
    <v-text-field
      autocomplete="off"
      :loading="loading"
      hide-details
      :prepend-icon="icon"
      :label="title"
      :ref="ref"
      :disabled="editRow===row ? false:true"
      :value="value"
      @input="updateValue($event)"
    ></v-text-field>
    <v-row class="btns" no-gutters>
      <v-col cols="8">
        <v-btn
          dark
          block
          class="mt-1 elevation-5 puls"
          color="pink"
          v-show="editRow===row"
          @click="saveRow(id, row, value)"
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
  name: "mytext",
  props: ["store", "row", "id", "title", "comment", "icon", "value"],
  data() {
    return {
      loading: false,
      editRow: ""
    };
  },
  computed: {
    ref() {
      return this.store + this.row + this.id;
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
      this.loading = true;
      await this.$store.dispatch(this.store + "/saveRow", { id, row, data });
      this.loading = false;
      this.editRow = null;

      this.$emit("updateTextFinish");
      this.$store.state.flagEdit = true;
    }
  }
};
</script>



<style>
.edit-input-text input[disabled],
.edit-input-text textarea[disabled] {
  color: black !important;

  /* background: unset !important; 
  background-color:#e6e2eb  !important;  */
}

.edit-input-text textarea {
  font-size: 16px;
  color: black !important;
}
.edit-input-text .v-label {
  _color: black !important;
}
.edit-input-text {
  position: relative;
  width: 100%;
  padding-bottom: 3px;
}
.edit-input-text .btns {
  position: absolute;
  z-index: 5;
  width: 100%;
}
.edit-input-text:hover:after {
  content: "\F064F";
  font: normal normal normal 16px/1 "Material Design Icons";
  color: #537898;
  position: absolute;
  right: 7px;
  top: 35%;
}
</style>
