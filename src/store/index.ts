import Vue from "vue";
import Vuex from "vuex";

import searchBox from "./modules/searchBox";
import history from "./modules/history";
import searchResult from "./modules/searchResult";
import params from "./modules/params";
import options from "./modules/options";
import tracking from "./modules/tracking";
import dynamicData from "./modules/dynamicData";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  modules: {
    history,
    searchResult,
    params,
    searchBox,
    options,
    tracking,
    dynamicData,
  },
});
