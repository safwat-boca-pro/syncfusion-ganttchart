export const registerServiceWorker = async () => {
	if ("serviceWorker" in navigator) {
		try {
			// First, unregister any existing service workers
			const registrations = await navigator.serviceWorker.getRegistrations();
			// for (let registration of registrations) {
			// 	await registration.unregister();
			// 	console.log("Unregistered old service worker");
			// }

			// // Wait a moment before registering the new service worker
			// await new Promise(resolve => setTimeout(resolve, 1000));

			console.log("Registering new service worker...");
			if (navigator.serviceWorker) {
				const registration = await navigator.serviceWorker.register(
					"/ganttServiceWorker.js",
					{
						scope: "/",
					}
				);

				if (registration.installing) {
					console.log("Service worker installing");
				} else if (registration.waiting) {
					console.log("Service worker installed and waiting");
				} else if (registration.active) {
					console.log("Service worker active");
				}

				// Force update and activation
				registration.addEventListener("activate", () => {
					console.log("Service worker activated");
				});

				// Listen for any errors
				registration.addEventListener("error", error => {
					console.error("Service worker error:", error);
				});

				// Check if service worker is controlling the page
				if (navigator.serviceWorker.controller) {
					console.log("Page is being controlled by a service worker");
				} else {
					console.log("No service worker is controlling the page");
				}
			}
		} catch (error) {
			console.error("Service worker registration failed:", error);
		}
	} else {
		console.log("Service workers are not supported");
	}
};
