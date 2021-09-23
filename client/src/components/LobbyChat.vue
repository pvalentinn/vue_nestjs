<template>
    <div class="chat">
        <div class="chat_body">
            <div v-for="message in messages">{{ message.text }}</div>
        </div>
        <div class="chat_footer">
            <form>
                <BeautifulInput v-model="text" label="Text here" class="darker" />
                <BeautifulSubmit button="Send" />
            </form>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useQuery, useSubscription } from "@vue/apollo-composable";
import { ref } from "vue-demi";
import { GET_CHAT, UPDATE_CHAT } from "../graphql/chat.gql";
import BeautifulInput from "./BeautifulInput.vue";
import BeautifulSubmit from "./BeautifulSubmit.vue";

let props = defineProps<{ me?: { sub: string, lobby: string, roles: string[] } | null, chat: string }>();
console.log(props.me?.lobby, props);

let { onResult: getChat } = useQuery(GET_CHAT, { id: props.chat })
let { onResult: updateChat, onError } = useSubscription(UPDATE_CHAT, { lobby_id: props.me?.lobby });

let text = ref('');
let messages = ref<{ id: number, user_id: string, text: string, created_at: Date }[]>([]);

getChat((res) => {
    console.log(res);
    if (res.data != null) {
        messages.value = res.data.chat.messages
    }
})

updateChat((res) => {
    console.log(res);
    if (res.data != null) {
        messages.value = res.data.updateChat.messages
    }
});

onError((err) => {
    console.log(err);
})

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
.chat_footer {
    width: 100%;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
}

.darker {
    border-color: #7b7a7a;
}
</style>