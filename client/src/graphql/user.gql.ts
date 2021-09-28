import gql from 'graphql-tag';

export const CREATE_USER = gql`
    mutation createUser ($input: CreateUserInput!) {
        createUser(createUserInput: $input) {
            _id
            login
        }
    }
`

export const REMOVE_USER = gql`
    mutation removeUser {
        removeUser {
            _id
        }
    }
`

export const UPDATE_TOKEN = gql`
    mutation updateToken($token: String!){
        updateToken(token: $token)
    }
`

export const UPDATE_STATE = gql`
    mutation updateState($state: UserState!) {
        updateUserState(state: $state){
            _id
        }
    }
`