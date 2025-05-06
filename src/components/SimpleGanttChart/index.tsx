
import {
	GanttComponent,
	ColumnsDirective,
	ColumnDirective,
	Inject,
	type TaskFieldsModel,	
} from "@syncfusion/ej2-react-gantt";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-calendars/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-grids/styles/material.css";
import "@syncfusion/ej2-treegrid/styles/material.css";
import "@syncfusion/ej2-gantt/styles/material.css";
import { DataManager, UrlAdaptor, Query } from "@syncfusion/ej2-data";

interface TaskData {
	TaskID: number;
	TaskName: string;
	StartDate: Date;
	EndDate: Date;
	Duration?: number;
	Progress?: number;
	dependency?: string;
	subtasks?: TaskData[];
}

const SimpleGanttChart = () => {
	const taskData: TaskData[] = [
		{
			TaskID: 1,
			TaskName: "Project Initiation",
			StartDate: new Date("2025-05-08"),
			EndDate: new Date("2025-05-12"),
			Progress: 30,
		},
		{
			TaskID: 2,
			TaskName: "Requirements Gathering",
			StartDate: new Date("2025-05-15"),
			EndDate: new Date("2025-05-20"),
			Duration: 5,
			Progress: 50,
			dependency: "1",
		},
		{
			TaskID: 3,
			TaskName: "Design",
			StartDate: new Date("2025-05-22"),
			EndDate: new Date("2025-05-27"),
			Duration: 5,
			Progress: 20,
			dependency: "2",
		},
	];

	const taskFields: TaskFieldsModel = {
		id: "TaskID",
		name: "TaskName",
		startDate: "StartDate",
		endDate: "EndDate",
		duration: "Duration",
		progress: "Progress",
		dependency: "dependency",
		child: "subtasks",
	};

	return (
		<GanttComponent dataSource={taskData} taskFields={taskFields} >
			<ColumnsDirective>
				<ColumnDirective
					field="TaskID"
					headerText="Task ID"
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
					format="yMd"
					width="130"
				></ColumnDirective>
				<ColumnDirective
					field="EndDate"
					headerText="End Date"
					format="yMd"
					width="130"
				></ColumnDirective>
				<ColumnDirective
					field="Duration"
					headerText="Duration"
					width="100"
				></ColumnDirective>
				<ColumnDirective
					field="Progress"
					headerText="Progress"
					width="100"
				></ColumnDirective>
			</ColumnsDirective>
			<Inject
				services={
					[
						/* Add required services here if needed, e.g., Selection, Sort, Filter */

					]
				}
			/>
		</GanttComponent>
	);
};

export default SimpleGanttChart;
