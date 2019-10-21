<template>
  <v-row justify="center">
    <v-progress-circular v-if="getLoadingNotification" indeterminate color="primary"></v-progress-circular>

    <v-dialog v-model="dialog" class="main-model" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{modalHeader}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12">
                <v-text-field label="Tile*" v-model="title" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea label="Content*" required v-model="content"></v-textarea>
              </v-col>
              <v-col cols="12">
                <div class="upload-btn-wrapper">
                  <button class="btn">Upload a file</button>
                  <input
                    type="file"
                    accept=".xlsx, .xls, image/*, .doc, .docx, .ppt, .pptx, .txt, .pdf"
                    name="myfile"
                    @change="onChangeFile"
                    multiple
                  />
                </div>
              </v-col>
              <v-col cols="12">
                <ul class="list-files">
                  <li v-for="(item,index) in listFile" :key="index">
                    <span>{{item.file.name | textPipe}}</span> &nbsp;&nbsp;
                    <i
                      class="fa fa-times"
                      aria-hidden="true"
                      @click="removeFromList(item.id)"
                    ></i>
                  </li>
                </ul>
              </v-col>
              <v-col cols="12">
                <v-checkbox v-model="sendTo" :label="'Send to'"></v-checkbox>
                <v-select
                  v-if="sendTo"
                  :items="items"
                  v-model="selectScope"
                  :menu-props="{ top: true, offsetY: true }"
                  label="Select scope"
                  @change="changeScope"
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                v-if="notifyScope.refs && (notifyScope.type == 2 || notifyScope.type == 3) "
              >
                <span
                  class="title-choice"
                >List {{ notifyScope.type == 2 ? 'building' : 'flat'}} choice</span>
                <ul class="list-choice" v-if="notifyScope.type == 2">
                  <li class="item-li-3" v-for="(item,index) in notifyScope.refs" :key="index">
                    <span class="item-3">
                      {{item}}
                      <i
                        class="fa fa-times"
                        aria-hidden="true"
                        @click="notifyScope.refs.filter(x => x != item)"
                      ></i>
                    </span>
                  </li>
                </ul>
                <ul class="list-choice" v-if="notifyScope.type == 3">
                  <li class="item-li-3" v-for="(item,index) in notifyScope.refs" :key="index">
                    <span class="item-3">
                      {{item.block}} - {{item.soPhong}}
                      <i
                        class="fa fa-times"
                        aria-hidden="true"
                        @click="remove('flat',item)"
                      ></i>
                    </span>
                  </li>
                </ul>
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
    <SelectBuilding
      v-if="diaLogSelectBuilding"
      :dialog="diaLogSelectBuilding"
      @callbackDialog="callbackDialog($event)"
    />
    <SelectFlat
      v-if="diaLogSelectFlat"
      :dialog="diaLogSelectFlat"
      @callbackDialogFlat="callbackDialogFlat($event)"
    />
  </v-row>
</template>

<script>
import uuid from "uuid";
import SelectBuilding from "./SelectBuilding.vue";
import { Subject, of, forkJoin } from "rxjs";
import { takeUntil, map, tap, switchMap, concatMap } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { catchError } from "rxjs/operators";
import { Url } from "./../../../../config/apiUrl";
import { ServerConfig } from "./../../../../config/serverConfig";
import { mapActions, mapGetters } from "vuex";
import SelectFlat from "./SelectFlat.vue";
export default {
  name: "CreateNotification",
  components: {
    SelectBuilding,
    SelectFlat
  },
  data() {
    return {
      loading: false,
      listFile: [],
      selectScope: "",
      items: ["All", "Building", "Flat"],
      diaLogSelectBuilding: false,
      diaLogSelectFlat: false,
      title: "",
      content: "",
      priority: 2,
      sendTo: false,
      clearSub$: new Subject(),
      notifyScope: {}
    };
  },
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
    }
  },

  created() {},

  computed: {
    ...mapGetters(["getLoadingNotification"])
  },

  filters: {
    textPipe(args) {
      let length = args.length;
      let splice = "";
      if (length < 40) {
        splice = args;
      } else {
        splice = args.substr(0, 20) + "...";
      }
      return splice;
    }
  },
  methods: {
    ...mapActions(["createNotifications"]),
    async submit() {
      let body = {
        title: this.title,
        content: this.content,
        status: this.sendTo ? 2 : 1,
        priority: this.priority
      };
      if (this.sendTo) {
        switch (this.selectScope) {
          case "All": {
            this.notifyScope.type = 1;
            break;
          }
          case "Building": {
            break;
          }
          case "Flat": {
            break;
          }
        }
        body.notifyScope = this.notifyScope;
      }
      if (this.listFile.length) {
        let listFileResponse = [];
        this.loading = true;
        let list = [];
        this.listFile.forEach(e => {
          list.push(e.file);
        });
        let files$ = of(list);
        files$
          .pipe(
            map(files =>
              files.map(value => {
                let form = new FormData();
                form.append("files", value);
                return ajax({
                  method: "POST",
                  url: `${ServerConfig.API_ENDPOINT_FILE}/${Url.UPLOAD_FILE}`,
                  body: form
                }).pipe(
                  catchError(error => of(null)),
                  tap(res => {
                    if (res.response.success) {
                      listFileResponse.push(res.response.file.url);
                    }
                  })
                );
              })
            ),
            takeUntil(this.clearSub$),
            concatMap(values => forkJoin(...values))
          )
          .subscribe(async res => {
            body.file = listFileResponse;
            if (typeof body.notifyScope == "undefined") {
              delete body.notifyScope;
            }
            if (typeof body.file == "undefined") {
              delete body.file;
            }
            await this.createNotifications(body);
            this.closeModal();
          });
      } else {
        await this.createNotifications(body);
        this.closeModal();
      }
    },
    closeModal() {
      this.$emit("callbackDialog", {
        dialog: false
      });
    },
    callbackDialog(event) {
      this.diaLogSelectBuilding = event.dialog;
      $(".main-model").css("display", "block");
      if (event.listChoice) {
        this.notifyScope.refs = event.listChoice;
      }
    },

    callbackDialogFlat(event) {
      this.diaLogSelectFlat = event.dialog;
      $(".main-model").css("display", "block");
      if (event.listChoice) {
        this.notifyScope.refs = event.listChoice;
      }
    },

    onChangeFile(event) {
      let target = event.target || event.srcElement;
      for (var i = 0; i < event.target.files.length; i++) {
        this.listFile.push({
          id: uuid.v4(),
          file: event.target.files[i]
        });
      }
      target.value = "";
    },
    changeScope(e) {
      this.notifyScope.refs = [];
      switch (this.selectScope) {
        case "All": {
          break;
        }
        case "Building": {
          this.diaLogSelectBuilding = true;
          this.notifyScope.type = 2;
          $(".main-model").css("display", "none");
          break;
        }
        case "Flat": {
          this.notifyScope.type = 3;
          $(".main-model").css("display", "none");
          this.diaLogSelectFlat = true;
          break;
        }
        default: {
          break;
        }
      }
    },

    remove(type, item) {
      if (type == "buiding") {
        this.notifyScope.refs = this.notifyScope.refs.filter(x => x != item);
      }
      if (type == "flat") {
        this.notifyScope.refs = this.notifyScope.refs.filter(
          x => x.id != item.id
        );
      }
    },

    removeFromList(id) {
      this.listFile = this.listFile.filter(x => x.id != id);
    }
  },
  destroyed() {
    this.clearSub$.next(true);
    this.clearSub$.complete();
  }
};
</script>

<style scoped lang = "scss">
.upload-btn-wrapper {
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
.list-files {
  list-style: none;
  li {
    span {
      font-family: "Muli", sans-serif;
      font-size: 16px;
    }
    i {
      color: red;
      cursor: pointer;
    }
  }
}
span.title-choice {
  font-size: 16px;
  color: rgb(26, 23, 23);
  font-weight: bold;
}
.list-choice {
  list-style: none;
  margin-top: 10px;
  li {
    font-weight: 600;
    margin-bottom: 10px;
    span.item-3 {
      padding: 4px 10px;
      background: #5d66dd;
      border-radius: 15px;
      color: #fff;
    }
    &.item-li-3 {
      float: left;
      margin-right: 10px;
      i {
        color: #191717;
        cursor: pointer;
      }
    }
  }
}
</style>