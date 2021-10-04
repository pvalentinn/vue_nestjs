import gql from "graphql-tag";

export const CREATE_GAME = gql`
    mutation createGame($lobby_id: String!){
        createGame(lobby_id: $lobby_id) {
            deck {
                color,
                value
            },
            pile {
                color,
                value
            }
            current_color,
            hands {
                user_id,
                cards {
                    color,
                    value
                }
            }
        }
    }
`