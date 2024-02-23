"use client"

import { Provider, atom } from "jotai"

import { IShq, IUser } from "./auth/types"

export const currentUserAtom = atom<IUser | null>(null)

export const setCurrentUserAtom = atom(null, (get, set, update: IUser) => {
  set(currentUserAtom, update)
})

export const shqAtom = atom<IShq | null>(null)

export const setShqAtom = atom(null, (get, set, update: IShq) => {
  set(shqAtom, update)
})

const JotaiProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>
}

export default JotaiProvider
