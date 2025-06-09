import { WebApiAdaptor, type RemoteOptions } from "@syncfusion/ej2-data";
import { transformApiResponse } from "../../utils/ganttDataMapper";


/**
 * Custom adaptor to switch between fetching root projects and loading subtasks on demand
 */
export class CustomGanttAdaptor extends WebApiAdaptor {
	constructor(options?: RemoteOptions) {
		super(options);
	}

	/**
	 * Normalize the server response to match Syncfusion's expected shape.
	 */
	public processResponse(data: { result: any[]; count: number }): Object {
		console.log("🚀 ~ :74 ~ CustomGanttAdaptor ~ data:", data);

		return { result: transformApiResponse(data.result), count: data.count };
	}
}