import type { Task } from "../components/GanttChartSandBox";

interface APIProject {
	type: "projects";
	id: string;
	attributes: {
		project_name: string;
		start_date_target: string | null;
		end_date_target: string | null;
		workflow_state: number;
	};
}

interface APITask {
	type: "tasks";
	id: string;
	attributes: {
		name: string;
		target_start_date: string | null;
		target_end_date: string | null;
		workflow_state: number;
	};
	relationships: {
		project: {
			data: {
				id: string;
			};
		};
	};
}

interface APIResponse {
	data: APIProject[] | APITask[];
	included: any[];
	meta: {
		total_pages: number;
		total_items: number;
		current_page: number;
		page_size: number;
	};
}

export const mapAPIProjectsToGanttTasks = (
	apiResponse: APIResponse
): Task[] => {
	return (apiResponse.data as APIProject[]).map((project: APIProject) => {
		const task: Task = {
			// taskId: parseInt(project.id.slice(0, 8), 16), // Convert first 8 chars of UUID to number
			taskId: project.id,
			taskName: project.attributes.project_name,
			startDate: project.attributes.start_date_target
				? new Date(project.attributes.start_date_target)
				: new Date(),
			endDate: project.attributes.end_date_target
				? new Date(project.attributes.end_date_target)
				: undefined,
			isParent: true,
			parentID: null,
			IsExpanded: false,
			progress: 0,
			// duration: 0,
		};

		// Calculate duration if both dates exist
		if (
			project.attributes.start_date_target &&
			project.attributes.end_date_target
		) {
			const start = new Date(project.attributes.start_date_target);
			const end = new Date(project.attributes.end_date_target);
			task.duration = Math.ceil(
				(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
			); // Duration in days
		}

		// Map workflow state to progress
		switch (project.attributes.workflow_state) {
			case 10: // Opened
				task.progress = 0;
				break;
			case 20: // Defined
				task.progress = 20;
				break;
			case 30: // Proposed
				task.progress = 30;
				break;
			case 40: // Contract Sold
				task.progress = 40;
				break;
			case 50: // Deposit Requested
				task.progress = 50;
				break;
			case 60: // Deposit Paid
				task.progress = 60;
				break;
			case 70: // Sent To Production
				task.progress = 70;
				break;
			case 80: // Work Started
				task.progress = 80;
				break;
			case 90: // Work Blocked
				task.progress = 85;
				break;
			case 100: // Work Completed
				task.progress = 90;
				break;
			case 110: // Invoiced
				task.progress = 95;
				break;
			case 120: // Invoice Paid
				task.progress = 100;
				break;
			default:
				task.progress = 0;
		}

		return task;
	});
};

export const mapAPITasksToGanttTasks = (apiResponse: APIResponse): Task[] => {
	return (apiResponse.data as APITask[]).map(task => {
		const subtask: Task = {
			taskId: task.id,
			taskName: task.attributes.name,
			startDate: task.attributes.target_start_date
				? new Date(task.attributes.target_start_date)
				: new Date(),
			endDate: task.attributes.target_end_date
				? new Date(task.attributes.target_end_date)
				: undefined,
			isParent: false,
			IsExpanded: false,
			progress: 10,
			// duration: 0,
		};

		return subtask;
	});
};
