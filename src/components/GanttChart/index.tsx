import {
	GanttComponent,
	Inject,
	Edit,
	Selection,
	Toolbar,
	Filter,
	DayMarkers,
	RowDD,
	UndoRedo,
	type EditSettingsModel,
	type LabelSettingsModel,
	type ResourceFieldsModel,
	ColumnDirective,
} from "@syncfusion/ej2-react-gantt";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-lists/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-layouts/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-grids/styles/material.css";
import "@syncfusion/ej2-treegrid/styles/material.css";
import "@syncfusion/ej2-react-gantt/styles/material.css";
import { registerLicense } from "@syncfusion/ej2-base";
import { useEffect, useRef, useState } from "react";
import { projectData, projectResources } from "../../data";
export interface Task {
	TaskID: number;
	TaskName: string;
	StartDate: Date;
	EndDate?: Date;
	Duration?: number;
	Progress?: number;
	Predecessor?: string;
	subtasks?: Task[];
	Resources?: number[];
	ParentId?: number;
}

export interface Resource {
	ResourceId: number;
	ResourceName: string;
	ResourceUnit?: string;
	ResourceGroup?: string;
}

registerLicense(
	"Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCeExzWmFZfVtgc19CY1ZRRmYuP1ZhSXxWdkBjX39ZdHFURGVYUUB9XUs="
);

const GanttChart = () => {
	const [projectStartDate] = useState<Date>(new Date("2024-03-25"));
	const [projectEndDate, setProjectEndDate] = useState<Date | undefined>(
		undefined
	);
	const ganttRef = useRef<GanttComponent | null>(null);

	const [ganttData, setGanttData] = useState<Task[]>([]);
	const [ganttResources, setGanttResources] = useState<Resource[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchInitialProjects = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const projectsRes = await fetch("http://localhost:3000/projects");

				if (!projectsRes.ok) {
					throw new Error("Failed to fetch initial project data.");
				}

				const projects: Task[] = await projectsRes.json();

				const processedProjects = projects.map(proj => ({
					...proj,
					StartDate: new Date(proj.StartDate),
					EndDate: proj.EndDate ? new Date(proj.EndDate) : undefined,
					subtasks: [],
				}));

				setGanttData(processedProjects);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unknown error occurred during initial project load");
				}
				console.error("Error fetching initial project data:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchInitialProjects();
	}, []);

	useEffect(() => {
		// if (ganttRef.current && ganttData.length > 0 && !isLoading) {
		// 	ganttRef.current.collapseAll();
		// }
	}, [ganttData, isLoading]);

	const onTaskbarEditing = (args: any) => {
		const draggingEnd: Date = args.data.EndDate;
		if (!projectEndDate || draggingEnd > projectEndDate) {
			setProjectEndDate(draggingEnd);
		}
	};

	const handleExpanding = (args: any) => {
		if (args.data) {
			console.log("Project expanded:", args.data as Task);
		}
	};

	const labelSettings: LabelSettingsModel = {
		rightLabel: "${Resources}",
		taskLabel: "${taskData.TaskName}",
	};

	const resourceFields: ResourceFieldsModel = {
		id: "ResourceId",
		name: "ResourceName",
		unit: "ResourceUnit",
		group: "ResourceGroup",
	};

	const taskFields = {
		id: "TaskID",
		name: "TaskName",
		startDate: "StartDate",
		endDate: "EndDate",
		duration: "Duration",
		progress: "Progress",
		dependency: "Predecessor",
		child: "subtasks",
		resourceInfo: "Resources",
	};

	const editSettings: EditSettingsModel = {
		allowAdding: true,
		allowEditing: true,
		allowDeleting: true,
		allowTaskbarEditing: true,
		showDeleteConfirmDialog: true,
		mode: "Auto",
	};

	const toolbarOptions: string[] = [
		"Add",
		"Edit",
		"Update",
		"Delete",
		"Cancel",
		"ExpandAll",
		"CollapseAll",
		"Search",
		"Undo",
		"Redo",
		"ZoomIn",
		"ZoomOut",
		"ZoomToFit",
	];

	useEffect(() => {
		if (ganttRef.current && projectEndDate) {
			// Calculate time difference in milliseconds
			const currentEndDate = ganttRef.current.projectEndDate as Date;
			if (!currentEndDate) return;

			const timeDiff = projectEndDate.getTime() - currentEndDate.getTime();

			// One week in milliseconds
			const oneWeek = 7 * 24 * 60 * 60 * 1000;
			// One month in milliseconds (approximately)
			const oneMonth = 30 * 24 * 60 * 60 * 1000;

			let newEndDate = new Date(projectEndDate);

			if (timeDiff >= oneMonth) {
				// Add 2 months if difference is one month
				newEndDate.setMonth(newEndDate.getMonth() + 2);
			} else if (timeDiff >= oneWeek) {
				// Add 2 weeks if difference is one week
				newEndDate.setTime(newEndDate.getTime() + 2 * oneWeek);
			}

			if (
				newEndDate.getTime() !==
				(ganttRef.current.projectEndDate as Date)?.getTime()
			) {
				ganttRef.current.updateProjectDates(projectStartDate, newEndDate, true);
			}
		}
	}, [projectEndDate, projectStartDate]);

	// if (isLoading) {
	// 	return <div>Loading Gantt chart data...</div>;
	// }

	// if (error) {
	// 	return <div>Error loading data: {error}</div>;
	// }

	// if (!ganttData.length && !isLoading) {
	// 	return <div>No project data to display.</div>;
	// }

	return (
		<GanttComponent
			id="gantt-chart"
			height="400px"
			width="1440px"
			ref={(instance: GanttComponent | null) => {
				ganttRef.current = instance;
			}}
			dataSource={ganttData}
			resources={ganttResources}
			taskFields={taskFields}
			editSettings={editSettings}
			toolbar={toolbarOptions}
			projectStartDate={projectStartDate}
			{...(projectEndDate !== undefined ? { projectEndDate } : {})}
			labelSettings={labelSettings}
			resourceFields={resourceFields}
			enableAdaptiveUI={true}
			collapseAllParentTasks={true}
			allowFiltering={true}
			allowRowDragAndDrop={true}
			enableUndoRedo={true}
			undoRedoActions={["Add", "Edit", "Delete", "RowDragAndDrop", "ZoomIn"]}
			undoRedoStepsCount={20}
			taskbarEditing={onTaskbarEditing}
			durationUnit="Hour"
			// expanding={handleExpanding}
			enableVirtualization={true}
			loadingIndicator={{ indicatorType: "Shimmer" }}
		>
			<ColumnDirective field="Resources" headerText="Assigned Resources" />
			<Inject
				services={[
					RowDD,
					Edit,
					Selection,
					Toolbar,
					Filter,
					DayMarkers,
					UndoRedo,
				]}
			/>
		</GanttComponent>
	);
};

export default GanttChart;
