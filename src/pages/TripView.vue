<template>
    <div v-if="trip">
        <div class="d-flex align-items-baseline">
            <h1 class="pt-4 me-4">{{ trip.title }}</h1>
            <a class="btn btn-primary" data-bs-toggle="offcanvas" href="#offcanvasUpdate" role="button"
                aria-controls="offcanvasUpdate">
                Modifica
            </a>
        </div>

        <div class="accordion my-3" id="accordionExample">
            <div v-for="(day, index) in days" :key="day.id" class="accordion-item">
                <h2 class="accordion-header" :id="'heading' + index">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        :data-bs-target="'#collapse' + index" aria-expanded="true" :aria-controls="'collapse' + index">
                        {{ calculateDate(index) }} - GIORNO {{ day.id }}
                    </button>
                </h2>
                <div :id="'collapse' + index" class="accordion-collapse collapse" :aria-labelledby="'heading' + index">
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

                                <div class="mb-4 row">
                                    <label for="image" class="col-md-4 col-form-label text-md-right">Foto di
                                        copertina</label>

                                    <div class="col-md-6">
                                        <input id="image" type="file" class="form-control" @change="onFileChange">
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
    <!-- Loading/Error states -->
    <div v-else-if="error">
        <p>{{ error }}</p>
    </div>
    <div v-else>
        <p>Loading trip details...</p>
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
            selectedFile: null,
        }
    },
    methods: {
        calculateDate(index) {

            // Ensure the departure_date is available and is in a valid format
            if (!this.trip.departure_date) {
                console.error('Error: departure_date is missing');
                return 'Invalid date';
            }

            //define date of first day as departure_date
            const departureDate = new Date(this.trip.departure_date);
            // Check if the date is valid
            if (isNaN(departureDate.getTime())) {
                console.error('Error: Invalid departure_date format');
                return 'Invalid date';
            }

            // Add `index` number of days to the departure date
            const newDate = new Date(departureDate);
            newDate.setDate(departureDate.getDate() + index);

            // Format the date
            return newDate.toLocaleDateString('en-GB'); // Format date to 'DD/MM/YYYY'
        },
        onFileChange(event) {
            const file = event.target.files[0]; // Access the first file in the input
            if (file) {
                console.log('File selected:', file.name); // Debugging log
                this.selectedFile = file; // Store the chosen file in selectedFile
            } else {
                console.log('No file selected'); // Debugging log
            }
        },
        async onUpdate() {
            try {
                console.log('Updating trip...'); // Debugging log

                // Define updates as the new values
                const updates = {
                    title: this.title,
                    departure_date: this.departure_date,
                };

                // Define the existing image URL
                let imageUrl = this.trip.image;

                // If a new file exists, upload it and get the URL
                if (this.selectedFile) {
                    // Debugging log
                    console.log('Deleting previous file...');
                    // If there's an existing image, delete it first
                    if (imageUrl) {
                        const oldImagePath = imageUrl.split('/').pop(); // Extract the file name
                        await store.deleteImage(`images/${oldImagePath}`);
                    }

                    console.log('Current timestamp:', Date.now());
                    // Debugging log
                    console.log('Generating unique name...');
                    // Generate a unique file name using timestamp and original name
                    const uniqueFileName = `${Date.now()}_${this.selectedFile.name}`;

                    // Debugging log
                    console.log('Uploading file...');
                    //upload the new image
                    imageUrl = await store.uploadImage(this.selectedFile, uniqueFileName);
                }

                updates.image = imageUrl;

                console.log('Updating trip in the database...', updates); // Debugging log

                // Call the update trip function
                await store.updateTrip(this.trip.id, updates);

                console.log('Trip updated!'); // Debugging log

                this.$nextTick(() => {
                    const offcanvasElement = document.getElementById('offcanvasUpdate');
                    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
                    if (offcanvasInstance) {
                        offcanvasInstance.hide(); // Close the offcanvas
                    }
                });

                // Refresh the page with the new data
                // window.location.reload();
            } catch (error) {
                console.error('Error updating trip:', error);
            }
        },
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