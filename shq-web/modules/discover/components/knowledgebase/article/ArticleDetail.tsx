"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { shqAtom } from "@/modules/JotaiProiveder"
import { useAtomValue } from "jotai"

import Loader from "@/components/ui/loader"

import { useDiscover } from "../../../hooks/useDiscover"
import CategoryList from "../category/CategoryList"
import SingleArticle from "./SingleArticle"

const CategoryDetail = () => {
  const shq = useAtomValue(shqAtom)

  const searchParams = useSearchParams()
  const categoryId = searchParams.get("catId")
  const articleId = searchParams.get("id")

  const { topics, loading } = useDiscover({ id: shq?.knowledgeBaseTopicId! })

  if (loading) {
    return (
      <div className="flex w-full h-[200px] justify-center">
        <Loader />
      </div>
    )
  }
  return (
    <div className="flex w-full justify-between">
      <CategoryList topics={topics} categoryId={categoryId!} />
      <SingleArticle articleId={articleId!} />
    </div>
  )
}

export default CategoryDetail
