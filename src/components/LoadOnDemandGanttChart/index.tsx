import {
	GanttComponent,
	Inject,
	Selection,
	ColumnsDirective,
	ColumnDirective,
	VirtualScroll,
} from "@syncfusion/ej2-react-gantt";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { registerLicense } from "@syncfusion/ej2-base";
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

const LoadOnDemand = () => {
	const dataSource: DataManager = new DataManager({
		url: "https://services.syncfusion.com/react/production/api/GanttLoadOnDemand",
		adaptor: new WebApiAdaptor(),
		crossDomain: true,
	});

	const taskFields: any = {
		id: "taskId",
		name: "taskName",
		startDate: "startDate",
		endDate: "endDate",
		duration: "duration",
		progress: "progress",
		hasChildMapping: "isParent",
		parentID: "parentID",
		expandState: "IsExpanded",
	};

	const projectStartDate: Date = new Date("01/02/2000");
	const projectEndDate: Date = new Date("12/01/2002");
	return (
		<GanttComponent
			id="LoadOnDemand"
			dataSource={dataSource}
			treeColumnIndex={1}
			taskFields={taskFields}
			enableVirtualization={true}
			loadChildOnDemand={true}
			height="460px"
			projectStartDate={projectStartDate}
			projectEndDate={projectEndDate}
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
export default LoadOnDemand;
