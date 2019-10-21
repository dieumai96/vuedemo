<template>
  <div>
    <v-btn color="primary" @click="dialog = true">Open Dialog</v-btn>
    <Modal :dialog="dialog" @callbackDialog="receiveData($event)" />
  </div>
</template>

<script>
import Modal from "./Modal.vue";
export default {
  name: "Pages1",
  components: {
    Modal
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    receiveData(e) {
      this.dialog = e.dialog;
    }
  }
};
</script>

<style>
</style>