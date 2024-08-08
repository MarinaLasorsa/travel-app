<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

const trips = ref([])
const error = ref(null)

// Fetch all trips
async function getTrips() {
  const { data, error: fetchError } = await supabase.from('trips').select()
  if (fetchError) {
    console.error('Error fetching trips:', fetchError)
    error.value = 'Error fetching trips'
  } else {
    console.log('Fetched trips:', data)
    trips.value = data
  }
}

// Insert a new trip
async function insertTrip(trip) {
  const { data, error } = await supabase.from('trips').insert([trip])
  if (error) {
    console.error('Error inserting trip:', error)
  } else {
    console.log('Inserted trip:', data)
    getTrips() // Refresh the trips list
  }
}

// Update an existing trip
async function updateTrip(id, updates) {
  const { data, error } = await supabase.from('trips').update(updates).eq('id', id)
  if (error) {
    console.error('Error updating trip:', error)
  } else {
    console.log('Updated trip:', data)
    getTrips() // Refresh the trips list
  }
}

// Delete a trip
async function deleteTrip(id) {
  const { data, error } = await supabase.from('trips').delete().eq('id', id)
  if (error) {
    console.error('Error deleting trip:', error)
  } else {
    console.log('Deleted trip:', data)
    getTrips() // Refresh the trips list
  }
}

onMounted(() => {
  getTrips()
})
</script>

<template>
  <div>
    <ul v-if="!error">
      <li v-for="trip in trips" :key="trip.id">
        {{ trip.title }}
        <button @click="deleteTrip(trip.id)">Delete</button>
      </li>
    </ul>
    <div v-else>
      {{ error }}
    </div>
    <div>
      <h3>Add New Trip</h3>
      <input v-model="newTrip.title" placeholder="Trip Title">
      <button @click="insertTrip(newTrip)">Add Trip</button>
    </div>
    <div>
      <h3>Update Trip</h3>
      <input v-model="updateTripData.id" placeholder="Trip ID">
      <input v-model="updateTripData.title" placeholder="New Title">
      <button @click="updateTrip(updateTripData.id, { title: updateTripData.title })">Update Trip</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newTrip: { title: '' },
      updateTripData: { id: '', title: '' }
    }
  }
}
</script>

<style>
ul {
  color: black;
}

button {
  margin-left: 10px;
}

input {
  margin: 5px;
}
</style>