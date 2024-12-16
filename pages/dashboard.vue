<template>
    <NuxtLayout>
        <div class="flex flex-col items-center space-y-6">
            <!-- Anne Configuration Card -->
            <Card v-if="anneCheck?.available" class="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Device ID: {{ anneCheck.data.deviceName }}</CardTitle>
                </CardHeader>
                <CardContent class="flex justify-center px-6 pb-6">
                    <img class="h-80 object-contain" src="/anne.png" alt="Anne Device" />
                </CardContent>
                <CardFooter class="flex flex-col justify-center px-6 pb-6">
                    <form @submit.prevent="updateConfig" class="space-y-4">
                        <h2 class="text-lg font-semibold">Update Configuration</h2>
                        <Input v-model="formData.deviceName" label="Device ID" required />
                        <Input v-model="formData.ssid" label="SSID" required />
                        <Input v-model="formData.password" label="Password" type="password" required />
                        <Input v-model="formData.ipaddress" label="IP Address" required />

                        <Button :disabled="isUpdating" class="w-full">
                            <span v-if="isUpdating">Updating...</span>
                            <span v-else>Update Configuration</span>
                        </Button>
                    </form>
                    <div v-if="updateMessage" :class="messageClass">
                        {{ updateMessage }}
                    </div>
                </CardFooter>
            </Card>


            <!-- Anne Status Card -->
            <Card class="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Anne</CardTitle>
                    <CardDescription>Check if Anne can be connected to.</CardDescription>
                </CardHeader>
                <CardContent>
                    <pre>{{ anneCheck }}</pre>
                </CardContent>
                <CardFooter class="px-6 pb-6 flex flex-col items-center space-y-4">
                    <Button @click="checkForAnne" :disabled="isChecking">
                        <span v-if="isChecking">Checking...</span>
                        <span v-else>Check</span>
                    </Button>
                    <div v-if="statusMessage" :class="messageClass">
                        {{ statusMessage }}
                    </div>
                </CardFooter>
            </Card>
            <div class="h-16"></div>
        </div>
    </NuxtLayout>
</template>

<script setup lang="ts">
interface AnneCheck {
    environment: string;
    data: {
        deviceID?: string;
        deviceName?: string;
        ssid?: string;
        password?: string;
        ipaddress?: string;
    };
    available: boolean;
    url?: string;
}

const anneCheck = ref<AnneCheck | null>(null);

const formData = reactive({
    deviceID: '',
    deviceName: '',
    ssid: '',
    password: '',
    ipaddress: '',
});

const isChecking = ref(false);
const isUpdating = ref(false);
const statusMessage = ref('');
const updateMessage = ref('');
const messageClass = computed(() => {
    return {
        'text-green-500': statusMessage.value === 'Anne is connected!' || updateMessage.value === 'Configuration updated successfully.',
        'text-red-500': statusMessage.value.startsWith('Error') || updateMessage.value.startsWith('Failed'),
    };
});


async function checkForAnne() {
    isChecking.value = true;
    statusMessage.value = '';
    anneCheck.value = null;

    const urls = [
        'http://192.168.1.118/status',
        'http://anne-wear.local/status',
        'http://192.168.4.1/status',
    ];

    for (const url of urls) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            anneCheck.value = {
                environment: url.includes('anne-wear.local') ? 'local' : 'ap',
                data: data as AnneCheck['data'],
                available: true,
                url,
            };

            // Populate form data with fetched data
            formData.deviceName = anneCheck.value.data.deviceName || '';
            formData.ssid = anneCheck.value.data.ssid || '';
            formData.password = anneCheck.value.data.password || '';
            formData.ipaddress = anneCheck.value.data.ipaddress || '';

            statusMessage.value = 'Anne is connected!';
            console.log(`Connected via ${anneCheck.value.environment} environment.`);
            isChecking.value = false;
            return;
        } catch (error: any) {
            console.error(`Error fetching from ${url}:`, error.message);
            // Continue to the next URL
        }
    }

    anneCheck.value = {
        environment: 'none',
        data: {
            deviceID: 'N/A',
            ssid: 'N/A',
            password: 'N/A',
            ipaddress: 'N/A',
        },
        available: false,
    };
    statusMessage.value = 'Unable to connect to Anne device on any known endpoints.';
    console.warn('Unable to connect to Anne device on any known endpoints.');
    isChecking.value = false;
}

async function updateConfig() {
    if (!anneCheck.value?.url) {
        updateMessage.value = 'No URL available to update configuration.';
        return;
    }

    const configureUrl = anneCheck.value.url.replace('/status', '/configure');

    console.log('Updating configuration:', formData, 'to', configureUrl);

    isUpdating.value = true;
    updateMessage.value = '';

    try {
        const formBody = new URLSearchParams();
        formBody.append('ssid', formData.ssid);
        formBody.append('password', formData.password);
        formBody.append('deviceName', formData.deviceName);
        formBody.append('ipaddress', formData.ipaddress);

        const response = await fetch(configureUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody.toString(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
        }

        updateMessage.value = 'Configuration updated successfully. The device is rebooting...';
        console.log('Configuration updated successfully.');

        setTimeout(() => {
            checkForAnne();
        }, 5000);
    } catch (error: any) {
        updateMessage.value = `Error updating configuration: ${error.message}`;
        console.error(`Error updating configuration:`, error.message);
    } finally {
        isUpdating.value = false;
    }
}

// Initial check when component mounts
onMounted(() => {
    checkForAnne();
});
</script>

<style scoped>
pre {
    background-color: #f3f4f6;
    padding: 0.75rem;
    border-radius: 0.25rem;
    overflow-x: auto;
}

.text-green-500 {
    color: #16a34a;
}

.text-red-500 {
    color: #dc2626;
}
</style>
