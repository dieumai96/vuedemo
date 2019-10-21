<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Select building</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-container fluid>
                  <v-checkbox
                    v-for="(item,index) in getBuildingInfomation.blocks"
                    :key="index"
                    :label="item"
                    @change="selectBuilding($event,item)"
                  ></v-checkbox>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="closeModal('close')">Close</v-btn>
          <v-btn color="blue darken-1" text @click="closeModal('save')">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "SelectBuilding",
  data() {
    return {
      blocks: [],
      listChoice: []
    };
  },
  props: {
    dialog: {
      required: true,
      type: Boolean
    }
  },
  methods: {
    ...mapActions(["fetchBuildingInfomation"]),
    closeModal(type) {
      if (type == "close") {
        this.$emit("callbackDialog", {
          dialog: false
        });
      } else {
        this.$emit("callbackDialog", {
          dialog: false,
          listChoice: this.listChoice
        });
      }
    },
    selectBuilding(event, value) {
      if (event) {
        this.listChoice.push(value);
      } else {
        this.listChoice = this.listChoice.filter(x => x != value);
      }
    }
  },
  computed: {
    ...mapGetters(["getBuildingInfomation"]),
    ...mapGetters(["getBuildingLoading"])
  },
  async mounted() {
    this.fetchBuildingInfomation();
  }
};
</script>

<style>
</style>