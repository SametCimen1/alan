import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: [
    ],
    filteredValue: [
    ],
    topFive:[
    ]
  },
  reducers: {

    init: (state, action) => {
        state.value = action.payload
    },
    initFiltered: (state, action) => {
      state.filteredValue = action.payload
    },
    initTopFive: (state,action) => {
        state.topFive = action.payload
    }

  }
})

// Action creators are generated for each case reducer function
export const { init, initTopFive , initFiltered } = counterSlice.actions

export default counterSlice.reducer