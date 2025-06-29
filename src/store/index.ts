import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import projectReducer from './slices/projectSlice'
import issueReducer from './slices/issueSlice'
export const store = configureStore({
    reducer:{
        auth:authReducer,
        projects:projectReducer,
        issues:issueReducer
    },
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck:{
                ignoredActions:['persist/PERSIST']
            },
        })
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;