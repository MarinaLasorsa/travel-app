<template>
    <div>
        <h1>STOP</h1>
    </div>
</template>

<script>
import { store } from '../store.js';

export default {
    props: {
        slug: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            store,
        }
    },
}
</script>

<style lang="scss" scoped></style>