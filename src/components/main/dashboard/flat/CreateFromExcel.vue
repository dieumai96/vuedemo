<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="closeModal('close')">
            <v-icon>close</v-icon>
          </v-btn>
          <div class="flex-grow-1"></div>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="closeModal('addData')"
              :style="[(!dataFromFile.length || !dataFromFile.length) ? {'pointerEvent' : 'none'} : {'pointerEvent' : 'default'}]"
            >Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-data-table
          :headers="headers"
          :items="isRemoveData ? dataFromFile : dataFile"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          class="elevation-1"
          @page-count="pageCount = $event"
        >
          <template v-slot:item.action="{ item }">
            <v-icon
              :style="[item.isValid == false ? {'color' : 'red'} : {'color' : 'rgba(0, 0, 0, 0.54)'}]"
              small
              @click="deleteItem(item)"
            >delete</v-icon>
          </template>
        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount"></v-pagination>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { error } from "./../../../../shared/alert";
import { mapActions } from "vuex";
export default {
  name: "CreateFromFlat",
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    dataFile: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 20,
      headers: [
        {
          text: "Action",
          align: "left",
          sortable: false,
          value: "action"
        },
        { text: "Building", value: "block" },
        { text: "Number", value: "soPhong" },
        { text: "Acreage", value: "acreage" },
        { text: "Name", value: "owerName" },
        { text: "Phone", value: "phone" },
        { text: "FlatType", value: "flatType" },
        { text: "Note", value: "note" }
      ],
      dataFromFile: [],
      isRemoveData: false
    };
  },
  created() {},
  mounted() {
    this.dataFromFile = [...this.dataFile];
  },
  methods: {
    ...mapActions(["createMultiFlat"]),
    async closeModal(type) {
      let check = true;
      switch (type) {
        case "addData": {
          let check = true;
          this.dataFromFile.forEach(element => {
            if (!element.isValid) {
              check = false;
            }
          });
          if (!check) {
            error("Please remove flat invalid");
          } else {
            this.dialog = true;
            this.dataFromFile.forEach(e => {
              delete e.isValid;
              delete e.id;
            });
            let body = {
              flatsDto: this.dataFromFile
            };
            if (!this.dataFromFile.length) {
              error(`Don't have data to create`);
            } else {
              await this.createMultiFlat(body);
              this.$emit("callbackDialog", false);
            }
          }
          break;
        }
        case "close": {
          this.$emit("callbackDialog", false);
          break;
        }
      }
    },

    deleteItem(item) {
      this.isRemoveData = true;
      this.dataFromFile = this.dataFromFile.filter(x => x.id != item.id);
    }
  }
};
</script>

<style>
</style>