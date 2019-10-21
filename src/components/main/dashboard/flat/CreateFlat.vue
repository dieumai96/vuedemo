<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" v-if="!isLoading" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{typeButton == 'Add' ? 'Add new flat' : 'Edit flat'}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select :items="buildingInfo.blocks" v-model="block" label="Blocks" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Number flat" v-model="soPhong"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field label="Owername" v-model="owerName"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field label="Phone" v-model="phone"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Acreage" type="number" v-model="acreage"></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select :items="[1,2,3,4,5,6,7]" label="Flat type" v-model="flatType"></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea label="Note" v-model="note"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeModal()">Close</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="submit"
          >{{typeButton == 'Add' ? 'Create' : 'Save'}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import instance from "./../../../../shared/callApi.service";
import { Url } from "./../../../../config/apiUrl";
import { ServerConfig } from "./../../../../config/serverConfig";
import { mapActions, mapMutations, mapGetters } from "vuex";
const JWT = require("jwt-decode");
export default {
  props: {
    dialog: {
      required: true,
      type: Boolean
    },
    modalHeader: {
      required: true,
      type: String
    },
    typeButton: {
      required: true,
      type: String
    },
    updateFlatDto: {
      type: Object
    }
  },
  data() {
    return {
      buildingInfo: {},
      isLoading: Boolean,
      block: Number,
      soPhong: "",
      owerName: "",
      phone: "",
      acreage: Number,
      flatType: Number,
      note: ""
    };
  },
  beforeCreate() {},
  created() {
    this.initialDataEdit();
    let token = localStorage.getItem("token");
    this.getBuildingInfomation(token);
  },
  computed: {
    ...mapGetters(["getLoading"])
  },
  methods: {
    closeModal() {
      this.$emit("callbackDialog", {
        dialog: false
      });
    },
    getBuildingInfomation(token) {
      this.isLoading = true;
      let decoded = JWT(token);
      let body = {
        buildingID: decoded.buildingID
      };
      instance
        .post(
          `${ServerConfig.API_ENDPOINT}/${Url.GET_BUILDING_INFOMATION}`,
          body
        )
        .then(res => {
          this.isLoading = false;
          if (res.status == 200) {
            if (res.data.status == 0) {
              this.buildingInfo = res.data.data;
            }
          }
        })
        .catch(err => new Error(err));
    },
    ...mapActions(["createFlat", "editFlat"]),
    async submit() {
      let body = {
        block: this.block,
        soPhong: this.soPhong,
        owerName: this.owerName,
        phone: this.phone,
        acreage: this.acreage,
        flatType: this.flatType,
        note: this.note
      };
      switch (this.typeButton) {
        case "Add": {
          await this.createFlat(body);
          this.closeModal();
          break;
        }
        case "Edit": {
          body.flatID = this.updateFlatDto._id;
          await this.editFlat(body);
          this.closeModal();
          break;
        }
        default: {
          break;
        }
      }
    },
    initialDataEdit() {
      if (this.typeButton == "Edit") {
        this.block = this.updateFlatDto.block;
        this.soPhong = this.updateFlatDto.soPhong;
        this.owerName = this.updateFlatDto.owerName;
        this.phone = this.updateFlatDto.phone;
        this.acreage = this.updateFlatDto.acreage;
        this.flatType = this.updateFlatDto.flatType;
        this.note = this.updateFlatDto.note;
      }
    }
  },

  name: "CreateFlat"
};
</script>

<style>
</style>