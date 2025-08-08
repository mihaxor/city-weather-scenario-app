import {createSlice} from '@reduxjs/toolkit'

const initialState = {value: 0} as { value: number | undefined }

export const citiesSlice = createSlice({
    name: 'cities',
    initialState: initialState,
    reducers: {
        updateCity: (state, action) => {
            state.value = action.payload
        }
    }
})

export const {updateCity} = citiesSlice.actions
export default citiesSlice.reducer;
