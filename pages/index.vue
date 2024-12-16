<template>
    <NuxtLayout>
        <!-- Display PWA Offline Ready Status -->
        <div>Offline Ready: {{ $pwa?.offlineReady }}</div>

        <!-- Install PWA Button -->
        <div class="install-pwa">
            <button v-if="showInstallButton" @click="installPWA">Install App</button>
        </div>



        <!-- Main Application Page -->
        <NuxtPage />

        <!-- PWA Update Notification -->
        <div v-if="$pwa.needRefresh" class="pwa-update-notification">
            <span>New content available!</span>
            <button @click="$pwa.updateServiceWorker()">Reload</button>
        </div>

        <!-- PWA Offline Ready Notification -->
        <div v-if="$pwa.offlineReady" class="pwa-offline-ready">
            <span>App is ready to work offline.</span>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

// Access the PWA functionalities
const { $pwa } = useNuxtApp()

// Reactive variable to control the install button visibility
const showInstallButton = ref(false)

// Log PWA states when the component is mounted
onMounted(() => {
    if ($pwa.needRefresh) {
        console.log('New content available!')
    }
    if ($pwa.offlineReady) {
        console.log('App is ready to work offline.')
    }
    if ($pwa.showInstallPrompt) {
        showInstallButton.value = true
        console.log('Install prompt is available.')
    }

})

// Method to handle PWA installation
const installPWA = async () => {
    try {
        await $pwa.install()
        showInstallButton.value = false
        console.log('PWA Installed Successfully!')
    } catch (error) {
        console.error('PWA Installation failed:', error)
    }
}
</script>

<style lang="scss">
.parent {
    padding: 2rem;
    display: flex;
    position: absolute;
    inset: 0;
    justify-content: center;
    align-items: start;
}

.pwa-update-notification,
.pwa-offline-ready {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background-color: #333;
    color: #fff;
    padding: 1rem;
    border-radius: 8px;
}

.pwa-update-notification button {
    margin-left: 1rem;
    padding: 0.5rem 1rem;
    background-color: #4DBA87;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
}

.install-pwa {
    position: fixed;
    top: 20px;
    right: 20px;
}

.install-pwa button {
    padding: 0.5rem 1rem;
    background-color: #4DBA87;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
}
</style>
