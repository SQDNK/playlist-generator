import { createSlice } from '@reduxjs/toolkit'

export const globalStatesSlice = createSlice({
  name: 'globalStates',
  initialState: {
    featuresValue: false,
    statsValue: false
  },
  reducers: {
    setFeaturesState: (state, action) => {
      state.featuresValue = action.payload
    },
    setStatsState: (state, action) => {
      state.statsValue = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setFeaturesState, setStatsState } = globalStatesSlice.actions

export default globalStatesSlice.reducer