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
	VirtualScroll,
	type EditSettingsModel,
	type LabelSettingsModel,
	type ResourceFieldsModel,
	ColumnDirective,
	ColumnsDirective,
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
	taskId: number;
	taskName: string;
	startDate: Date;
	endDate?: Date;
	duration?: number;
	progress?: number;
	predecessor?: string;
	parentID?: number | null;
	isParent?: boolean;
	IsExpanded?: boolean;
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

const GanttChartSandBox = () => {
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
		const fetchParentTasks = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const projectsRes = await fetch("http://localhost:3000/projects");
				if (!projectsRes.ok) {
					throw new Error("Failed to fetch projects");
				}

				const projects: Task[] = await projectsRes.json();
				const processedProjects = projects.map(proj => ({
					...proj,
					startDate: new Date(proj.startDate),
					endDate: proj.endDate ? new Date(proj.endDate) : undefined,
					isParent: true,
					ParentId: null,
				}));

				setGanttData(processedProjects);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load projects"
				);
				console.error("Error fetching projects:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchParentTasks();
	}, []);

	useEffect(() => {
		if (ganttRef.current && ganttData.length > 0 && !isLoading) {
			ganttRef.current.collapseAll();
		}
	}, [ganttData, isLoading]);

	const onTaskbarEditing = (args: any) => {
		const draggingEnd: Date = args.data.EndDate;
		if (!projectEndDate || draggingEnd > projectEndDate) {
			setProjectEndDate(draggingEnd);
		}
	};

	const handleExpanding = async (args: any) => {
		const record = args.data as Task;

		try {
			const subtasksRes = await fetch("http://localhost:3000/subtasks");
			if (!subtasksRes.ok) {
				throw new Error("Failed to fetch subtasks");
			}

			const allSubtasks: Task[] = await subtasksRes.json();
			const taskSubtasks = allSubtasks
				.filter(task => task.parentID === record.taskId)
				.map(task => ({
					...task,
					startDate: new Date(task.startDate),
					endDate: task.endDate ? new Date(task.endDate) : undefined,
					isParent: false,
					parentID: record.taskId,
				}));

			if (taskSubtasks.length > 0) {
				setGanttData(prevData => [...prevData, ...taskSubtasks]);
			}
		} catch (err) {
			console.error("Error loading subtasks:", err);
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

	// const taskFields = {
	// 	id: "taskId",
	// 	name: "taskName",
	// 	startDate: "startDate",
	// 	endDate: "endDate",
	// 	duration: "duration",
	// 	progress: "progress",
	// 	dependency: "predecessor",
	// 	parentID: "parentID",
	// 	hasChildMapping: "isParent",
	// 	expandState: "IsExpanded"
	// };
	const taskFields: any = {
		id: "taskId",
		name: "taskName",
		startDate: "startDate",
		endDate: "endDate",
		duration: "duration",
		progress: "progress",
		dependency: "predecessor",
		parentID: "parentID",
		hasChildMapping: "isParent",
		expandState: "IsExpanded",
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

	return (
		// <div className="control-pane">
		// 	<div className="control-section">
		// 		<GanttComponent
		// 			id="gantt-chart"
		// 			height="400px"
		// 			width="1440px"
		// 			ref={(instance: GanttComponent | null) => {
		// 				ganttRef.current = instance;
		// 			}}
		// 			// treeColumnIndex={1}

		// 			dataSource={ganttData}
		// 			// resources={ganttResources}
		// 			taskFields={taskFields}
		// 			editSettings={editSettings}
		// 			toolbar={toolbarOptions}
		// 			projectStartDate={projectStartDate}
		// 			{...(projectEndDate !== undefined ? { projectEndDate } : {})}
		// 			labelSettings={labelSettings}
		// 			resourceFields={resourceFields}
		// 			enableAdaptiveUI={true}
		// 			collapseAllParentTasks={true}
		// 			allowFiltering={true}
		// 			allowRowDragAndDrop={true}
		// 			enableUndoRedo={true}
		// 			undoRedoActions={[
		// 				"Add",
		// 				"Edit",
		// 				"Delete",
		// 				"RowDragAndDrop",
		// 				"ZoomIn",
		// 			]}
		// 			undoRedoStepsCount={20}
		// 			taskbarEditing={onTaskbarEditing}
		// 			durationUnit="Hour"
		// 			enableVirtualization={true}
		// 			// loadChildOnDemand={true}
		// 			expanding={handleExpanding}
		// 			loadingIndicator={{ indicatorType: "Shimmer" }}
		// 		>
		// 			{/* <ColumnDirective field="Resources" headerText="Assigned Resources" /> */}
		// 			<Inject
		// 				services={[
		// 					RowDD,
		// 					Edit,
		// 					Selection,
		// 					Toolbar,
		// 					Filter,
		// 					DayMarkers,
		// 					UndoRedo,
		// 					VirtualScroll,
		// 				]}
		// 			/>
		// 		</GanttComponent>
		// 	</div>
		// </div>
		<GanttComponent
			id="LoadOnDemand"
			dataSource={ganttData}
			// treeColumnIndex={1}
			taskFields={taskFields}
			enableVirtualization={true}
			loadChildOnDemand={true}
			height="460px"
			projectStartDate={projectStartDate}
			projectEndDate={projectEndDate}
			expanding={handleExpanding}
			loadingIndicator={{ indicatorType: "Shimmer" }}
			collapseAllParentTasks={true}
		>
			<ColumnsDirective>
				<ColumnDirective field="taskId" width="80"></ColumnDirective>
				<ColumnDirective
					field="taskName"
					headerText="Job Name"
					width="250"
					clipMode="EllipsisWithTooltip"
				></ColumnDirective>
				<ColumnDirective field="startDate"></ColumnDirective>
				<ColumnDirective field="duration"></ColumnDirective>
				<ColumnDirective field="progress"></ColumnDirective>
			</ColumnsDirective>
			<Inject services={[Selection, VirtualScroll]} />
		</GanttComponent>
	);
};

export default GanttChartSandBox;
