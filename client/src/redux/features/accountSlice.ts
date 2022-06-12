import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { connectWallet } from '../../api/tokens';
import { getHistory } from '../../api/contract-methods';
import Event from "../../api/Event";

export interface AccountState {
  isConnected: boolean,
  account: string | undefined,
  transactions: Event[]
}

export const connect = createAsyncThunk('account/connect', async () => {
    try {
        return await connectWallet();
    }
    catch (error) {
        if (error instanceof Error){
            console.log(error.message);
        }
    }

});

export const getTransactionHistory = createAsyncThunk('account/transactionHistory', async (account: string) => {
  try {
      return await getHistory(account);
  }
  catch (error) {
      if (error instanceof Error){
          console.log(error.message);
      }
  }

});

const initialState: AccountState = {
  isConnected: false,
  account: undefined,
  transactions: []
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<string | undefined>) => {
      state.account = action.payload
    },
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
    setTransactions: (state, action: PayloadAction<Event[]>) => {
      state.transactions = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(connect.fulfilled, (state, action) => {
      if (action.payload) {
        state.account = action.payload[0]
        state.isConnected = true
      }
    })
    builder.addCase(getTransactionHistory.fulfilled, (state, action) => {
      if (action.payload) {
        state.transactions = action.payload
      }
    })
  }
})

export const { setAccount, setIsConnected,  setTransactions} = accountSlice.actions

export default accountSlice.reducer

