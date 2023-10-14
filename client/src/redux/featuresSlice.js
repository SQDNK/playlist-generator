import { createSlice } from '@reduxjs/toolkit'

export const featuresSlice = createSlice({
  name: 'features',
  initialState: {
    value: null,
  },
  reducers: {
    replaceUserInput: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { replaceUserInput } = featuresSlice.actions

export default featuresSlice.reducer