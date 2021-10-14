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
`;

export const DRAW_CARD = gql`
    mutation drawCard {
        drawCard {
            current_color
        }
    }
`
export const PLAY_CARD = gql`
    mutation playCard($index: Float!, $color: String)  {
        playCard(index: $index, color: $color) {
            current_color
        }
    }
`

export const UPDATE_GAME = gql`
    subscription updateGame($id: String!, $user_id: String!){
        updateGame(id: $id, user_id: $user_id) {
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