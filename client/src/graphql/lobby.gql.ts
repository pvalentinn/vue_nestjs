import gql from 'graphql-tag';

export const CREATE_LOBBY = gql`
    mutation createLobby {
        createLobby {
            _id
        }
    }
`