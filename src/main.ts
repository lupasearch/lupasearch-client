import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import { initTracking } from "./utils/tracking.utils";
import { TrackingOptions } from "./types/General";

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");

const options: TrackingOptions = {
  trackBase: true,
  trackSession: true,
  trackUser: true,
  analytics: {
    enabled: true,
    parentEventName: "LupaSearch",
    type: "debug",
  },
};

initTracking(options);
store.commit("options/setTrackingOptions", { options });
