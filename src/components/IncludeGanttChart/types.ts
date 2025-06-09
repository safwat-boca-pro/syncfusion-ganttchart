type HeightUnit = "px" | "vh" | "vw" | "%";

type Height = `${number}${HeightUnit}`;

export interface GanttData {
	id: string;
	name: string;
	start_date: string;
	end_date: string;
	isParent: boolean;
	IsExpanded: boolean;
	parentID: string | null;
}

export interface GanttChartProps {
	data: GanttData[];
	isLoading?: boolean;
	error?: string | null;
	totalRecords?: number;
	totalProjects?: number;
	totalTasks?: number;
	expandedProjectsCount?: number;
	hasNextPage?: boolean;
	isFetchingNextPage?: boolean;
	isLoadingTasks?: boolean;
	loadingTasksCount?: number;
	onScroll?: (scrollInfo: {
		scrollTop: number;
		scrollHeight: number;
		clientHeight: number;
		scrollPercentage: number;
	}) => void;
	onExpand?: (projectId: string) => void;
	onCollapse?: (projectId: string) => void;
	height?: Height;
	width?: string;
	projectStartDate?: Date;
	projectEndDate?: Date;
	timelineVirtualizationThreshold?: number; // Years threshold for enabling timeline virtualization
	onTaskEdited?: (taskData: any) => void; // Callback for when a task is edited
}

export interface ProjectTasksCache {
	[projectId: string]: any[];
}
