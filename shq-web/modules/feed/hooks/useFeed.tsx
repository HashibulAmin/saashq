import { useQuery } from "@apollo/client"

import { queries } from "../graphql"
import { IFeed } from "../types"

export interface IUsePosts {
  loading: boolean
  feeds: IFeed[]
  feedsCount: number
  handleLoadMore: () => void
}

export const useFeeds = (contentType: string): IUsePosts => {
  const { data, loading, fetchMore } = useQuery(queries.feed, {
    variables: {
      contentTypes: [contentType],
      limit: 10,
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

        const fetchedShqFeed = fetchMoreResult.shqFeed.list || []

        const prevShqFeed = prev.shqFeed.list || []

        if (fetchedShqFeed) {
          return {
            ...prev,
            shqFeed: {
              ...prev.shqFeed,
              list: [...prevShqFeed, ...fetchedShqFeed],
            },
          }
        }
      },
    })
  }

  const feeds = (data || {}).shqFeed ? (data || {}).shqFeed.list : []
  const feedsCount = (data || {}).shqFeed ? (data || {}).shqFeed.totalCount : 0

  return {
    loading,
    feeds,
    feedsCount,
    handleLoadMore,
  }
}

export const FETCH_MORE_PER_PAGE: number = 20
