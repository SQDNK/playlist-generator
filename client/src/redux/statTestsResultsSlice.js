import { createSlice } from '@reduxjs/toolkit'

export const statTestsResultsSlice = createSlice({
  name: 'statTestsResults',
  initialState: {
    value: null,
  },
  reducers: {
    replaceStatTestResults: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { replaceStatTestResults } = statTestsResultsSlice.actions

export default statTestsResultsSlice.reducer