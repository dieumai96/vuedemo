<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Select flat</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- <ul>
              <li v-for="(item,index) in distinctFlatByBlock" :key="index">{{item.block}}</li>
            </ul>-->
            <v-row>
              <v-col cols="12">
                <v-text-field label="Search" id="search-flat" single-line></v-text-field>
              </v-col>
              <v-col
                cols="12"
                v-for="(item,index) in (isSeaching ? dataSearchCache : distinctFlatByBlock)"
                :key="index"
              >
                <p class="block-name" :style="{'fontWeight' : 'bold'}">Block: {{item.block}}</p>
                <v-checkbox
                  class="abc"
                  :style="{'float' : 'left','marginRight' : '10px'}"
                  v-for="(flat,index1) in item.listFlat"
                  :key="index1"
                  :label="flat.soPhong"
                  v-model="flat.isChecked"
                  @change="selectFlat($event,flat)"
                ></v-checkbox>
                <div :style="{'clear' : 'both'}"></div>
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
import { fromEvent, of } from "rxjs";
import {
  map,
  distinctUntilChanged,
  filter,
  tap,
  switchMap,
  throttleTime
} from "rxjs/operators";
export default {
  name: "SelectFlat",
  props: {
    dialog: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      listChoice: [],
      isSeaching: false,
      dataSearchCache: []
    };
  },
  computed: {
    ...mapGetters(["getAllFlat", "distinctFlatByBlock", "getSearchCache"])
  },

  methods: {
    ...mapActions(["fetchFlats", "searchCache"]),
    closeModal(type) {
      if (type == "close") {
        this.$emit("callbackDialogFlat", {
          dialog: false
        });
      } else {
        this.$emit("callbackDialogFlat", {
          dialog: false,
          listChoice: this.listChoice
        });
      }
    },
    selectFlat(event, value) {
      if (event) {
        this.listChoice.push({
          id: value._id,
          soPhong: value.soPhong,
          block: value.block,
          isChecked: true
        });
      } else {
        this.listChoice = this.listChoice.filter(x => x.id != value._id);
      }
    }
  },
  async mounted() {
    this.fetchFlats();
    let input$ = document.querySelector("#search-flat");
    fromEvent(input$, "keyup")
      .pipe(
        map(event => event.target.value),
        throttleTime(300),
        distinctUntilChanged(),
        tap(x =>
          x.length > 0
            ? (this.isSeaching = true)
            : ((this.isSeaching = false),
              (this.dataSearchCache = this.distinctFlatByBlock))
        ),
        switchMap(payload => of(this.searchCache(payload)))
      )
      .subscribe(_ => {
        this.dataSearchCache = this.getSearchCache;
      });
  }
};
</script>

<style scoped>
span.block-name {
  font-weight: bold;
}
</style>