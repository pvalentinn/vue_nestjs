import gql from "graphql-tag";

export const CREATE_GAME = gql`
    mutation createGame($lobby_id: String!){
        createGame(lobby_id: $lobby_id) { lobby_id }
    }
`;

export const GET_GAME = gql`
    query getGame($lobby_id: String!){
        game(lobby_id: $lobby_id) {
            current_color,
            pile {
                color,
                value
            },
            turn {
                user_id
            },
            hands {
                user_id,
                user_login
            }
        }
    }
`