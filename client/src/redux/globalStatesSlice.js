import { createSlice } from '@reduxjs/toolkit'

export const globalStatesSlice = createSlice({
  name: 'globalStates',
  initialState: {
    featuresValue: false,
  },
  reducers: {
    setFeaturesState: (state, action) => {
      state.featuresValue = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setFeaturesState } = globalStatesSlice.actions

export default globalStatesSlice.reducer