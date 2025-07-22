import { createSlice } from "@reduxjs/toolkit";
// dung de luu du lieu banner va imageURL vao redux, de su dung cho banner/slider trong trang home

const initialState = {
    bannerData : [],
    imageURL : ""
}

export const movieSlice = createSlice({
    name: 'movie',
    initialState,
    reducers: {
        setBannerData: (state, action) => {
            state.bannerData = action.payload.map(item => ({
                ...item,
                media_type: item.media_type || (item.title ? "movie" : "tv") // Xác định media_type dựa trên dữ liệu
            }))
        },
        setImageURL : (state, action) => {
            state.imageURL = action.payload
        }
    }
})

export const { setBannerData, setImageURL } = movieSlice.actions

export default movieSlice.reducer