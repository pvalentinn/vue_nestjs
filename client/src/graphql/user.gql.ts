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