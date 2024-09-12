<template>
    <main class="container">
        <RouterView />
    </main>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>

<style lang="scss" scoped>
main {
    flex-grow: 1;
    width: 100%;
    overflow-x: hidden;
}
</style>