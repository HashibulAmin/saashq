"use client"

import { ReactNode, useState } from "react"
import { useQuery } from "@apollo/client"
import { useSetAtom } from "jotai"

import { useToast } from "@/components/ui/use-toast"

import { setShqAtom } from "./JotaiProiveder"
import { queries } from "./auth/graphql"

const ShqProvider = ({ children }: { children: ReactNode }) => {
  const setShq = useSetAtom(setShqAtom)
  const [loadingConfigs, setLoadingConfigs] = useState(true)
  const { onError } = useToast()

  useQuery(queries.shqGets, {
    onCompleted: (data) => {
      setShq(data?.shqGet)
      setLoadingConfigs(false)
    },
    onError: (error) => {
      setLoadingConfigs(false)
      onError(error)
    },
  })

  if (loadingConfigs) {
    return <div />
  } else {
    return <>{children}</>
  }
}

export default ShqProvider
