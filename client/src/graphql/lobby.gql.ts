import gql from 'graphql-tag';

export const CREATE_LOBBY = gql`
    mutation createLobby {
        createLobby {
            _id
        }
    }
`

export const GET_LOBBY = gql`
    query getLobby($id: String!){
        lobby(id: $id){
            capacity,
            players {
                _id,
                login,
                roles,
                state
            },
            chat {
                _id
            }
        }
    }
`;

export const JOIN_LOBBY = gql`
    mutation joinLobby($id: String!) {
        joinLobby(lobby_id: $id) {
            _id
        }
    }
`

export const LEAVE_LOBBY = gql`
    mutation leaveLobby {
        leaveLobby{
            _id
        }
    }
`

export const KICK_LOBBY = gql`
    mutation kickLobby($id: String!) {
        kick(id: $id){
            _id
        }
    }
`

export const UPDATE_LOBBY = gql`
    subscription updateLobby($id: String!) {
        updateLobby(id: $id) {
            players {
                _id,
                login,
                roles,
                state
            }
        }
    }
`;
