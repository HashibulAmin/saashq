export const types = () => {
  return `
    extend type User @key(fields: "_id") {
      _id: String! @external
    }
    
    type ShqCeremonyData {
      startedDate: Date
      willDate: Date
      howManyYear: Int
      year: Int
    }

    type ShqEventData {
      visibility: String
      where: String
      startDate: Date
      endDate: Date
      interestedUserIds: [String]
      goingUserIds: [String]
    }

    type ShqFeed {
      _id: String
      title: String
      description: String
      contentType: String
      visibility: String
      department: String
      category: String
      departmentIds: [String]
      branchIds: [String]
      unitId: String
      where: String
      startDate: Date
      endDate: Date
      commentCount: Int
      likeCount: Int
      heartCount: Int
      isHearted: Boolean
      isLiked: Boolean
      isPinned: Boolean
      images: JSON
      attachments: JSON
      recipientIds: [String]
      recipients: [User]
      createdAt: Date
      updatedAt: Date
      createdUser: User
      updatedUser: User
      customFieldsData: JSON
      ceremonyData: ShqCeremonyData
      eventData: ShqEventData
      eventGoingUsers: [User]
      eventInterestedUsers: [User]
      background: JSON
    }

    type ShqThank {
      _id: String
      description: String
      recipients: [User]
      recipientIds: [String]
      createdAt: Date
      updatedAt: Date
      createdUser: User
    }

    type ShqFeedResponse {
      list: [ShqFeed]
      totalCount: Int
    }

    type ShqThankResponse {
      list: [ShqThank]
      totalCount: Int
    }

    type ShqFeedEventsResponse{
      goingEvents: [ShqFeed]
      interestedEvents: [ShqFeed]
    }

    enum SourceType {
      recipient
      createdByMe
      admin
    }

    enum ContentType {
      event
      post
      bravo
      birthday
      workAnniversary
      publicHoliday
      welcome
    }

    enum RecipientType {
      recieved
      sent
    }

    enum FilterType {
      today
      upcoming
    }

    input ShqEventDataInput {
      visibility: String
      where: String
      startDate: Date
      endDate: Date
    }

    enum ShqGoingOrInterested {
      going
      interested
      neither
    }
  `;
};

const commonSelector = `
  branchIds: [String]
  departmentIds: [String]
  unitId: String
`;

export const queries = `
  shqFeedDetail(_id: String!): ShqFeed
  shqFeed(contentTypes: [ContentType],category: String, isPinned: Boolean, type: SourceType, recipientType: RecipientType, title: String, limit: Int, skip: Int, startDate : String, endDate : String, bravoType : String, ${commonSelector}): ShqFeedResponse
  shqThanks(limit: Int, skip: Int, type: SourceType): ShqThankResponse
  shqFeedCeremonies(contentType: ContentType, filterType: FilterType): ShqFeedResponse
  shqFeedEventsByUser(userId: String): ShqFeedEventsResponse
  `;

const feedCommonParams = `
  title: String!
  description: String
  contentType: ContentType!
  images: [JSON]
  attachments: [JSON]
  recipientIds: [String]
  eventData: ShqEventDataInput
  customFieldsData: JSON
  isPinned: Boolean
  createdAt: Date
  departmentIds: [String]
  department: String
  unitId: String
  branchIds: [String]
  category: String
  background: JSON
`;

const thankCommonParams = `
  description: String!
  recipientIds: [String]!
`;

export const mutations = `
  shqFeedAdd(${feedCommonParams}): ShqFeed
  shqFeedEdit(_id: String, ${feedCommonParams}): ShqFeed
  shqFeedRemove(_id: String!): JSON

  shqThankAdd(${thankCommonParams}): ShqThank
  shqThankEdit(_id: String, ${thankCommonParams}): ShqThank
  shqThankRemove(_id: String!): JSON

  shqFeedToggleIsPinned(_id: String): Boolean

  shqFeedEventGoingOrInterested(_id: String!, goingOrInterested: ShqGoingOrInterested!): ShqFeed
`;
