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

export const DRAW = gql`
    mutation draw($number: Float!){
        draw(number: $number) {
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

export const PASS_TURN = gql`
    mutation passTurn {
        passTurn {
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

export const PLAY_CARD = gql`
    mutation playCard($index: Float!){
        playCard(index: $index) {
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

export const UPDATE_GAME = gql`
    subscription updateGame($id: String!){
        updateGame(id: $id) {
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