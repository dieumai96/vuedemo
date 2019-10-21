<template>
  <div>
    <div :style="{'position': 'fixed','width': '100%','z-index': 99}" v-if="!hiddenLoader">
      <div class="loading-bar">
        <div class="percentage" :style="{'width' : percentage + '%'}"></div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { loaderService } from "./shared/loader";
export default {
  name: "App",
  components: {},
  data: () => ({
    percentage: 0,
    hiddenLoader: false
  }),
  created() {
    loaderService.getValue().subscribe(data => {
      if (data != null) {
        if (data == 100) {
          this.percentage = data;
          setTimeout(() => {
            this.hiddenLoader = true;
          }, 500);
        } else {
          this.hiddenLoader = false;
          this.percentage = data;
        }
      }
    });
  }
};
</script>
<style lang = "scss">
/* *{
    padding: 0;
    margin: 0;
  } */

.loading-bar {
  position: relative;
  height: 5px;
  overflow: hidden;
  /* border-bottom: 1px solid #ddd; */
  /* box-shadow: inset 0 1px 2px rgba($color: #000, $alpha: 0.4), 0 -1px 1px #fff,
    0 1px 0 #fff; */

  .percentage {
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    display: block;
    height: 100%;
    background-color: #162055;
    background-size: 30px 30px;
    background-image: linear-gradient(
      135deg,
      rgba($color: #fff, $alpha: 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba($color: #fff, $alpha: 0.15) 50%,
      rgba($color: #fff, $alpha: 0.15) 75%,
      transparent 75%,
      transparent
    );
    animation: animate-stripes 3s linear infinite;
  }
}

@keyframes animate-stripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 60px 0;
  }
}
body,
html {
  font-family: "Muli", sans-serif;
}
</style>
