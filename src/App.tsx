import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import IncludeGanttChart from "./components/IncludeGanttChart";
import type {
	GanttData,
	ProjectTasksCache,
} from "./components/IncludeGanttChart/types";
import { useCallback, useEffect, useState } from "react";
import { transformProjectData } from "./components/IncludeGanttChart/util";
import GanttChart from "./components/GanttChart";

const TOKEN =
	"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlY1RGxhZmhBVVZDLUpwWG1ST2p0NCJ9.eyIvcm9sZXMiOlsiZDE5ODliNDItMzM4Yy01NTI2LTliOTgtM2MyMzI4MTM3ODczIiwiZGVlNzU2MTEtODVjZC01ZTExLWEwMmEtZDNhMTA5MjdiZGJkIl0sIi9wZXJtaXNzaW9ucyI6WyI2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDBfQUNDT1VOVFMiLCJzYWZ3YXQuZmF0aGlAYm9jYS5wcm9fRU1BSUwiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OmFjY291bnRzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OmNsaWVudHM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6Y29tcGFuaWVzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OmZpbGVzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50Omludm9pY2VzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OnBheW1lbnRhZGRyZXNzZXM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6cGF5bWVudG1ldGhvZHM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6cGF5bWVudHM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6cHJvamVjdHM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6bWVzc2FnZXM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6dHJhY2tpbmdzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OnRpbWVjbG9ja2VudHJpZXM6YWxsOiJdLCJpc3MiOiJodHRwczovL2Rldi1hdXRoLmluY2x1ZGUuY29tLyIsInN1YiI6ImF1dGgwfDY4MThlMDRiNmViNGRhMThhMmI1Nzg2ZiIsImF1ZCI6WyJodHRwczovL2Rldi1wb3J0YWwtYXBpLmluY2x1ZGUuY29tIiwiaHR0cHM6Ly9kZXYtcnZqYS1uMXcudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTc0OTQ0OTIxOCwiZXhwIjoxNzQ5NTM1MjE4LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXpwIjoiaDJkMG9ubGY4NU5oTDJvckpGbkg2MG1oVTRhR2JtTmIiLCJwZXJtaXNzaW9ucyI6W119.Osn1llPGkg7R04apPU-L-6diqJvtT3dZZ-sWsfV3M88g-DlU0e5TXfeq7NjPZ8i_g7HuZBxt-CwCbpWOtXBuw4uoudJmviLA2I6UQbhfJ4Li9gGVn91Fmw8awClr2hTBiMVXrJtK3f5mPhSjbiV3HoSvsW4wP9_0YbqvlkpGdtc8K__WXMTcaw8J7YVb3VRVrsxx9LKDwmoBxkqwe3DI2ONW1BAa8TzJDq3pnEnMgFoEyw3oGi64Bk8Qz9-u0j58AAs33skI0n0OF0hUcaefvnrcZzqTWR1wYxVKbXlWWKesf55F01atgOfG1H4UNPC3FhwdNILARyEzTjKgIlXg3w";

const fetchGanttPage = async (
	pageParam: number,
	pageSize = 25
): Promise<any> => {
	const response = await fetch(
		"https://dev-portal-api.include.com/includego/tenants/425db690-a10b-4199-b3ef-980be43413df/companies/debf08b8-85c2-4a99-891b-f752caa574f7/projects?page[number]=1&sort=project_name_lowercase",
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${TOKEN}`,
			},
		}
	);

	const { data, meta } = await response.json();

	return {
		data: data || [],
		count: meta?.total_items || 0,
		hasNextPage: pageParam * pageSize < (meta?.total_items || 0),
		nextPage:
			pageParam * pageSize < (meta?.total_items || 0)
				? pageParam + 1
				: undefined,
	};
};

const fetchProjectTasks = async (projectId: string) => {
	const response = await fetch(
		`https://dev-portal-api.include.com/includego/tenants/425db690-a10b-4199-b3ef-980be43413df/companies/debf08b8-85c2-4a99-891b-f752caa574f7/tasks?filter%5Bprojects_ids%5D=${projectId}&page[number]=1&page[size]=100&sort=target_start_date`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${TOKEN}`,
			},
		}
	);

	const { data } = await response.json();

	return data || [];
};

const App = () => {
	const [allData, setAllData] = useState<GanttData[]>([]);
	const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
		new Set()
	);
	const [projectTasksCache, setProjectTasksCache] = useState<ProjectTasksCache>(
		{}
	);
	const [projectsToFetch, setProjectsToFetch] = useState<Set<string>>(
		new Set()
	);

	const {
		data: projectsData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: isLoadingProjects,
		isError,
		error,
	} = useInfiniteQuery({
		queryKey: ["ganttData"],
		queryFn: ({ pageParam }) => fetchGanttPage(pageParam),
		initialPageParam: 1,
		getNextPageParam: lastPage => lastPage.nextPage,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: failureCount => {
			return failureCount < 3;
		},
	});

	// Use useQueries to fetch tasks for multiple projects independently
	const taskQueries = useQueries({
		queries: Array.from(projectsToFetch).map(projectId => ({
			queryKey: ["projectTasks", projectId],
			queryFn: () => fetchProjectTasks(projectId),
			enabled: !!projectId,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		})),
	});

	const expandedProjectsCount = expandedProjects.size;
	const totalTasksLoaded = Object.values(projectTasksCache).reduce(
		(sum, tasks) => sum + tasks.length,
		0
	);
	const totalProjects = projectsData?.pages.flatMap(p => p.data).length || 0;
	const totalRecords = totalProjects + totalTasksLoaded;

	// Handle expand event
	const handleExpand = useCallback(
		(projectId: string) => {
			// Add to expanded projects
			setExpandedProjects(prev => new Set(prev).add(projectId));

			// Add to projects to fetch if not already cached
			if (!projectTasksCache[projectId]) {
				setProjectsToFetch(prev => new Set(prev).add(projectId));
			}
		},
		[projectTasksCache]
	);

	// Handle collapse event
	const handleCollapse = useCallback((projectId: string) => {
		// Remove from expanded projects
		setExpandedProjects(prev => {
			const newSet = new Set(prev);
			newSet.delete(projectId);
			return newSet;
		});
	}, []);

	useEffect(() => {
		taskQueries.forEach((query, index) => {
			const projectId = Array.from(projectsToFetch)[index];
			if (query.data && !query.isLoading && projectId) {
				setProjectTasksCache(prev => ({
					...prev,
					[projectId]: query.data,
				}));
				// Remove from projects to fetch once loaded
				setProjectsToFetch(prev => {
					const newSet = new Set(prev);
					newSet.delete(projectId);
					return newSet;
				});
			}

			// Handle errors by removing from fetch set
			if (query.isError && projectId) {
				setProjectsToFetch(prev => {
					const newSet = new Set(prev);
					newSet.delete(projectId);
					return newSet;
				});
			}
		});
	}, [taskQueries, projectsToFetch]);

	useEffect(() => {
		if (projectsData?.pages) {
			const combinedProjects = projectsData.pages.flatMap(page => page.data);

			const transformedData = transformProjectData(
				combinedProjects,
				expandedProjects,
				projectTasksCache
			);

			setAllData(transformedData);
		}
	}, [projectsData, expandedProjects, projectTasksCache]);

	if (isLoadingProjects && !projectsData) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "550px",
					width: "100%",
					backgroundColor: "white",
					borderRadius: 8,
					border: "1px solid #E5E5E5",
				}}
			>
				Loading Gantt chart data...
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex justify-center items-center h-screen">
				Error: {error.message}
			</div>
		);
	}

	return (
		<div className="relative w-[1650px] h-full overflow-hidden ">
			<h1>Gantt Chart</h1>
			<IncludeGanttChart
				data={allData}
				isLoading={isLoadingProjects}
				error={error}
				totalRecords={totalRecords}
				totalProjects={totalProjects}
				totalTasks={totalTasksLoaded}
				expandedProjectsCount={expandedProjectsCount}
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				onExpand={handleExpand}
				onCollapse={handleCollapse}
			/>
			<GanttChart />
		</div>
	);
};

export default App;
