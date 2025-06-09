import { useRef, useEffect, useCallback, useState } from "react";
import {
	Inject,
	Selection,
	ColumnsDirective,
	ColumnDirective,
	GanttComponent,
	Edit,
	RowDD,
} from "@syncfusion/ej2-react-gantt";
import type { GanttChartProps } from "./types";
import { registerLicense } from "@syncfusion/ej2-base";

// Import all necessary Syncfusion CSS files for proper Gantt chart styling
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

const IncludeGanttChart = ({
	data,
	isLoading = false,
	error = null,
	totalRecords = 0,
	totalProjects = 0,
	totalTasks = 0,
	expandedProjectsCount = 0,
	hasNextPage = false,
	isFetchingNextPage = false,
	isLoadingTasks = false,
	loadingTasksCount = 0,
	onScroll,
	onExpand,
	onCollapse,
	height = "600px",
	width = "100%",
	projectStartDate = new Date("01/01/1970"),
	projectEndDate,
}: GanttChartProps) => {
	const ganttRef = useRef<GanttComponent | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	// Store the original max date value
	const [originalMaxDate, setOriginalMaxDate] = useState<string | null>(null);

	// Store original max date when component mounts or projectEndDate changes
	useEffect(() => {
		// If there's a dateRangeData max value, store it
		// This assumes dateRangeData?.max?.value_as_string would be passed as projectEndDate
		if (projectEndDate && !originalMaxDate) {
			setOriginalMaxDate(projectEndDate.toISOString());
		}
	}, [projectEndDate, originalMaxDate]);

	// Handle expand/collapse actions
	const handleExpandCollapse = (args: any) => {
		const { data: expandCollapseData, name } = args;
		const projectId = expandCollapseData?.id;

		if (!projectId || !expandCollapseData?.isParent) return;

		if (name === "expanding" && onExpand) {
			onExpand(projectId);
		} else if (name === "collapsing" && onCollapse) {
			onCollapse(projectId);
		}
	};

	// Scroll handler
	const handleScroll = useCallback(
		(event: any) => {
			if (!onScroll) return;

			const { target } = event;
			const scrollTop = target.scrollTop;
			const scrollHeight = target.scrollHeight;
			const clientHeight = target.clientHeight;
			const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

			onScroll({
				scrollTop,
				scrollHeight,
				clientHeight,
				scrollPercentage,
			});
		},
		[onScroll]
	);

	// Attach scroll listener to Gantt content
	useEffect(() => {
		const ganttElement = ganttRef.current?.element;
		const contentElement = ganttElement?.querySelector(".e-content");

		if (contentElement && onScroll) {
			contentElement.addEventListener("scroll", handleScroll);
			return () => {
				contentElement.removeEventListener("scroll", handleScroll);
			};
		}
	}, [handleScroll, onScroll, data]);

	const taskFields = {
		id: "id",
		name: "name",
		startDate: "start_date",
		endDate: "end_date",
		hasChildMapping: "isParent",
		parentID: "parentID",
		expandState: "IsExpanded",
	};

	if (isLoading) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height,
					backgroundColor: "white",
					borderRadius: 8,
					border: "1px solid #E5E5E5",
				}}
			>
				Loading Gantt chart data...
			</div>
		);
	}

	if (error) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height,
					backgroundColor: "white",
					borderRadius: 8,
					border: "1px solid #E5E5E5",
					color: "red",
				}}
			>
				Error loading Gantt chart data: {error}
			</div>
		);
	}

	return (
		<div ref={containerRef} style={{ width, position: "relative" }}>
			{/* Loading indicator for pagination */}
			{isFetchingNextPage && (
				<div
					style={{
						position: "absolute",
						bottom: 20,
						right: 20,
						zIndex: 1000,
						backgroundColor: "rgba(0, 0, 0, 0.8)",
						color: "white",
						padding: "8px 16px",
						borderRadius: 4,
						fontSize: "12px",
					}}
				>
					Loading more data...
				</div>
			)}

			{/* Loading tasks indicator */}
			{isLoadingTasks && (
				<div
					style={{
						position: "absolute",
						top: 20,
						right: 20,
						zIndex: 1000,
						backgroundColor: "rgba(37, 99, 235, 0.9)",
						color: "white",
						padding: "8px 16px",
						borderRadius: 4,
						fontSize: "12px",
					}}
				>
					Loading tasks for {loadingTasksCount} project(s)...
				</div>
			)}

			{/* Status indicator */}
			<div
				style={{
					padding: "8px 12px",
					backgroundColor: "#f8f9fa",
					borderRadius: "4px 4px 0 0",
					fontSize: "12px",
					color: "#6c757d",
					borderBottom: "1px solid #e9ecef",
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<span>
					Showing {totalRecords} records ({totalProjects} projects, {totalTasks}{" "}
					tasks)
					{hasNextPage && " • Scroll down for more projects"}
					{!hasNextPage && data.length > 0 && " • All projects loaded"}
				</span>
				<span>{expandedProjectsCount} project(s) expanded</span>
			</div>

			<GanttComponent
				id="IncludeGanttChart"
				ref={ganttRef}
				dataSource={data}
				treeColumnIndex={1}
				taskFields={taskFields}
				height={height}
				width={width}
				// projectStartDate={projectStartDate}
				// projectEndDate={projectEndDate}
				projectStartDate={new Date("2000-01-01")}
				projectEndDate={new Date("2025-12-31")}
				enableTimelineVirtualization={true}
				collapsing={handleExpandCollapse}
				expanding={handleExpandCollapse}
				allowTaskbarDragAndDrop={true}
				editSettings={{
					allowEditing: true,
					allowTaskbarEditing: true,
				}}
				allowSelection={true}
				splitterSettings={{
					columnIndex: 3,
				}}
			>
				<ColumnsDirective>
					<ColumnDirective
						field="id"
						headerText="ID"
						width="100"
						allowEditing={false}
					/>

					<ColumnDirective
						field="name"
						headerText="Project / Task Name"
						width="200"
						clipMode="EllipsisWithTooltip"
						allowEditing={false}
					/>
					<ColumnDirective
						field="start_date"
						headerText="Start Date"
						width="150"
						type="date"
						format="MM/dd/yyyy"
					/>
					<ColumnDirective
						field="end_date"
						headerText="End Date"
						width="150"
						type="date"
						format="MM/dd/yyyy"
					/>
				</ColumnsDirective>
				<Inject services={[Selection, Edit, RowDD]} />
			</GanttComponent>
		</div>
	);
};

export default IncludeGanttChart;
