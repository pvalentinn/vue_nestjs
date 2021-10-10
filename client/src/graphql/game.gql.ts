import gql from "graphql-tag";

export const CREATE_GAME = gql`
    mutation createGame {
        createGame { lobby_id }
    }
`;

export const GET_GAME = gql`
    query getGame{
        game {
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
                user_login,
                left,
                cards {
                    color,
                    value
                }
            }
        }
    }
`