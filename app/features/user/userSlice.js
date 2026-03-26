import { getCurrentUser } from "@/app/services/auth.service";
import { getProfileById } from "@/app/services/profile.service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("user/fetchUser", async (_, thunkAPI) => {
    try {
        const { data: userData, error: userError } = await getCurrentUser();
        if (userError) return thunkAPI.rejectWithValue(userError.message);
        if (!userData || !userData.user) return thunkAPI.rejectWithValue("User not found");
        const userId = userData.user.id;

        const { data: profileData, error: profileError } = await getProfileById(userId);
        if (profileError) return thunkAPI.rejectWithValue(profileError.message);
        if (!profileData) return thunkAPI.rejectWithValue("Profile not found");

        return {
            ...profileData,
            email: userData.user.email,
            id_card_image: null,
        };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || "Something went wrong");
    }
});

const userSlice = createSlice({
    name: "user",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearUser: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
