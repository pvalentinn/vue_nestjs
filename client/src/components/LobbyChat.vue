<template>
    <div class="chat">
        <div class="chat_body">
            <div 
                v-for="message in messages" 
                :key="message.id" 
                :class="message.sender == 'server' ? 'server' : message.sender_id == props.me?.sub ? 'message mine' : 'message else'"
            >
                <h4>{{ message.sender }}</h4>
                <span>{{ format(message.created_at) }}</span>
                <p>{{ message.text }}</p>
            </div>
        </div>
        <div class="chat_footer">
            <form @submit="sendMessage">
                <BeautifulInput v-model="text" label="Text here" class="darker" />
                <BeautifulSubmit button="Send" />
            </form>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from "vue";
import { format } from 'timeago.js';
import { useMutation, useQuery, useSubscription } from "@vue/apollo-composable";

import { ADD_MESSAGE, GET_CHAT, UPDATE_CHAT } from "../graphql/chat.gql";
import BeautifulInput from "./BeautifulInput.vue";
import BeautifulSubmit from "./BeautifulSubmit.vue";

let text = ref('');
let messages = ref<{ id: number, sender_id?: string, sender: string, text: string, created_at: Date }[]>([]);
let props = defineProps<{ me?: { sub: string, lobby: string, roles: string[] } | null, chat: string }>();

let { mutate: addMessage } = useMutation(ADD_MESSAGE);
let { onResult: getChat } = useQuery(GET_CHAT, { id: props.chat });
let { onResult: updateChat, onError: updateChatError } = useSubscription(UPDATE_CHAT, { lobby_id: props.me?.lobby });

let sendMessage = async (e: Event) => {
    e.preventDefault();
    try {
        await addMessage({ payload: { chat_id: props.chat, text: text.value } });
        text.value = '';
    } catch(e: any) {
        console.log("Error in sendMessage() :" + e.message)
    }
}

getChat((res) => {
    if (res.data != null) {
        messages.value = res.data.chat.messages
    } else {
        console.log("Error in retrieving Messages in query getChat", res)
    }
})

updateChat((res) => {
    if (res.data != null) {
        messages.value = res.data.updateChat.messages
    } else {
        console.log("Error in retrieving Messages in subscription updateChat", res)
    }
});

updateChatError((err) => console.log("Error in updateChat() :" + err.message));
</script>


<style scoped>
.chat {
    height: 60vh;
    width: 50%;
    border-top: 0.5px solid black;
    background-color: white;
    border-radius: 5px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
}

.chat_body {
    height: 100%;
    width: 100%;
    padding: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.server {
    align-self: center;
    display: flex;
}

.server > h4 {
    display: none;
}

.server > span {
    order: 2;
    color: gray;
    cursor: default;
    font-style: italic;
    user-select: none;
    -moz-user-select: none;
}

.server > p {
    margin-right: 5px;
    text-decoration: underline;
    font-style: italic;
    color: gray;
    cursor: default;
    user-select: none;
    -moz-user-select: none;
}

.message {
    padding: 10px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    width: 40%;
}

/* .message > h4 {
    
} */

.message > span {
    order: 3;
    user-select: none;
    -moz-user-select: none;
    font-style: italic;
    color: rgba(255, 255, 255, 0.955);
}

.message > p {
    order: 2;
    margin: 10px 0;
    word-break: break-word;
}

.mine {
    background: #1950a3;
    color: white;
    align-self: flex-end;
    text-align: end;
}

.else {
    background:#787878;
    color: white;
    align-self: flex-start;
    text-align: start;
}

.chat_footer {
    width: 100%;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
}

.darker {
    border-color: #7b7a7a;
}
</style>