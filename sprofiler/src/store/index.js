import Vue from 'vue'
import Vuex from 'vuex'

import { Storage } from '@capacitor/storage'
// import { forEach } from 'core-js/core/array'

async function putStorage (key, data) {
  // console.log(key + ' ' + data)
  await Storage.set({
    key: key,
    value: data
  })
}
async function appendStorage (key, data) {
  // console.log(key + ' ' + data)
  await Storage.push({
    key: key,
    value: data
  })
}

// JSON "get" example
async function getStorage (key) {
  const res = await Storage.get({ key: key })
  console.log(res)
  return res.value
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accent: 'white',
    // pressure data
    pressureArray: [[], []],
    pressureThresh: 35,
    // bt stuff
    deviceID: 0,
    // show debug tips
    debug: false,
    version: '0.2.1',
    //
    //
    //
    shotHistory: [
      // {
      //   name: 'Dummy shot',
      //   date: '04/22/21 : 11:07:30',
      //   uuid: 'a7d9g7afdsg6j',
      //   raiting: 4.5,
      //   favorite: false,
      //   notes: 'It was pretty ok',
      //   data: [[0, 0, 1, 2, 4, 6, 9, 5, 4, 3, 1, 1], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]]
      // }
    ]
  },
  mutations: {
    // array is [key, data]
    setState (state, array) {
      state[array[0]] = array[1]
    },
    appendPressure (state, data) {
      const date = new Date()
      const now = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      state.pressureArray[0].push(data)
      state.pressureArray[1].push(now)
    },
    saveShot (state, data) {
      state.shotHistory.push(data)
    }
  },
  actions: {
    // Update state from Storage

    initStorage ({ dispatch }) {
      console.log('updating state from storage..')
      dispatch('getFromStorage', [['accent'], ['deviceID']])
    },

    // storage related stuff
    getFromStorage ({ dispatch }, array) {
      array.forEach(item => {
        getStorage(item[0])
          .then(res => {
            console.log(res + 'aaaaa')
            const data = res || 0
            dispatch('_setState', [item[0], data])
            return data
          })
          .catch(err => {
            console.error(err)
          })
      })
    },

    // array is [key, data]
    _setState ({ commit }, array) {
      console.log('setting state with ' + array)
      commit('setState', array)
    },

    putData ({ dispatch }, array) {
      dispatch('_setState', array)
      putStorage(array[0], array[1])
    },

    appendRTPressure ({ commit, dispatch }, data) {
      commit('appendPressure', data)
      if (new Date().getSeconds() % 2 === 0) { dispatch('putData', ['pressureArray', this.state.pressureArray]) }
    },
    saveShot ({ commit }, data) {
      commit('saveShot', data)
      appendStorage('shotHistory', data)
    }
  },
  modules: {
  }
})
