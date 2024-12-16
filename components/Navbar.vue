<template>
    <div>
        <nav>
            <div class="nav-item">
                <NuxtLink to="/">

                    Install App
                </NuxtLink>

            </div>
            <div class="nav-item">
                <NuxtLink to="/dashboard">Dashboard</NuxtLink>
            </div>
            <div class="nav-item">
                <NuxtLink to="/settings">Settings</NuxtLink>
            </div>
        </nav>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
nav {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.nav-item {
    padding: 0.25rem;
    border-radius: 0.5rem;
}

/* Style for active links */
.router-link-active {
    color: #064fe0;
    /* background-color: #26437d; */

    div {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #163675;
        background-color: #0055ff;
    }
}
</style>
