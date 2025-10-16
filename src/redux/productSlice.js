import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "../services/productService";

export const fetchProducts = createAsyncThunk(
    "products/fetchAll",
    async (_, thunkAPI) => {
        try {
            return await getProducts();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const productSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        filtered: [],
        isLoading: false,
        error: null,
        search: "",
        category: "all",
        sort: "none",
    },
    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload;
            state.filtered = filterProducts(state);
        },
        setCategory: (state, action) => {
            state.category = action.payload;
            state.filtered = filterProducts(state);
        },
        setSort: (state, action) => {
            state.sort = action.payload;
            state.filtered = filterProducts(state);
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchProducts.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(fetchProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.items = action.payload;
            state.filtered = action.payload;
          });
    },

});

const filterProducts = (state) => {
    let filtered = [...state.items];

      // Search filter
    if (state.search) {
        filtered = filtered.filter((p) => 
        p.title.toLowerCase().includes(state.search.toLowerCase())
    );
    }

    // Category filter
  if (state.category !== "all") {
    filtered = filtered.filter((p) => p.category === state.category);
  }

  // Sort
  if (state.sort === "low-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sort === "high-low") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
};

export const { setSearch, setCategory, setSort } = productSlice.actions;
export default productSlice.reducer;



