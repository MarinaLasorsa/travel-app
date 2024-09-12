import { ref, reactive } from 'vue'
import { supabase } from './lib/supabaseClient'


export const store = reactive({
    trips: ref([]),
    error: ref(null),

    // Fetch all trips
    async getTrips() {
        const { data, error: fetchError } = await supabase.from('trips').select()
        if (fetchError) {
            console.error('Error fetching trips:', fetchError)
            this.error.value = 'Error fetching trips'
        } else {
            console.log('Fetched trips:', data)
            this.trips.value = data
        }
    },

    //fetch trip by slug
    async getTripBySlug(slug) {
        const { data, error: fetchError } = await supabase.from('trips').select().eq('slug', slug).single()
        if (fetchError) {
            console.error('Error fetching trip by slug:', fetchError)
            this.error.value = 'Error fetching trip by slug'
            return null
        } else {
            console.log('Fetched trip by slug:', data)
            return data
        }
    },

    //fetch days by trip id
    async getDays(trip_id) {
        const { data, error: fetchError } = await supabase.from('days').select().eq('trip_id', trip_id)
        if (fetchError) {
            console.error('Error fetching days by trip_id:', fetchError)
            this.error.value = 'Error fetching days'
            return []
        } else {
            console.log('Fetched days by trip_id:', data)
            return data
        }
    },

    //fetch stops by day id
    async getStops(day_id) {
        const { data, error: fetchError } = await supabase.from('stops').select().eq('day_id', day_id)
        if (fetchError) {
            console.error('Error fetching stops by day_id:', fetchError)
            this.error.value = 'Error fetching stops'
            return []
        } else {
            console.log('Fetched stops by day_id:', data)
            return data
        }
    },

    //fetch stop by slug
    async getStopBySlug(slug) {
        const { data, error: fetchError } = await supabase.from('stops').select().eq('slug', slug).single()
        if (fetchError) {
            console.error('Error fetching stop by slug:', fetchError)
            this.error.value = 'Error fetching stop by slug'
            return null
        } else {
            console.log('Fetched stop by slug:', data)
            return data
        }
    },

    // Insert a new trip
    async insertTrip(trip) {
        const { data, error } = await supabase.from('trips').insert([trip])
        if (error) {
            console.error('Error inserting trip:', error)
        } else {
            console.log('Inserted trip:', data)
            await this.getTrips() // Refresh the trips list
        }
    },

    // Update an existing trip
    async updateTrip(id, updates) {
        const { data, error } = await supabase.from('trips').update(updates).eq('id', id)
        if (error) {
            console.error('Error updating trip:', error)
            this.error.value = 'Error updating trip'
        } else {
            console.log('Updated trip:', data)
            await this.getTrips() // Refresh the trips list
        }
    },

    // Delete a trip
    async deleteTrip(id) {
        const { data, error } = await supabase.from('trips').delete().eq('id', id)
        if (error) {
            console.error('Error deleting trip:', error)
        } else {
            console.log('Deleted trip:', data)
            await this.getTrips() // Refresh the trips list
        }
    },

    //delete an image from storage bucket trip-images
    async deleteImage(imagePath) {
        const { error } = await supabase.storage
            .from('trip-images')
            .remove([imagePath]);

        if (error) {
            console.error('Error deleting image:', error);
            this.error = 'Error deleting image';
        } else {
            console.log('Image deleted successfully');
        }
    },

    //upload an image in storage bucket trip-images
    async uploadImage(file, fileName) {
        console.log('Starting file upload:', fileName); // Debugging log
        const { data, error } = await supabase.storage
            .from('trip-images')
            .upload(`images/${fileName}`, file);

        if (error) {
            console.error('Error uploading image:', error);
            this.error = 'Error uploading image';
            return null;
        }

        console.log('File uploaded, retrieving public URL...'); // Debugging log

        // Get the public URL of the uploaded file
        const url = supabase.storage
            .from('trip-images')
            .getPublicUrl(data.path);

        console.log('Public URL generated:', url.data.publicUrl); // Debugging log

        return url.data.publicUrl;
    }
})