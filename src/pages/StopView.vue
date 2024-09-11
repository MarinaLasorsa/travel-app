<template>
    <div>
        <h1>{{ stop.title }}</h1>
        <h4>{{ stop.address }}</h4>
        <p>{{ stop.description }}</p>
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
            stop: null,
        }
    },
    async created() {
        try {
            //get stop by slug
            this.stop = await store.getStopBySlug(this.slug)
        } catch (error) {
            console.error('Error loading stop:', error)
            this.error = 'Failed to load stop'
        }
    }
}
</script>

<style lang="scss" scoped></style>