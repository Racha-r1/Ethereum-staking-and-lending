import { configureStore } from '@reduxjs/toolkit'
import CoinsReducer from './reducers/CoinsReducer'
import AccountReducer from './reducers/AccountReducer'

export const store = configureStore({
  reducer: {
    coins: CoinsReducer,
    account: AccountReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch