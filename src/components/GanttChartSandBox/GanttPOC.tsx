import * as React from "react";
import {
  GanttComponent,
  Inject,
  VirtualScroll,
} from "@syncfusion/ej2-react-gantt";
import { registerLicense } from "@syncfusion/ej2-base";
import { Ajax } from "@syncfusion/ej2-base";
import { useEffect } from "react";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCeExzWmFZfVtgc19CY1ZRRmYuP1ZhSXxWdkBjX39ZdHFURGVYUUB9XUs="
);

const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlY1RGxhZmhBVVZDLUpwWG1ST2p0NCJ9.eyIvcm9sZXMiOlsiZDE5ODliNDItMzM4Yy01NTI2LTliOTgtM2MyMzI4MTM3ODczIiwiZGVlNzU2MTEtODVjZC01ZTExLWEwMmEtZDNhMTA5MjdiZGJkIl0sIi9wZXJtaXNzaW9ucyI6WyI2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDBfQUNDT1VOVFMiLCJzYWZ3YXQuZmF0aGlAYm9jYS5wcm9fRU1BSUwiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OmFjY291bnRzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OmNsaWVudHM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6Y29tcGFuaWVzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OmZpbGVzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50Omludm9pY2VzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OnBheW1lbnRhZGRyZXNzZXM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6cGF5bWVudG1ldGhvZHM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6cGF5bWVudHM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6cHJvamVjdHM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6bWVzc2FnZXM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6dHJhY2tpbmdzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OnRpbWVjbG9ja2VudHJpZXM6YWxsOiJdLCJpc3MiOiJodHRwczovL2Rldi1hdXRoLmluY2x1ZGUuY29tLyIsInN1YiI6ImF1dGgwfDY4MThlMDRiNmViNGRhMThhMmI1Nzg2ZiIsImF1ZCI6WyJodHRwczovL2Rldi1wb3J0YWwtYXBpLmluY2x1ZGUuY29tIiwiaHR0cHM6Ly9kZXYtcnZqYS1uMXcudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTc0NzU3MDkwMiwiZXhwIjoxNzQ3NjU2OTAyLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXpwIjoiaDJkMG9ubGY4NU5oTDJvckpGbkg2MG1oVTRhR2JtTmIiLCJwZXJtaXNzaW9ucyI6W119.Elr8CP4c5nwucMy85UgQwIR44bVPAag8yPaCnfI3MNPT3GAMFpguR20ugAlLxmg-PJMkKWPNoFUVZlteHMP6rPKfKNqdt_LitR3Dar43Lgkl-VTNk4MKLiWFK4S41zPvCHQYsAs8RN070S6ZNY4Vd5hmgwPGE7rkok28klEJp2IenY-qOU4OFR-s4IYzw24J75QRsJDyp9kHLvGEYovOH0zbOaVdrHje0L2kTeT9Id79fhXqkfFsGuhrSfC02ZeGrcY4hrk1OUSuDZbwThE3gYbgwJ0AbcL-vQdhByfKpuA94ugDCyZk9XTxWS0iV-H9w9wVZ8QCVVGq0dt-dNWuOQ";

function GanttPOC() {
  const apiToken = `Bearer ${token}`;
  const taskFields: any = {
    id: "TaskId",
    name: "TaskName",
    startDate: "StartDate",
    duration: "Duration",
    dependency: "Predecessor",
    parentID: "parentID",
    progress: "Progress",
    expandState: "expandState",
  };
  let ganttInstance: any;
  const isDataLoadingInitiated = React.useRef(false);

  useEffect(() => {
    if (ganttInstance && !isDataLoadingInitiated.current) {
      isDataLoadingInitiated.current = true;
      // Initialize dataSource if it's not already an array
      if (
        !ganttInstance.dataSource ||
        !Array.isArray(ganttInstance.dataSource)
      ) {
        ganttInstance.dataSource = [];
      }
      loadData();
    }
  }, [ganttInstance]);

  function loadData() {
    const projectsBaseUrl =
      "https://dev-portal-api.include.com/includego/tenants/425db690-a10b-4199-b3ef-980be43413df/companies/debf08b8-85c2-4a99-891b-f752caa574f7/projects";
    const tasksBaseUrl =
      "https://dev-portal-api.include.com/includego/tenants/425db690-a10b-4199-b3ef-980be43413df/companies/debf08b8-85c2-4a99-891b-f752caa574f7/tasks";
    const projectsPageSize = 15; // As per user's latest change in diff
    const tasksApiPageSize = 100; // For fetching tasks related to a batch of projects

    // Recursive function to fetch pages of tasks for a given set of project IDs
    function fetchTasksRecursive(
      projectIds: string,
      taskPageNumber: number,
      accumulatedTaskItems: any[],
      onAllTasksDone: () => void
    ) {
      const tasksUrl = `${tasksBaseUrl}?page[number]=${taskPageNumber}&page[size]=${tasksApiPageSize}&sort=target_start_date&filter[projects_ids]=${projectIds}`;
      let tasksAjax = new Ajax(
        { url: tasksUrl, headers: { "Content-Type": "application/json" } },
        "GET"
      );

      tasksAjax.beforeSend = function (args: any) {
        args.httpRequest.setRequestHeader("Authorization", apiToken);
      };
      tasksAjax.send();

      tasksAjax.onSuccess = function (tasksDataStr: string) {
        const tasksResponse = JSON.parse(tasksDataStr);
        const fetchedTasks = tasksResponse.data || [];
        const totalTaskPages = tasksResponse.meta.total_pages;

        const ganttSubTaskItems = fetchedTasks.map((task: any) => ({
          TaskId: task.id,
          TaskName: "Task: " + task.attributes.name,
          StartDate: "2024-05-02", // Dummy start date for subtask
          Duration: 2, // Dummy duration for subtask
          Progress: 25, // Dummy progress
          parentID: task.relationships.projects.data[0].id, // Link to parent project
        }));

        accumulatedTaskItems.push(...ganttSubTaskItems);

        if (taskPageNumber < totalTaskPages) {
          fetchTasksRecursive(
            projectIds,
            taskPageNumber + 1,
            accumulatedTaskItems,
            onAllTasksDone
          );
        } else {
          onAllTasksDone(); // All task pages for these projects are done
        }
      };
      tasksAjax.onFailure = function () {
        console.error(
          `Failed to fetch tasks page ${taskPageNumber} for project IDs: ${projectIds}`
        );
        onAllTasksDone(); // Proceed even if tasks fail, to not block project loading
      };
    }

    // Recursive function to load pages of projects
    function loadProjectsPageRecursive(pageNumber: number) {
      const projectsUrl = `${projectsBaseUrl}?page[number]=${pageNumber}&page[size]=${projectsPageSize}&sort=project_name_lowercase`;
      let projectsAjax = new Ajax(
        { url: projectsUrl, headers: { "Content-Type": "application/json" } },
        "GET"
      );

      projectsAjax.beforeSend = function (args: any) {
        args.httpRequest.setRequestHeader("Authorization", apiToken);
      };

      if (pageNumber === 1) {
        ganttInstance.showSpinner();
      }

      projectsAjax.send();
      projectsAjax.onSuccess = function (projectsDataStr: string) {
        const projectsResponse = JSON.parse(projectsDataStr);
        const fetchedProjects = projectsResponse.data || [];
        const totalProjectPages = projectsResponse.meta.total_pages;

        if (fetchedProjects.length === 0) {
          return; // No more projects or no projects on the first page
        }

        const currentBatchGanttItems: any[] = [];

        const ganttProjectItems = fetchedProjects.map((project: any) => ({
          TaskId: project.id,
          TaskName: project.attributes.project_name,
          StartDate: "2024-05-01",
          Duration: 5,
          Progress: 50,
          isProject: true,
          expandState: false, // Expand projects to show subtasks
        }));
        currentBatchGanttItems.push(...ganttProjectItems);

        const projectIdsForTaskFetching = fetchedProjects
          .map((p: any) => p.id)
          .join(",");

        if (projectIdsForTaskFetching) {
          fetchTasksRecursive(
            projectIdsForTaskFetching,
            1,
            currentBatchGanttItems,
            () => {
              // This callback is called after all tasks for the current set of projects are fetched (or failed)
              // and added to currentBatchGanttItems.
              ganttInstance.dataSource = [
                ...ganttInstance.dataSource,
                ...currentBatchGanttItems,
              ];
              // ganttInstance.refresh(); // User had this commented out

              if (pageNumber < totalProjectPages) {
                loadProjectsPageRecursive(pageNumber + 1);
              }
            }
          );
        } else {
          // No projects had IDs to fetch tasks for, or no projects to begin with
          ganttInstance.dataSource = [
            ...ganttInstance.dataSource,
            ...currentBatchGanttItems,
          ];
          // ganttInstance.refresh();

          if (pageNumber < totalProjectPages) {
            loadProjectsPageRecursive(pageNumber + 1);
          }
        }
      };
    }

    // Start loading from project page 1
    loadProjectsPageRecursive(1);
  }

  return (
    <div>
      <GanttComponent
        taskFields={taskFields}
        height="500px"
        ref={(gantt: any) => (ganttInstance = gantt)}
        treeColumnIndex={1}
        enableVirtualization={true}
      >
        <Inject services={[VirtualScroll]} />
      </GanttComponent>
    </div>
  );
}

export default GanttPOC;
