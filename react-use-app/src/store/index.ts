import { configureStore } from "@reduxjs/toolkit"
import tabSlice from "./reducers/tab"
export const store = configureStore({
    reducer: {
        tabSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;