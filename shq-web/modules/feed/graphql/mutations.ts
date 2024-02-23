import gql from "graphql-tag"

const commonVariables = `
  $title: String!
  $description: String
  $contentType: ContentType!
  $images: [JSON]
  $attachments: [JSON]
  $recipientIds: [String]
  $customFieldsData: JSON
  $eventData: ShqEventDataInput
  $createdAt: Date
  $departmentIds : [String]
  $branchIds: [String]
  $unitId: String
  $category: String
`

const commonParams = `
  title: $title
  description: $description
  contentType: $contentType
  images: $images
  attachments: $attachments
  recipientIds: $recipientIds
  customFieldsData: $customFieldsData
  eventData: $eventData
  createdAt: $createdAt
  departmentIds : $departmentIds
  branchIds: $branchIds
  unitId: $unitId
  category: $category
`

const addFeed = gql`
  mutation addFeed(${commonVariables}) {
    shqFeedAdd(${commonParams}) {
      _id
    }
  }
`

const editFeed = gql`
  mutation editFeed($_id: String! ${commonVariables}) {
    shqFeedEdit(_id: $_id ${commonParams}) {
      _id
    }
  }
`

const pinFeed = gql`
  mutation pinFeed($_id: String) {
    shqFeedToggleIsPinned(_id: $_id)
  }
`

const deleteFeed = gql`
  mutation deleteFeed($_id: String!) {
    shqFeedRemove(_id: $_id)
  }
`

const thankCommonVariables = `
  $description: String!
  $recipientIds: [String]!
`

const thankCommonParams = `
  description: $description
  recipientIds: $recipientIds
`

const addThank = gql`
  mutation addThank(${thankCommonVariables}) {
    shqThankAdd(${thankCommonParams}) {
      _id
    }
  }
`

const editThank = gql`
  mutation editThank($_id: String!, ${thankCommonVariables}) {
    shqThankEdit(_id: $_id, ${thankCommonParams}) {
      _id
    }
  }
`

const deleteThank = gql`
  mutation deleteThank($_id: String!) {
    shqThankRemove(_id: $_id)
  }
`

const chatAdd = gql`
  mutation chatAdd($name: String, $type: ChatType!, $participantIds: [String]) {
    chatAdd(name: $name, type: $type, participantIds: $participantIds) {
      _id
    }
  }
`

const chatEdit = gql`
  mutation chatEdit($_id: String!, $name: String, $featuredImage: JSON) {
    chatEdit(_id: $_id, name: $name, featuredImage: $featuredImage) {
      _id
    }
  }
`

const chatRemove = gql`
  mutation chatRemove($id: String!) {
    chatRemove(_id: $id)
  }
`

const chatMarkAsRead = gql`
  mutation chatMarkAsRead($id: String!) {
    chatMarkAsRead(_id: $id)
  }
`

const chatMessageAdd = gql`
  mutation chatMessageAdd(
    $chatId: String!
    $content: String!
    $relatedId: String
    $attachments: [JSON]
  ) {
    chatMessageAdd(
      chatId: $chatId
      content: $content
      relatedId: $relatedId
      attachments: $attachments
    ) {
      _id
    }
  }
`

const chatAddOrRemoveMember = gql`
  mutation chatAddOrRemoveMember(
    $id: String!
    $type: ChatMemberModifyType
    $userIds: [String]
  ) {
    chatAddOrRemoveMember(_id: $id, type: $type, userIds: $userIds)
  }
`

const chatMakeOrRemoveAdmin = gql`
  mutation chatMakeOrRemoveAdmin($id: String!, $userId: String!) {
    chatMakeOrRemoveAdmin(_id: $id, userId: $userId)
  }
`

const chatToggleIsPinned = gql`
  mutation chatToggleIsPinned($id: String!) {
    chatToggleIsPinned(_id: $id)
  }
`

const emojiReact = gql`
  mutation emojiReact(
    $contentId: String!
    $contentType: ReactionContentType!
    $type: String
  ) {
    emojiReact(contentId: $contentId, contentType: $contentType, type: $type)
  }
`

const commentAdd = gql`
  mutation commentAdd(
    $contentId: String!
    $contentType: ReactionContentType!
    $comment: String!
    $parentId: String
  ) {
    commentAdd(
      contentId: $contentId
      contentType: $contentType
      comment: $comment
      parentId: $parentId
    ) {
      _id
    }
  }
`

const commentRemove = gql`
  mutation commentRemove($_id: String!) {
    commentRemove(_id: $_id)
  }
`

const chatForward = gql`
  mutation chatForward(
    $chatId: String
    $userIds: [String]
    $content: String
    $attachments: [JSON]
  ) {
    chatForward(
      chatId: $chatId
      userIds: $userIds
      content: $content
      attachments: $attachments
    ) {
      _id
    }
  }
`

const eventGoingOrInterested = gql`
  mutation shqFeedEventGoingOrInterested(
    $id: String!
    $goingOrInterested: ShqGoingOrInterested!
  ) {
    shqFeedEventGoingOrInterested(
      _id: $id
      goingOrInterested: $goingOrInterested
    ) {
      _id
    }
  }
`

export default {
  addFeed,
  editFeed,
  deleteFeed,
  addThank,
  editThank,
  deleteThank,
  pinFeed,
  chatAdd,
  chatEdit,
  chatRemove,
  chatMarkAsRead,
  chatMessageAdd,
  chatAddOrRemoveMember,
  chatMakeOrRemoveAdmin,
  chatToggleIsPinned,
  emojiReact,
  commentAdd,
  commentRemove,
  chatForward,
  eventGoingOrInterested,
}
