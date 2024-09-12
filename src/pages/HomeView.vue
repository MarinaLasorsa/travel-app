<template>
    <h1 class="pt-4 pb-2">I MIEI VIAGGI</h1>
    <div class="row">
        <TripCard v-for="trip in store.trips.value" :key="trip.id" :trip="trip" />

    </div>
</template>

<script>
import { store } from '../store.js';
import TripCard from '../components/TripCard.vue';

export default {
    components: {
        TripCard,
    },
    data() {
        return {
            store,
        }
    },
    mounted() {
        this.store.getTrips()
    }
}
</script>

<style lang="scss" scoped></style>