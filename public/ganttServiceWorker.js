// Service worker to intercept API calls for Gantt Chart
const PROJECTS_API = "http://localhost:3000/projects";
// Mock data for testing

// Install service worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing");
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate service worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating");
  // Take control of all pages immediately
  event.waitUntil(clients.claim());
});

const parseUrlParams = (url) => {
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
      case "$skip":
        params.skip = parseInt(decodedValue);
        break;
      default:
        params[decodedKey] = decodedValue;
    }
  }

  return params;
};

// Intercept fetch requests
self.addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);
  const token = event.request.headers.get("Authorization");

  // TODO: get page, skip params from SyncFusion request and apply to URLs

  const projectsURL = (pageNumber = 1, pageSize = 5) =>
    `https://dev-portal-api.include.com/includego/tenants/425db690-a10b-4199-b3ef-980be43413df/companies/debf08b8-85c2-4a99-891b-f752caa574f7/projects?&page[number]=${pageNumber}&page[size]=2&sort=project_name_lowercase`;

  const tasksURL = (projectId) =>
    `https://dev-portal-api.include.com/includego/tenants/425db690-a10b-4199-b3ef-980be43413df/companies/debf08b8-85c2-4a99-891b-f752caa574f7/tasks?page[number]=1&page[size]=100&sort=target_start_date&filter%5Bprojects_ids%5D=${projectId}`;

  if (url.pathname.includes("/projects")) {
    const params = parseUrlParams(url);

    let pageNumber = 1;
    let pageSize = 2;

    if (params.top) {
      pageSize = params.top;
    }
    if (params.skip !== undefined && params.top) {
      pageNumber = Math.floor(params.skip / params.top) + 1;
    } else if (params.skip !== undefined && !params.top) {
      console.warn(
        "Service Worker: $skip parameter found without $top. Defaulting to page 1."
      );
    }

    event.respondWith(
      fetch(projectsURL(pageNumber, pageSize), {
        headers: {
          Authorization: `Bearer ${token.split(" ")[1]}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `HTTP error! status: ${response.status} fetching projects`
            );
          }
          return response.json();
        })
        .then((projectsData) => {
          const allProjectsOriginal = projectsData.data;
          const meta = projectsData.meta;

          // Case 1: Collapsing a project
          if (
            params.expand?.action === "CollapsingAction" &&
            params.filter?.field === "parentID"
          ) {
            const collapsedProjectId = params.filter.value;
            
            // Find only the project being collapsed
            const collapsedProject = allProjectsOriginal.find(
              (project) => project.id === collapsedProjectId
            );
            
            if (collapsedProject) {
              // Return only the collapsed project with IsExpanded=false
              const projectWithState = {
                ...collapsedProject,
                attributes: {
                  ...collapsedProject.attributes,
                  IsExpanded: false,
                },
              };
              const result = { data: [projectWithState], meta };
              console.log("Collapsing result", result);
              return new Response(JSON.stringify(result), {
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                },
              });
            }
          }
          // Case 2: Expanding a project
          else if (
            params.expand?.action === "ExpandingAction" &&
            params.filter?.field === "parentID"
          ) {
            const parentProjectIdToExpand = params.filter.value;
            return fetch(tasksURL(parentProjectIdToExpand), {
              headers: { Authorization: `Bearer ${token.split(" ")[1]}` },
            })
              .then((response) => {
                if (!response.ok)
                  throw new Error(
                    `HTTP error! status: ${response.status} fetching tasks`
                  );
                return response.json();
              })
              .then((tasksDataForParent) => {
                // When expanding, only return the expanded project and its tasks
                const finalItems = [];
                
                // Find the project being expanded
                const expandingProject = allProjectsOriginal.find(
                  (project) => project.id === parentProjectIdToExpand
                );
                
                if (expandingProject) {
                  // Add only the expanding project with IsExpanded=true
                  const projectWithState = {
                    ...expandingProject,
                    attributes: {
                      ...expandingProject.attributes,
                      IsExpanded: true,
                    },
                  };
                  finalItems.push(projectWithState);
                  
                  // Add the tasks for this project
                  if (tasksDataForParent.data) {
                    finalItems.push(...tasksDataForParent.data);
                  }
                }
                
                const result = { data: finalItems, meta };
                console.log("Expanding result", result);
                return new Response(JSON.stringify(result), {
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                  },
                });
              })
              .catch((error) => {
                console.error(
                  "Service Worker: Error fetching tasks for expand:",
                  error
                );
                return new Response(JSON.stringify({ error: error.message }), {
                  status: 500,
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                  },
                });
              });
          }
          // Case 3: Initial load or other actions (e.g. paging, sorting, no specific parent expand/collapse)
          else {
            const initialProjects = allProjectsOriginal.map((p) => ({
              ...p,
              attributes: {
                ...p.attributes,
                IsExpanded: p.attributes?.IsExpanded || false, // Default to false if not specified
              },
            }));
            const result = { data: initialProjects, meta };
            console.log("Initial/other result", result);
            return new Response(JSON.stringify(result), {
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            });
          }
        })
        .catch((error) => {
          console.error("Service Worker: Error fetching projects:", error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        })
    );
  }
});
