<template>
    <div>
        <div class="d-flex align-items-center">
            <h1 class="pt-4 pb-3 me-4">{{ trip.title }}</h1>
            <a class="btn btn-primary" data-bs-toggle="offcanvas" href="#offcanvasUpdate" role="button"
                aria-controls="offcanvasUpdate">
                Modifica
            </a>
        </div>

        <div class="accordion" id="accordionExample">
            <div v-for="day in days" :key="day.id" class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        GIORNO {{ day.id }}
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

        <!--offcanvas -->
        <div class="container">
            <div class="row">
                <div class="col">
                    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasUpdate"
                        aria-labelledby="offcanvasUpdateLabel">
                        <div class="offcanvas-header">
                            <h5 class="offcanvas-title" id="offcanvasUpdateLabel">Modifica viaggio</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"
                                id="close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <form @submit.prevent="onUpdate">

                                <div class="mb-4 row">
                                    <label for="title" class="col-md-4 col-form-label text-md-right">Titolo
                                        viaggio</label>

                                    <div class="col-md-6">
                                        <input id="title" type="text" class="form-control" v-model="title"
                                            autocomplete="title">
                                    </div>
                                </div>

                                <div class="mb-4 row">
                                    <label for="title" class="col-md-4 col-form-label text-md-right">Data di
                                        partenza</label>

                                    <div class="col-md-6">
                                        <input id="departure_date" type="date" class="form-control"
                                            v-model="departure_date" autocomplete="departure_date" autofocus>
                                    </div>
                                </div>



                                <div class="mb-4 row mb-0">
                                    <div class="col-md-6 offset-md-4">
                                        <button type="submit" class="btn btn-primary">
                                            Salva
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
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
            title: '',
            departure_date: '',
        }
    },
    methods: {
        async onUpdate() {
            try {
                //define updates as the new values
                const updates = {
                    title: this.title,
                    departure_date: this.departure_date,
                };
                //call the update trip function
                await store.updateTrip(this.trip.id, updates);

                this.$nextTick(() => {
                    const offcanvasElement = document.getElementById('offcanvasUpdate');
                    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
                    if (offcanvasInstance) {
                        offcanvasInstance.hide(); // Close the offcanvas
                    }
                });

                //refresh the page with the new data
                window.location.reload();

            } catch (error) {
                console.error('Error updating trip:', error);
            }
        }
    },
    async created() {
        try {
            //get trip by slug
            this.trip = await store.getTripBySlug(this.slug)

            if (this.trip) {

                //populate title and departure_date
                this.title = this.trip.title;
                this.departure_date = this.trip.departure_date;

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