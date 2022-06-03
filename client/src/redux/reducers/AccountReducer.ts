import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { connectWallet } from '../../api/tokens';

export interface AccountState {
  isConnected: boolean,
  account: string | undefined,
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

const initialState: AccountState = {
  isConnected: false,
  account: undefined,
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
    setAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(connect.fulfilled, (state, action) => {
      if (action.payload) {
        state.account = action.payload[0]
      }
    })
  }
})

// Action creators are generated for each case reducer function
export const { setAccount, setConnected } = accountSlice.actions

export default accountSlice.reducer

