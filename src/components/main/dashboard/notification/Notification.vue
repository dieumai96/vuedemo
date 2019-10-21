<template>
  <div class="table-list">
    <v-progress-circular v-if="getLoadingNotification" indeterminate color="primary"></v-progress-circular>
    <v-card>
      <v-card-title class="search-input">Notification</v-card-title>
      <v-data-table
        :headers="headers"
        :items="getAllNotifications"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="elevation-1"
        @page-count="pageCount = $event"
      >
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
          <v-icon small @click="deleteItem(item)">delete</v-icon>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-card>
    <CreateNotification
      v-if="dialogCreateNotification"
      :dialog="dialogCreateNotification"
      :modalHeader="modalHeader"
      :typeButton="typeButton"
      @callbackDialog="callbackDialog($event)"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { eventBus } from "./../../../../main";
import CreateNotification from "./CreateNotification.vue";
import { appSocketService } from "./../../../../services/app-socket";
export default {
  name: "Notification",
  components: {
    CreateNotification
  },
  data() {
    return {
      dialogCreateNotification: false,
      modalHeader: "Add new notification".toUpperCase(),
      typeButton: "Add",
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      loading: true,
      headers: [
        {
          text: "Action",
          align: "left",
          sortable: false,
          value: "action"
        },
        { text: "Title", value: "title" },
        { text: "Content", value: "content" },
        { text: "Read", value: "alreadyRead" },
        { text: "Time created", value: "timeCreated" },
        {
          text: "Sent",
          value: "sent"
        }

        // { text: "Time created", value: "timeCreated" }
      ]
    };
  },
  computed: {
    ...mapGetters(["getAllNotifications", "getLoadingNotification"])
  },
  methods: {
    ...mapActions(["fetchNotifications"]),
    callbackDialog(event) {
      this.dialogCreateNotification = event.dialog;
    }
  },
  async mounted() {
    this.fetchNotifications();
  },

  created() {
    appSocketService.receiveNotification().subscribe(data => console.log(data)); 
    eventBus.$on("actionCreate", type => {
      if (type == "NOTIFICATION") {
        this.dialogCreateNotification = true;
        this.typeButton = "Add";
      }
    });
  }
};
</script>

<style>
</style>