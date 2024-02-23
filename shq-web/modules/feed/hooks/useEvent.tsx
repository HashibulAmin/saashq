import { useQuery } from "@apollo/client"

import { queries } from "../graphql"
import { IFeed } from "../types"

export interface IUsePosts {
  loading: boolean
  totalCount: number
  events: IFeed[]
  handleLoadMore: () => void
}

export const useEvents = (): IUsePosts => {
  const { data, loading, fetchMore } = useQuery(queries.feed, {
    variables: {
      contentTypes: "event",
      limit: 20,
      skip: 0,
    },
  })

  const handleLoadMore = () => {
    const feedLength = data.shqFeed.list.length || 0

    fetchMore({
      variables: {
        skip: feedLength,
      },
      updateQuery(prev, { fetchMoreResult }) {
        if (!fetchMoreResult) {
          return prev
        }

        const fetchedEvent = fetchMoreResult.shqFeed.list || []
        const prevEvent = prev.shqFeed.list || []

        if (fetchedEvent) {
          return {
            ...prev,
            shqFeed: {
              ...prev.shqFeed,
              list: [...prevEvent, ...fetchedEvent],
            },
          }
        }
      },
    })
  }

  const events = (data || {}).shqFeed ? (data || {}).shqFeed.list : []
  const totalCount = (data || {}).shqFeed ? (data || {}).shqFeed.totalCount : 0

  return {
    loading,
    handleLoadMore,
    events,
    totalCount,
  }
}
