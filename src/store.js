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
    }
})