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
                    <td></td>
                    <td>{{ player.login }} <CrownSVG class='crown' v-if="player.roles.find((e: string) => e == 'owner')"/> </td>
                    <td :class="player._id == payload.sub && 'select'">
                        <button v-if="player._id == payload.sub" class="button" href="#">Select</button>
                    </td>
                    <LobbyLeaveSVG
                        class="quit"
                        v-if="player._id == payload.sub"
                        @click="leaveLobbyHandler"
                    />
                </tr>
                <tr v-for="i in n">
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </main>
</template>

<script setup lang='ts'>
import { defineProps } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie'

import LobbyLeaveSVG from './svg/LobbyLeaveSVG.vue';
import CrownSVG from './svg/CrownSVG.vue';
import { LEAVE_LOBBY } from '../graphql/lobby.gql';

const { mutate: leaveLobby } = useMutation(LEAVE_LOBBY);

let payload: any;

let token = Cookies.get('token');
if(token) payload = jwt_decode(token)

console.log(payload.roles);
let router = useRouter();
let props = defineProps<{ players: any[] }>();
let n = 8 - props.players.length;

let leaveLobbyHandler = async () => {
    try {
        await leaveLobby();
        Cookies.remove('token');
        router.push({ name: "Home" });
    } catch (e: any) {
        console.log(e.message)
    }
}

</script>

<style scoped>
main {
    max-width: 1200px;
    margin: 0 auto;
}

table,
tr,
td,
tbody,
tfoot {
    display: block;
    position: relative;
}

thead {
    display: none;
}

tr {
    padding-bottom: 10px;
    height: 60px;
}

tr:nth-child(2n + 2) {
    background-color: #242e39;
}

td {
    padding: 10px 10px 0;
    text-align: center;
}
td:before {
    color: #7a91aa;
    text-transform: uppercase;
    font-size: 1.4rem;
    padding-right: 10px;
    display: block;
}

table {
    width: calc(100% - 50px);
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
    padding-bottom: 20px;
    border-bottom: 1px solid #28333f;
    text-align: center;
}
.select:before {
    display: none;
}

.quit {
    height: 40px;
    cursor: pointer;
    position: absolute;
    transform: translate(50%, 30%);
}

.crown {
    float: right;
    height: 30px;
}

@media (min-width: 460px) {
    td {
        text-align: left;
    }
    td:before {
        display: inline-block;
        text-align: right;
        width: 140px;
    }

    .select {
        padding-left: 160px;
    }
}
@media (min-width: 720px) {
    table {
        display: table;
    }

    tr {
        display: table-row;
    }

    td,
    th {
        display: table-cell;
    }

    tbody {
        display: table-row-group;
    }

    thead {
        display: table-header-group;
    }

    td {
        border: 1px solid #28333f;
    }
    td:before {
        display: none;
    }

    td,
    th {
        padding: 10px;
    }

    .select {
        padding: 10px;
    }
}

@media (max-width: 720px) {
    tr {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 0;
    }

    tr > td {
        padding: unset;
        width: 100%;
        height: 50px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .select {
        padding: unset;
        border: unset;
    }

    .ready {
        width: unset;
    }

    .action {
        width: unset;
    }

    .quit {
        transform: unset;
        transform: translateY(0%);
        right: -50px;
    }
}
</style>