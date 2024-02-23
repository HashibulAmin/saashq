import { queries } from "../graphql"
import { useQuery } from "@apollo/client"

export interface IUseUserDetail {
  loading: boolean
  shq: any
}

export const useShq = (): IUseUserDetail => {
  const { data, loading } = useQuery(queries.shq)

  const shq = data ? data.shqGet : {}

  return {
    loading,
    shq
  }
}
