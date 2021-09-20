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
                login
            }
        }
    }
`;

export const JOIN_LOBBY = gql`
    mutation joinLobby($id: String!) {
        joinLobby(lobby_id: $id) {
            _id,
            players {
                _id,
                login
            }
        }
    }
`

export const LEAVE_LOBBY = gql`
    mutation leaveLobby {
        leaveLobby{
            _id,
            players {
                _id,
                login
            }
        }
    }
`

export const SUBSCRIPTION = gql`
    subscription updatePlayers($id: String!) {
        updatePlayers(id: $id) {
            players {
                _id,
                login
            }
        }
    }
`;