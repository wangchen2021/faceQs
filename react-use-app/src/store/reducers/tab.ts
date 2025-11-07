import { createSlice } from "@reduxjs/toolkit"

const tabSlice = createSlice({
    name: "tab",
    initialState: {
        collapsed: false
    },
    reducers: {
        collapseMenu: (state) => {
            state.collapsed = !state.collapsed
        }
    }
})

export const { collapseMenu } = tabSlice.actions
export default tabSlice.reducer