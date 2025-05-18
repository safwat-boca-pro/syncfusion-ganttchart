import {
	WebApiAdaptor,
	DataManager,
	type RemoteOptions,
	Query,
} from "@syncfusion/ej2-data";
import { transformApiResponse } from "../../utils/ganttDataMapper";

// // Replace this function with your real auth-token retrieval logic
function getAuthToken(): string {
	// e.g., read from localStorage or a context
	return localStorage.getItem("authToken") || "";
}

/**
 * Custom adaptor to switch between fetching root projects and loading subtasks on demand
 */
export class CustomGanttAdaptor extends WebApiAdaptor {
	constructor(options?: RemoteOptions) {
		super(options);
	}

	/**
	 * Intercepts every request; adjusts URL based on whether child data is being loaded.
	 */
	public processQuery(
		dataManager: DataManager,
		query: Query,
		hierarchy: Object[]
	): Object {
		// console.log("🚀 ~ :29 ~ CustomGanttAdaptor ~ query:", query);

		// Let base adaptor build the request payload
		const settings = super.processQuery(dataManager, query, hierarchy) as any;

		// console.log("🚀 ~ :34 ~ CustomGanttAdaptor ~ settings:", settings);

		// if query has expand, then add parentID=[id] to the url
		// if (query.expands.length > 0 && query.expands[0] === "ExpandingAction") {
		// 	settings.url = settings.url.replace(
		// 		"http://localhost:3000/",
		// 		"http://localhost:3000/tasks"
		// 	);
		// } else {
		// 	settings.url = settings.url.replace(
		// 		"http://localhost:3000/",
		// 		"http://localhost:3000/projects"
		// 	);
		// }

		return settings;
	}

	public beforeSend(dataManager: DataManager, request: any, query: any): void {
		super.beforeSend(dataManager, request, query);
	}

	/**
	 * Normalize the server response to match Syncfusion's expected shape.
	 */
	public processResponse(
		data: any,
		dataSource: any,
		query: Query,
		xhr: any,
		request: any
	): Object {
		console.log("🚀 ~ :74 ~ CustomGanttAdaptor ~ data:", data);

		let result = transformApiResponse(data.data);

		// data.map((item: any) => {
		// 	if (item.type === "projects") {
		// 		item.taskId = item.id;
		// 		item.parentID = null;
		// 		item.isParent = true;
		// 		item.taskName = item.attributes.project_name;
		// 		item.startDate = item.attributes.start_date_target;
		// 		item.endDate = item.attributes.end_date_target;
		// 		item.expandState = false;
		// 	}

		// 	if (item.type === "tasks") {
		// 		item.taskId = item.id;
		// 		item.parentID = item.relationships.data.id;
		// 		item.isParent = false;
		// 		item.taskName = item.attributes.name;
		// 		item.startDate = item.attributes.target_start_date;
		// 		item.endDate = item.attributes.target_end_date;
		// 		item.expandState = false;
		// 	}
		// });

		return { result, count: result.length };
	}
}

// export class CustomGanttAdaptor extends WebApiAdaptor {
// 	constructor(options?: RemoteOptions) {
// 		super(options);
// 	}
// 	/**
// 	 * Intercepts every request; adjusts URL based on whether child data is being loaded.
// 	 */
// 	public processQuery(
// 		dataManager: DataManager,
// 		query: any,
// 		hierarchy: any
// 	): Object {
// 		// Base URL comes from DataManager configuration
// 		const baseUrl = (dataManager.dataSource as any).url as string;
// 		let url = baseUrl;

// 		// Detect load-child-on-demand trigger (Syncfusion adds fn = "onExpand")
// 		const expansionParam = query.queries.find((q: any) => q.fn === "onExpand");
// 		if (hierarchy && expansionParam) {
// 			const parentID = expansionParam.key;
// 			// Construct URL for child records
// 			url = `${baseUrl.replace(
// 				/\/projects$/,
// 				""
// 			)}/subtasks?parentID=${parentID}`;
// 		}

// 		// Override request URL
// 		this.options.url = url;
// 		return super.processQuery(dataManager, query, hierarchy);
// 	}

// 	/**
// 	 * Attach authorization headers to every request
// 	 */
// 	public beforeSend(dataManager: DataManager, request: any, query: any): void {
// 		const token = getAuthToken();
// 		if (token) {
// 			request.setRequestHeader("Authorization", `Bearer ${token}`);
// 		}
// 		super.beforeSend(dataManager, request, query);
// 	}
// }
