import { registerLicense } from "@syncfusion/ej2-base";
import {
	ColumnDirective,
	ColumnsDirective,
	Edit,
	GanttComponent,
	Inject,
	RowDD,
	VirtualScroll,
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

registerLicense(
	"Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCeExzWmFZfVtgc19CY1ZRRmYuP1ZhSXxWdkBjX39ZdHFURGVYUUB9XUs="
);

const GanttData: object[] = [
	{
		TaskID: 1,
		TaskName: "Project Initiation",
		StartDate: new Date("04/02/2019"),
		EndDate: new Date("04/21/2019"),
	},
	{
		TaskID: 2,
		TaskName: "Identify Site location",
		StartDate: new Date("04/02/2019"),
		Duration: 4,
		Progress: 50,
		ParentId: 1,
	},
	{
		TaskID: 3,
		TaskName: "Perform Soil test",
		StartDate: new Date("04/02/2019"),
		Duration: 4,
		Progress: 50,
		ParentId: 1,
	},
	{
		TaskID: 4,
		TaskName: "Soil test approval",
		StartDate: new Date("04/02/2019"),
		Duration: 4,
		Progress: 50,
		ParentId: 1,
	},
	{
		TaskID: 5,
		TaskName: "Project Estimation",
		StartDate: new Date("04/02/2019"),
		EndDate: new Date("04/21/2019"),
	},
	{
		TaskID: 6,
		TaskName: "Develop floor plan for estimation",
		StartDate: new Date("04/04/2019"),
		Duration: 3,
		Progress: 50,
		ParentId: 5,
	},
	{
		TaskID: 7,
		TaskName: "List materials",
		StartDate: new Date("04/04/2019"),
		Duration: 3,
		Progress: 50,
		ParentId: 5,
	},
	{
		TaskID: 8,
		TaskName: "Estimation approval",
		StartDate: new Date("04/04/2019"),
		Duration: 3,
		Progress: 50,
		ParentId: 5,
	},
];

const GanttChart = () => {
	const taskFields: any = {
		id: "TaskID",
		name: "TaskName",
		startDate: "StartDate",
		duration: "Duration",
		progress: "Progress",
		parentID: "ParentId",
	};
	return (
		<div className="w-full p-4">
			<h1 className="text-2xl font-bold mb-4">Gantt Chart</h1>
			<GanttComponent
				dataSource={GanttData}
				height="550px"
				width="100%"
				taskFields={taskFields}
				treeColumnIndex={1}
				enableTimelineVirtualization={true}
				allowTaskbarDragAndDrop={true}
				splitterSettings={{
					columnIndex: 3,
				}}
				editSettings={{
					allowEditing: true,
					allowTaskbarEditing: true,
					// allowDeleting: false,
					// allowAdding: false,
				}}
			>
				<ColumnsDirective>
					<ColumnDirective
						field="TaskID"
						headerText="ID"
						width="100"
					></ColumnDirective>
					<ColumnDirective
						field="TaskName"
						headerText="Task Name"
						width="200"
					></ColumnDirective>
					<ColumnDirective
						field="StartDate"
						headerText="Start Date"
						width="100"
					></ColumnDirective>
					<ColumnDirective
						field="Duration"
						headerText="Duration"
						width="100"
					></ColumnDirective>
					<ColumnDirective
						field="Progress"
						headerText="Progress"
						width="50"
					></ColumnDirective>
				</ColumnsDirective>
				<Inject services={[VirtualScroll, Edit, RowDD]} />
			</GanttComponent>
		</div>
	);
};

export default GanttChart;
