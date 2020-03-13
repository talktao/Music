const state = {
    nowMusicId: 0,
    songListInfo: {}
  }
  
  const mutations = {
    changeNowMusicId(state,newV){
      state.nowMusicId = newV
    },
    changeSongListInfo(state,newV){
      state.songListInfo = newV
    }
  }
  
  export default {
    state,
    mutations
  }
  