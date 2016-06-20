import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql'

import * as PinterestAPI from '../pinterest/api'


let initialState = {
  authorized: false,
  boards: [],
  images: [],
}


const checkSession = function(){
  let authorized = PinterestAPI.checkSession()
  if(authorized === true){
    return Promise.resolve()
    .then(PinterestAPI.getBoards)
    .then(boards => {
      return {...initialState, authorized, boards}
    })
  }
  return Promise.resolve()
  .then(PinterestAPI.login)
  .then(boards => {
    authorized = true
    return {...initialState, authorized, boards}
  })
}


const getImages = function(boardId){
  //boardId = '286612032474624118'
  if(boardId === 'choose'){
    return []
  }
  return PinterestAPI.getPins(boardId)
  .then(images => {
    //console.log({images})
    return {images}
  })
}


const boardType = new GraphQLObjectType({
  name: 'Board',
  description: 'A Pinterest board',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
  })
})


const imageType = new GraphQLObjectType({
  name: 'Image',
  description: 'An image on a pin in a Pinterest board',
  fields: () => ({
    id: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    },
    pinUrl: {
      type: GraphQLString
    },
  })
})


const sessionType = new GraphQLObjectType({
  name: 'Session',
  description: 'A session using the Pinterest API',
  fields: () => ({
    authorized: {
      type: GraphQLBoolean
    },
    boards: {
      type: new GraphQLList(boardType),
    },
  })
})

const imagesType = new GraphQLObjectType({
  name: 'Images',
  description: 'Images in a board',
  fields: () => ({
    images: {
      type: new GraphQLList(imageType),
    },
  })
})

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    session: {
      type: sessionType,
      resolve: () => checkSession()
    },
    images: {
      type: imagesType,
      args: {
        boardId: {
          type: GraphQLString
        }
      },
      resolve: (root, {boardId}) => getImages(boardId)
      // resolve: () => getImages()
    }
  })
})

export const Schema = new GraphQLSchema({
  query: queryType
})


export default Schema
