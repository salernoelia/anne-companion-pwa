<template>
    <NuxtLayout>

        <Card class="w-[350px]">
            <CardHeader>
                <CardTitle>Anne</CardTitle>
                <CardDescription>Check if you are connected to a device</CardDescription>
            </CardHeader>
            <CardContent>
                <code>{{ anneCheck }}</code>
            </CardContent>
            <CardFooter class="flex justify-center px-6 pb-6">

                <Button @click="checkForAnne">Check</Button>
            </CardFooter>
        </Card>
    </NuxtLayout>

</template>
<script setup lang="ts">



// Interface for AnneCheck
interface AnneCheck {
    environment: string;
    data: {
        status: string;
    };
}

// Reactive variable to store the check result
const anneCheck = ref<AnneCheck | null>(null);

/**
 * @brief Attempts to fetch the /ok endpoint from anne-wear.local and 192.168.4.1.
 */
async function checkForAnne() {
    console.log('Checking for Anne device...');

    // Define the URLs to check
    const urls = ['http://anne-wear.local/ok', 'http://192.168.4.1/ok', 'http://192.168.1.118/ok'];

    for (const url of urls) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Update the reactive variable with the successful response
            anneCheck.value = {
                environment: url.includes('anne-wear.local') ? 'local' : 'ap',
                data: data,
            };

            console.log(`Connected via ${anneCheck.value.environment} environment.`);
            return; // Exit the function after a successful fetch
        } catch (error: any) {
            console.error(`Error fetching from ${url}:`, error.message);
            // Continue to the next URL
        }
    }

    // If both fetch attempts fail
    anneCheck.value = {
        environment: 'none',
        data: {
            status: 'Failed to connect to Anne device.',
        },
    };
    console.warn('Unable to connect to Anne device on any known endpoints.');
}


</script>

<style scoped>
code {
    background-color: #f3f4f6;
    padding: 0.5rem;
    border-radius: 0.25rem;
    display: block;
    margin-top: 1rem;
    min-height: 5rem;
}
</style>