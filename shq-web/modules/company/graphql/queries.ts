import { gql } from "@apollo/client"

const shq = gql`
  query ShqGet {
    shqGet {
      _id
      structure
      vision
    }
  }
`

export default {
  shq
}
