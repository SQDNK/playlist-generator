import { createSlice } from '@reduxjs/toolkit'

export const featuresSlice = createSlice({
  name: 'features',
  initialState: {
    value: null,
  },
  reducers: {
    replace: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { replace } = featuresSlice.actions

export default featuresSlice.reducer