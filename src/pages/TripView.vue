<template>
    <div>
        <h1 class="pt-4 pb-3">{{ trip.title }}</h1>

        <div class="accordion" id="accordionExample">
            <div v-for="day in days" :key="day.id" class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        DAY {{ day.id }}
                    </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <ul class="list-group">

                            <li v-for="stop in day.stops" :key="stop.id">
                                <RouterLink :to="{ name: 'stops.show', params: { slug: stop.slug } }">
                                    <div class="list-group-item">{{ stop.title }}</div>
                                </RouterLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

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
    components: {

    },
    data() {
        return {
            store,
            trip: null,
            days: [],
            error: null,
        }
    },
    async created() {
        try {
            //get trip by slug
            this.trip = await store.getTripBySlug(this.slug)

            if (this.trip) {
                //get days by trip id
                this.days = await store.getDays(this.trip.id)

                //get stops by day id
                for (let day of this.days) {
                    day.stops = await store.getStops(day.id)
                }
                if (!this.days.length) {
                    this.error = 'No days found for this trip'
                }
            } else {
                this.error = 'Trip not found'
            }
        } catch (error) {
            console.error('Error loading trip:', error)
            this.error = 'Failed to load trip'
        }
    }
}
</script>

<style lang="scss" scoped></style>