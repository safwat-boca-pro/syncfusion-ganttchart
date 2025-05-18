// Service worker to intercept API calls for Gantt Chart
const PROJECTS_API = "http://localhost:3000/projects";
// Mock data for testing

// Install service worker
self.addEventListener("install", event => {
	console.log("Service Worker: Installing");
	// Force the waiting service worker to become the active service worker
	self.skipWaiting();
});

// Activate service worker
self.addEventListener("activate", event => {
	console.log("Service Worker: Activating");
	// Take control of all pages immediately
	event.waitUntil(clients.claim());
});

const parseUrlParams = url => {
	const params = {};
	const searchParams = new URLSearchParams(url.search);

	for (const [key, value] of searchParams.entries()) {
		// Decode the URL encoded parameters
		const decodedKey = decodeURIComponent(key);
		const decodedValue = decodeURIComponent(value);

		// Handle special cases
		switch (decodedKey) {
			case "$expand":
				// Parse expand parameters (ExpandingAction,8)
				const [action, depth] = decodedValue.split(",");
				params.expand = {
					action,
					depth: parseInt(depth),
				};
				break;
			case "$inlinecount":
				params.inlinecount = decodedValue;
				break;
			case "$filter":
				// Parse filter expression with GUID (parentID eq guid'8a831369-e5c3-4ef0-aced-78def7850d93')
				const filterMatch = decodedValue.match(/(\w+)\s+(\w+)\s+guid'([^']+)'/);
				if (filterMatch) {
					const [_, field, operator, guid] = filterMatch;
					params.filter = {
						field,
						operator,
						value: guid,
					};
				} else {
					// Handle regular filters (parentID eq null)
					const [field, operator, value] = decodedValue.split(" ");
					params.filter = {
						field,
						operator,
						value,
					};
				}
				break;
			case "IdMapping":
				params.idMapping = decodedValue;
				break;
			case "$top":
				params.top = parseInt(decodedValue);
				break;
			default:
				params[decodedKey] = decodedValue;
		}
	}

	return params;
};

// Intercept fetch requests
self.addEventListener("fetch", async event => {
	const url = new URL(event.request.url);
	const token = event.request.headers.get("Authorization");

	const params = parseUrlParams(url);
	console.log("URL Parameters:", params);

	// TODO: get page, skip params from SyncFusion request and apply to URLs

	const projectsURL =
		"https://dev-portal-api.include.com/includego/tenants/425db690-a10b-4199-b3ef-980be43413df/companies/debf08b8-85c2-4a99-891b-f752caa574f7/projects?&page[number]=1&page[size]=10&sort=project_name_lowercase";

	const tasksURL = `https://dev-portal-api.include.com/includego/tenants/425db690-a10b-4199-b3ef-980be43413df/companies/debf08b8-85c2-4a99-891b-f752caa574f7/tasks?page[number]=1&page[size]=100&sort=target_start_date&filter%5Bprojects_ids%5D=${params.filter.value}`;

	if (url.pathname.includes("/projects")) {
		console.log("Service Worker: Intercepting projects API call");

		// Parse and log URL parameters

		// Now you can use params.expand.action to know it's an expanding action
		// params.expand.depth tells you how deep to expand
		// params.filter.value gives you the project GUID to expand

		event.respondWith(
			fetch(projectsURL, {
				headers: {
					Authorization: `Bearer ${token.split(" ")[1]}`,
				},
			})
				.then(response => {
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					return response.clone().json();
				})
				.then(data => {
					return new Response(JSON.stringify(data), {
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
						},
					});
				})
				.catch(error => {
					console.error("Service Worker: Error fetching data:", error);
				})
		);
	}
});
