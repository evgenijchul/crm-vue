<template>
  <div>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar dark flat>
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="login"
                    :error-messages="loginErrors"
                    label="Login"
                    name="login"
                    prepend-icon="person"
                    type="text"
                    @input="$v.login.$touch()"
                    @blur="$v.login.$touch()"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    :error-messages="passwordErrors"
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                    @input="$v.password.$touch()"
                    @blur="$v.password.$touch()"
                    @keyup.enter="submit"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="submit" :loading="loading">Войти</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import store from "@/store";

export default {
  name: "login",

  data() {
    return {
      login: "sale",
      password: "123456",
      submitStatus: null,
      loading: false
    };
  },
  validations: {
    login: {
      required
    },
    password: {
      required
    }
  },

  methods: {
    async submit() {
      this.loading = true;

      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      const formData = {
        login: this.login,
        password: this.password
      };
      //console.log(formData);
      //this.$router.push("/");
      await this.$store
        .dispatch("managers/login", formData)
        .then(() => this.$router.push("/task"));
    }
  },
  computed: {
    loginErrors() {
      const errors = [];
      if (!this.$v.login.$dirty) return errors;
      !this.$v.login.required && errors.push("Обязательное поле.");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Обязательное поле.");
      return errors;
    }
  }
};
</script>