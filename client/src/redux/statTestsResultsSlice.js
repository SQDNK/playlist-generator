import { createSlice } from '@reduxjs/toolkit'

export const statTestsResultsSlice = createSlice({
  name: 'statTestsResults',
  initialState: {},
  reducers: {
    replaceStatTestResults: (state, action) => {
      state.push(action.payload)
    },
  },
})

// Action creators are generated for each case reducer function
export const { replaceStatTestResults } = statTestsResultsSlice.actions

export default statTestsResultsSlice.reducer