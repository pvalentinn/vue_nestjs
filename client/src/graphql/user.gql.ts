import gql from 'graphql-tag';

export const CREATE_USER = gql`
    mutation ($input: CreateUserInput!) {
        createUser(createUserInput: $input) {
            _id
            login
        }
    }

`