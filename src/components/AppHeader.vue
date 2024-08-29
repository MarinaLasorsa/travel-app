<template>
    <div class="page-header py-3">
        <RouterLink :to="{ name: 'home' }">
            <div class="logo">JourneyJournal</div>
        </RouterLink>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>

<style lang="scss" scoped>
.page-header {
    background-color: bisque;

    .logo {
        font-size: 30px;
        text-align: center;
    }
}
</style>