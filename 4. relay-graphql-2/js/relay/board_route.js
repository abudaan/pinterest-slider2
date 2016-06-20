import Relay from 'react-relay'

export default class BoardRoute extends Relay.Route {
  static queries = {
    kont: () => Relay.QL`
      query {
        images(boardId: $boardId)
      }
    `
  }
  static paramDefinitions = {
    boardId: {required: true}
  }
  static routeName = 'BoardRoute'
}