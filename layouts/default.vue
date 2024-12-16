<template>
    <div>
        <slot class="page"></slot>
        <Navbar id="nav" />
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
#nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f3f4f6;
    padding: 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.page {
    overflow-y: scroll;
}
</style>