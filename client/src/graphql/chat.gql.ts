import gql from "graphql-tag";

export const GET_CHAT = gql`
    query getChat($lobby_id: String!){
        chat(lobby_id: $lobby_id){
            messages {
                id,
                sender,
                sender_id,
                text,
                created_at
            }
        }
    }
`

export const ADD_MESSAGE = gql`
    mutation addMessage($payload: AddMessageInput!){
        addMessage(AddMessageInput: $payload) {
            messages {
                id,
                sender,
                sender_id,
                text,
                created_at
            }
        }
    }
`;

export const UPDATE_CHAT = gql`
    subscription updateChat($lobby_id: String!){
        updateChat(lobby_id: $lobby_id) {
            messages {
                id,
                sender,
                sender_id,
                text,
                created_at
            }
        }
    }
` 