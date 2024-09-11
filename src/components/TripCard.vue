<template>
    <div class="col-12 col-md-6 col-lg-4">
        <div class="card">
            <RouterLink :to="{ name: 'trips.show', params: { slug: trip.slug } }">
                <img :src="trip.image" class="card-img-top" :alt="trip.title">
                <div class="card-body">
                    <h5 class="card-title">{{ trip.title }}</h5>
                    <p class="card-text">{{ trip.departure_date }}</p>
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        trip: {
            type: Object,
            required: true
        }
    },
    data() {
        return {

        }
    },

}

</script>

<style lang="scss" scoped></style>