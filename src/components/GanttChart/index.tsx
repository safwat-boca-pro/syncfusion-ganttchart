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
import { projectData, projectResources } from "../../data";
import { useEffect, useRef, useState } from "react";

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
}

registerLicense(
	"Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCeExzWmFZfVtgc19CY1ZRRmYuP1ZhSXxWdkBjX39ZdHFURGVYUUB9XUs="
);

const GanttChart = () => {
	// Track project start and end dates in state to detect boundary crossing
	const [projectStartDate] = useState<Date>(new Date("2024-03-25"));
	// If project end date is unknown, undefined allows Gantt to auto-calculate from data
	const [projectEndDate, setProjectEndDate] = useState<Date | undefined>(
		undefined
	);
	const ganttRef = useRef<GanttComponent>(null); // optional: if you need direct API calls later

	const onTaskbarEditing = (args: any) => {
		// Detect when dragging crosses project start or end
		// const draggingStart: Date = args.data.StartDate;
		const draggingEnd: Date = args.data.EndDate;

		// crossed or reached start boundary
		// if (draggingStart.getTime() <= projectStartDate.getTime()) {
		// 	console.log('🚀 reached project start date boundary:', projectStartDate);
		// }
		// crossed or reached end boundary
		if (!projectEndDate || draggingEnd > projectEndDate) {
			// extend end if undefined or dragged beyond current end
			setProjectEndDate(draggingEnd);
		}
	};

	// Resource view settings
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

	const resourceSettings = {
		dataSource: projectResources, // Your array of resource objects
		idMapping: "ResourceId", // Field in projectResources that is the ID
		nameMapping: "ResourceName", // Field in projectResources for display name
		// unitMapping: 'ResourceUnit' // Optional: if you have units for resources (e.g. percentage allocation)
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

			ganttRef.current.updateProjectDates(projectStartDate, newEndDate, true);
		}
	}, [projectEndDate]);

	return (
		<GanttComponent
			id="gantt-chart"
			height="400px"
			width="1440px"
			ref={(ganttChartRef: any) => (ganttRef.current = ganttChartRef)}
			dataSource={projectData}
			taskFields={taskFields}
			editSettings={editSettings}
			toolbar={toolbarOptions}
			projectStartDate={projectStartDate}
			{...(projectEndDate !== undefined ? { projectEndDate } : {})}
			labelSettings={labelSettings}
			resourceFields={resourceFields}
			resources={projectResources}
			enableAdaptiveUI={true}
			allowFiltering={true}
			allowRowDragAndDrop={true}
			enableUndoRedo={true}
			undoRedoActions={["Add", "Edit", "Delete", "RowDragAndDrop", "ZoomIn"]}
			undoRedoStepsCount={20}
			taskbarEditing={onTaskbarEditing}
			durationUnit="Hour"
		>
			{/* <ColumnDirective field="ResourceId" headerText="ID" />
			<ColumnDirective field="ResourceName" headerText="Resource Name" /> */}

			<ColumnDirective
				field="Resources"
				headerText="Resources"
				// template={template}
			/>
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
