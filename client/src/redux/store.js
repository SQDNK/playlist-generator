import { configureStore } from '@reduxjs/toolkit';
import featuresReducer from './featuresSlice';
import globalsReducer from './globalStatesSlice';

export default configureStore({
  reducer: {
    features: featuresReducer,
    globalStates: globalsReducer,
  },
});