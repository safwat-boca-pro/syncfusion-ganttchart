interface GanttTask {
	taskId: string;
	taskName: string;
	startDate: Date;
	endDate?: Date;
	duration?: string;
	progress?: number;
	predecessor?: string;
	parentID?: string | null;
	isParent?: boolean;
	IsExpanded?: boolean;
}

interface Project {
	type: string;
	id: string;
	attributes: {
		project_name: string;
		start_date_target: string;
		end_date_target: string;
		parent_projects_id: string | null;
		workflow_state: number;
		totals: {
			All: {
				used: number;
				budget: number;
			};
		};
		IsExpanded: boolean;
	};
	relationships?: {
		projects?: {
			data: Array<{ id: string; type: string }>;
		};
	};
}

interface Task {
	type: string;
	id: string;
	attributes: {
		name: string;
		target_start_date: string | null;
		target_end_date: string | null;
		parent_tasks_id: string | null;
		workflow_state: number;
		budget_hours_total: number;
		IsExpanded: boolean;
	};
	relationships?: {
		projects?: {
			data: Array<{ id: string; type: string }>;
		};
	};
}

export const mapDataToGanttTasks = (data: (Project | Task)[]): GanttTask[] => {
	const ganttTasks: GanttTask[] = [];

	// Helper function to calculate progress based on workflow state
	const calculateProgress = (workflowState: number): number => {
		switch (workflowState) {
			case 0:
				return 0;
			case 20:
				return 25;
			case 40:
				return 50;
			case 60:
				return 75;
			case 80:
				return 100;
			default:
				return 0;
		}
	};

	// Process each item (project or task)
	data.forEach(item => {
		if (item.type === "projects") {
			const project = item as Project;
			ganttTasks.push({
				taskId: project.id,
				taskName: project.attributes.project_name,
				startDate: new Date(project.attributes.start_date_target),
				endDate: new Date(project.attributes.end_date_target),
				progress: calculateProgress(project.attributes.workflow_state),
				parentID: null,
				isParent: true,
				// Use IsExpanded from attributes if present, otherwise default to false
				IsExpanded:
					project.attributes.IsExpanded !== undefined
						? project.attributes.IsExpanded
						: false,
			});
		} else if (item.type === "tasks") {
			const task = item as Task;
			ganttTasks.push({
				taskId: task.id,
				taskName: task.attributes.name,
				startDate: task.attributes.target_start_date
					? new Date(task.attributes.target_start_date)
					: new Date(),
				endDate: task.attributes.target_end_date
					? new Date(task.attributes.target_end_date)
					: undefined,
				progress: calculateProgress(task.attributes.workflow_state),
				parentID: task.relationships?.projects?.data[0]?.id,
				// For tasks, we might need to determine if it has subtasks from the relationships
				isParent: false, // This could be updated based on your data structure
				IsExpanded: false,
			});
		}
	});

	console.log("🚀 ~ :110 ~ ganttTasks:", ganttTasks);
	return ganttTasks;
};

// Helper function to transform API response to Gantt data
export const transformApiResponse = (response: any): GanttTask[] => {
	if (!response || !Array.isArray(response)) {
		return [];
	}

	return mapDataToGanttTasks(response);
};
