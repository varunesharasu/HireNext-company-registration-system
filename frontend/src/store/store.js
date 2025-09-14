import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import companySlice from "./slices/companySlice"
import { ReturnType } from "react"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    company: companySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
