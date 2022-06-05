import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import Coin from "../../api/Coin";
import { getTokens } from '../../api/tokens';

export interface CoinsState {
  coins: Coin[],
  currentCoin: Coin | undefined,
  gainers: Coin[],
  losers: Coin[],
  loading: boolean,
  currencyCode: string,
  showModal: boolean,
}

const initialState: CoinsState = {
  coins: [],
  currentCoin: undefined,
  gainers: [],
  losers: [],
  loading: true,
  currencyCode: 'usd',
  showModal: false
}

export const fetchCoins = createAsyncThunk('coins/fetchCoins', async (page: 1) => {
  try {
    return await getTokens(page);
  }
  catch (error) {
    if (error instanceof Error){
      console.log(error.message);
    }
  }

});

export const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setCoins: (state, action: PayloadAction<Coin[]>) => {
      state.coins = action.payload
    },
    setCurrentCoin: (state, action: PayloadAction<Coin>) => {
      state.currentCoin = action.payload
    },
    setGainers: (state, action: PayloadAction<Coin[]>) => {
      state.gainers = action.payload
    },
    setLosers: (state, action: PayloadAction<Coin[]>) => {
      state.losers = action.payload
    },
    setCurrencyCode: (state, action: PayloadAction<string>) => {
      state.currencyCode = action.payload
    },
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCoins.fulfilled, (state, action) => {
      state.coins = [...action.payload]
      state.loading = false;
    })

    builder.addCase(fetchCoins.pending, (state) => {
      state.loading = true;
    })
  },
})

// Action creators are generated for each case reducer function
export const { setCoins, setCurrentCoin, setGainers, setLosers, setCurrencyCode, setShowModal} = coinsSlice.actions

export default coinsSlice.reducer