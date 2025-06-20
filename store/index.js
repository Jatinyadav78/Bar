import { configureStore } from '@reduxjs/toolkit'
import formReducer from './formSlice';

const store = configureStore({
  reducer: {form:formReducer, heading:headingReducer},
})

export default store;

