<template>
    <div class="col-12 col-md-6 col-lg-4">
        <div class="card">
            <img src="..." class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">{{ trip.title }}</h5>
                <p class="card-text">{{ trip.departure_date }}</p>
            </div>
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