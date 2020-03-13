import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import common from './modules/common'
import music from './modules/music'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules:{
    common,
    music
  },
  getters
})

export default store
