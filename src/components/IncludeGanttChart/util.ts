import type { GanttData, ProjectTasksCache } from "./types";

/**
 * Transform project data to include parent-child structure for Gantt chart
 * @param projects Array of project objects
 * @param expandedProjects Set of expanded project IDs
 * @param projectTasksCache Cache of project tasks
 * @returns Transformed GanttData array
 */
export const transformProjectData = (
	projects: any[],
	expandedProjects: Set<string>,
	projectTasksCache: ProjectTasksCache
): GanttData[] => {
	const transformedData: GanttData[] = [];

	projects.forEach(project => {
		console.log("🚀 ~ :47 ~ project:", project);
		// Add the project with isParent flag and expand state
		const transformedProject: GanttData = {
			id: project.id,
			name: project.attributes.project_name,
			start_date: project.attributes.start_date_target,
			end_date: project.attributes.end_date_target,
			isParent: true,
			IsExpanded: expandedProjects.has(project.id),
			parentID: null, // Projects are top-level
		};

		transformedData.push(transformedProject);

		// If project is expanded and has cached tasks, add them
		if (expandedProjects.has(project.id) && projectTasksCache[project.id]) {
			const tasks = projectTasksCache[project.id].map(
				(task): GanttData => ({
					id: task.id,
					name: task.attributes.name,
					start_date: task.attributes.start_date,
					end_date: task.attributes.end_date,
					parentID: project.id, // Set project as parent
					isParent: false,
					IsExpanded: false,
				})
			);
			transformedData.push(...tasks);
		}
	});

	return transformedData;
};

/**
 * Transform a single project to GanttData format
 * @param project Project object from API response
 * @param isExpanded Whether the project is expanded
 * @returns GanttData object
 */
export const transformProject = (
	project: any,
	isExpanded: boolean = false
): GanttData => {
	return {
		id: project.id,
		name: project.attributes.project_name,
		start_date: project.attributes.start_date_target,
		end_date: project.attributes.end_date_target,
		isParent: true,
		IsExpanded: isExpanded,
		parentID: null,
	};
};

/**
 * Transform a single task to GanttData format
 * @param task Task object
 * @param parentId Parent project ID
 * @returns GanttData object
 */
export const transformTask = (task: any, parentId: string): GanttData => {
	return {
		id: task.id,
		name: task.name,
		start_date: task.start_date,
		end_date: task.end_date,
		parentID: parentId,
		isParent: false,
		IsExpanded: false,
	};
};

/**
 * Calculate timeline span in years between two dates
 * @param startDate Start date
 * @param endDate End date
 * @returns Timeline span in years
 */
export const calculateTimelineSpanInYears = (
	startDate: Date,
	endDate: Date
): number => {
	return (
		(endDate.getTime() - startDate.getTime()) / (365 * 24 * 60 * 60 * 1000)
	);
};

/**
 * Get optimal timeline settings based on timeline span
 * @param timelineSpanInYears Timeline span in years
 * @returns Timeline settings object
 */
export const getOptimalTimelineSettings = (timelineSpanInYears: number) => {
	if (timelineSpanInYears > 10) {
		return {
			topTier: { unit: "Year" as any, format: "yyyy" },
			bottomTier: { unit: "Quarter" as any, format: "MMM" },
			timelineUnitSize: 40,
		};
	} else if (timelineSpanInYears > 5) {
		return {
			topTier: { unit: "Year" as any, format: "yyyy" },
			bottomTier: { unit: "Month" as any, format: "MMM" },
			timelineUnitSize: 50,
		};
	} else if (timelineSpanInYears > 2) {
		return {
			topTier: { unit: "Month" as any, format: "MMM yyyy" },
			bottomTier: { unit: "Week" as any, format: "dd" },
			timelineUnitSize: 60,
		};
	} else {
		return {
			topTier: { unit: "Week" as any, format: "MMM dd" },
			bottomTier: { unit: "Day" as any, format: "dd" },
			timelineUnitSize: 80,
		};
	}
};
