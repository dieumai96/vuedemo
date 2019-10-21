<template>
  <div class="table-list">
    <v-progress-circular v-if="getFlatLoading" indeterminate color="primary"></v-progress-circular>
    <v-card>
      <v-card-title class="search-input">
        Flat
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          autocomplete="off"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          @keyup="onSearch"
        ></v-text-field>
        <div class="upload-btn-wrapper">
          <button class="btn">Upload file excel</button>
          <input type="file" accept=".xlsx" name="myfile" @change="onUploadFile($event)" />
        </div>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="filterLoading ? this.flatsFilter : getAllFlat"
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
    <CreateFlat
      v-if="dialogCreateFlat"
      :dialog="dialogCreateFlat"
      :modalHeader="modalHeader"
      :typeButton="typeButton"
      :updateFlatDto="updateFlatDto"
      @callbackDialog="callbackDialog($event)"
    />
    <CreateFromExcel
      v-if="diaLogCreateMultiFlat"
      :dialog="diaLogCreateMultiFlat"
      :dataFile="dataInportFromFile"
      @callbackDialog="diaLogCreateMultiFlat = $event"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { fromEvent, of, interval } from "rxjs";
import { getters } from "../../../../store/modules/flat";
import { locDau } from "./../../../../third-party/third-party";
import { eventBus } from "./../../../../main";
import CreateFlat from "./CreateFlat.vue";
import Swal from "sweetalert2";
import * as XLSX from "ts-xlsx";
import {
  map,
  debounceTime,
  filter,
  distinctUntilChanged,
  takeLast,
  take,
  switchMap,
  tap
} from "rxjs/operators";
import CreateFromExcel from "./CreateFromExcel.vue";
import uuid from "uuid";
export default {
  name: "Flat",
  computed: {
    ...mapGetters(["getAllFlat", "getFlatLoading"])
  },
  components: {
    CreateFlat,
    CreateFromExcel
  },
  created() {
    eventBus.$on("actionCreate", type => {
      if (type == "FLAT") {
        this.dialogCreateFlat = true;
        this.typeButton = "Add";
      }
    });
  },
  methods: {
    ...mapActions(["fetchFlats", "deleteFlat"]),

    deleteItem(i) {
      let body = {
        flatID: i._id
      };
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async result => {
        if (result.value) {
          await this.deleteFlat(body);
        }
      });
    },
    editItem(i) {
      this.dialogCreateFlat = true;
      this.typeButton = "Edit";
      this.updateFlatDto = i;
    },
    onSearch(event) {
      let a = document.getElementsByClassName("search-input");
      fromEvent(a, "keyup")
        .pipe(
          // tap(() => (filterLoading = true)),
          map(res => res.target.value),
          debounceTime(200),
          distinctUntilChanged(),
          take(1),
          tap(x =>
            !x.length
              ? (this.filterLoading = false)
              : (this.filterLoading = true)
          )
        )
        .subscribe(res => {
          this.flatsFilter = this.searchAll(this.getAllFlat, res);
        });
    },

    searchAll(list, payload) {
      return list.filter(
        x =>
          this.text(x.block).indexOf(this.text(payload)) != -1 ||
          this.text(x.soPhong).indexOf(this.text(payload)) != -1 ||
          this.text(x.code).indexOf(this.text(payload)) != -1 ||
          this.text(x.owerName).indexOf(this.text(payload)) != -1 ||
          this.text(x.phone).indexOf(this.text(payload)) != -1
      );
    },

    text(text) {
      return locDau(text.toLowerCase());
    },

    callbackDialog(event) {
      this.dialogCreateFlat = event.dialog;
    },

    onUploadFile(event) {
      this.dataInportFromFile = [];
      let target = event.target || event.srcElement;
      this.file = event.target.files[0];
      var listKey = [];
      if (this.file != null) {
        let fileReader = new FileReader();
        fileReader.onload = e => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for (var i = 0; i != data.length; ++i)
            arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, { type: "binary" });
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          this.dataInportFromFile = XLSX.utils.sheet_to_json(worksheet);

          // get all list block
          let temp = Array.from(new Set(this.getAllFlat.map(s => s.block))).map(
            block => {
              return {
                block: block
              };
            }
          );
          let listBlock = [];
          temp.forEach(element => {
            listBlock.push(element.block);
          });
          this.dataInportFromFile.forEach(async e => {
            e.id = uuid.v4();
            e.isValid = true;
            if (!listBlock.includes(e.block)) {
              e.isValid = false;
            }
            if (!e.soPhong || !e.block) {
              e.isValid = false;
            }
            this.getAllFlat.forEach(element => {
              if (
                element.block == e.block.trim() &&
                element.soPhong == e.soPhong.trim()
              ) {
                e.isValid = false;
              }
            });
          });
          this.dataInportFromFile = this.dataInportFromFile.sort(
            (a, b) => a.isValid - b.isValid
          );
          if (this.dataInportFromFile) {
            this.diaLogCreateMultiFlat = true;
          }
        };
        fileReader.readAsArrayBuffer(this.file);
      }
      target.value = "";
    }
  },
  filters: {
    tranformDate: function(value) {
      if (!value) {
        return "";
      } else {
        let stringDate = new Date(value);
        return moment(String(stringDate)).format("DD/MM/YYYY A");
      }
    }
  },

  async mounted() {
    this.fetchFlats();
  },
  data() {
    return {
      search: "",
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
        { text: "Code", value: "code" },
        { text: "Name", value: "owerName" },
        { text: "Phone", value: "phone" }
        // { text: "Time created", value: "timeCreated" }
      ],
      flatsFilter: [],
      filterLoading: false,
      dialogCreateFlat: false,
      modalHeader: "Add new flat".toUpperCase(),
      typeButton: "Add",
      updateFlatDto: {},
      dataInportFromFile: [],
      file: File,
      diaLogCreateMultiFlat: false
    };
  }
};
</script>

<style scoped>
.upload-btn-wrapper {
  margin-left: 10px;
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.btn {
  border: 2px solid gray;
  color: gray;
  background-color: white;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.upload-btn-wrapper input[type="file"] {
  height: 100px;
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>