<template>
    <main>
        <table>
            <thead>
                <tr>
                    <th class="ready"></th>
                    <th class="username">Username</th>
                    <th class="action"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="player in props.players" :key="player._id">
                    <td>
                        <div class="state" :class="player.state == 'UNREADY' ? 'unready' : 'ready'"></div>
                    </td>
                    <td>
                        {{ player.login }}
                        <CrownSVG
                            class="crown"
                            v-if="player.roles.find((e: string) => e == 'Owner')"
                        />
                    </td>
                    <td :class="player._id == props.me?.sub && 'select'">
                        <button
                            v-if="player._id == props.me?.sub"
                            class="button"
                            @click="() => changeState()"
                        >Ready</button>
                    </td>
                    <LobbyLeaveSVG
                        class="quit"
                        v-if="player._id == props.me?.sub"
                        @click="() => leaveLobbyHandler()"
                    />
                    <KickOffSVG
                        class="quit kick_off"
                        v-if="(player._id != props.me?.sub) && props.me?.roles.find((e: string) => e == 'owner')"
                        @click="() => leaveLobbyHandler(player._id)"
                    />
                </tr>
                <tr v-for="i in 8 - props.players.length">
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <div
            class="countdown"
            v-if="props.players.length >= 2 && !props.players.find(p => p.state == 'UNREADY')"
        >{{ count }}</div>
    </main>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie'

import { UPDATE_STATE, UPDATE_TOKEN } from '../graphql/user.gql';
import { LEAVE_LOBBY } from '../graphql/lobby.gql';
import CrownSVG from './svg/CrownSVG.vue';
import KickOffSVG from './svg/KickOffSVG.vue';
import LobbyLeaveSVG from './svg/LobbyLeaveSVG.vue';

const { mutate: leaveLobby } = useMutation(LEAVE_LOBBY);
const { mutate: updateUserState } = useMutation(UPDATE_STATE);
const { mutate: updateToken } = useMutation(UPDATE_TOKEN);

let count = ref(5);
let router = useRouter();
let props = defineProps<{ players: any[], me: { sub: string, lobby: string, roles: string[], state: string } | null }>();
let emit = defineEmits(['update:me']);

updateToken({ token: Cookies.get('token') }).then(() => emit('update:me'));

let changeState = async (force: boolean = false) => {
    count.value = 5;
    try {
        let state = force ? "UNREADY" : props.me?.state == "unready" ? "READY" : "UNREADY";
        if (force && props.me!.state == "UNREADY") return;
        else {
            await updateUserState({ state });
        }
    } catch (e: any) {
        console.log("Error in changeStatus() : " + e.message);
    }
}

let leaveLobbyHandler = async (kicked_id?: string) => {
    try {
        if (kicked_id && !props.me?.roles.find(e => e == "owner")) {
            console.log('Not owner');
            return
        }

        if (kicked_id) await leaveLobby({ id: kicked_id });
        else {
            await leaveLobby();
            Cookies.remove('token');
            router.push({ name: "Home" });
        }
    } catch (e: any) {
        console.log("Error in leaveLobbyHandler() :" + e.message)
    }
}

window.addEventListener("beforeunload", () => { changeState(true) })
</script>

<style scoped>
main {
    width: 600px;
    margin-left: 25px;
}

tr {
    height: 75px;
}

tr:nth-child(2n + 2) {
    background-color: #242e39;
}

td {
    font-size: 1.2rem;
    color: white;
    padding: 10px 10px 0;
    position: relative;
    border: 1px solid #28333f;
}
td:before {
    color: #7a91aa;
    text-transform: uppercase;
    font-size: 1.4rem;
    padding-right: 10px;
    display: block;
}

table {
    width: calc(100% - 30px);
    background-color: #2c3845;
}

th {
    text-align: left;
    font-weight: 700;
}

thead th {
    background-color: #202932;
    color: #fff;
    border: 1px solid #202932;
}
.ready {
    width: 75px;
}

.action {
    width: 100px;
}

.button {
    margin: 0 auto;
}
.button {
    line-height: 1;
    display: inline-block;
    font-size: 1.2rem;
    text-decoration: none;
    border-radius: 5px;
    color: #fff;
    padding: 8px;
    background-color: #4b908f;
}

.select {
    /* padding-bottom: 20px; */
    border-bottom: 1px solid #28333f;
    text-align: center;
}
.crown {
    position: absolute;
    transform: translateY(-25%);
    right: 5px;
    height: 30px;
}
.quit {
    height: 40px;
    cursor: pointer;
    position: absolute;
    transform: translate(50%, 30%);
}

.kick_off {
    transform: translate(65%, 30%);
}

.state {
    /* margin: 15px; */
    margin-bottom: 10px;
    border-radius: 3px;
    width: 100%;
    height: 50px;
}

.state.unready {
    background-color: #b20000;
}

.state.ready {
    background-color: rgb(4, 148, 4);
}

@media (max-width: 720px) {
    .container {
        padding: 5px;
    }

    main {
        margin: unset;
    }

    table {
        width: 95%;
    }

    td,
    th {
        padding: 8px;
    }
    .ready {
        width: 50px;
    }

    .select {
        width: 60px;
        padding: unset;
        border: unset;
    }

    .button {
        padding: 6px;
    }

    .action {
        width: unset;
    }

    .quit {
        transform: unset;
        margin-top: 10px;
        right: 15px;
    }

    .kick_off {
        right: 10px;
    }
    .state {
        height: 35px;
    }
}

@media (max-width: 550px) {
    table {
        width: 90%;
    }

    td,
    th {
        padding: 6px;
    }
}

@media (max-width: 460px) {
    td {
        text-align: left;
    }

    td:before {
        display: inline-block;
        text-align: right;
        width: 140px;
    }

    .button {
        padding: 3px;
    }
}
</style>