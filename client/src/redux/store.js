import { configureStore } from '@reduxjs/toolkit';
import featuresReducer from '../src/redux/featureSlice';

export default configureStore({
  reducer: {
    features: featuresReducer,
  },
});