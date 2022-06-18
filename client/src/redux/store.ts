import { configureStore } from '@reduxjs/toolkit'
import CoinsReducer from './features/coinsSlice'
import AccountReducer from './features/accountSlice'


export const store = configureStore({
  reducer: {
    coins: CoinsReducer,
    account: AccountReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch