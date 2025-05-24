import {
  GanttComponent,
  Inject,
  VirtualScroll,
  ColumnDirective,
  ColumnsDirective,
  Selection,
  type TaskFieldsModel,
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
import { useRef, useEffect } from "react";
import { DataManager, WebApiAdaptor, Query } from "@syncfusion/ej2-data";
import { CustomGanttAdaptor } from "./CustomGantAdapter";
// import { registerServiceWorker } from "../../utils/registerServiceWorker";
// import { transformApiResponse } from "../../utils/ganttDataMapper";

export interface Task {
  taskId: string;
  taskName: string;
  startDate: Date;
  endDate?: Date;
  duration?: number;
  progress?: number;
  predecessor?: string;
  parentID?: string | null;
  isParent?: boolean;
  IsExpanded?: boolean;
}

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCeExzWmFZfVtgc19CY1ZRRmYuP1ZhSXxWdkBjX39ZdHFURGVYUUB9XUs="
);

const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlY1RGxhZmhBVVZDLUpwWG1ST2p0NCJ9.eyIvcm9sZXMiOlsiZDE5ODliNDItMzM4Yy01NTI2LTliOTgtM2MyMzI4MTM3ODczIiwiZGVlNzU2MTEtODVjZC01ZTExLWEwMmEtZDNhMTA5MjdiZGJkIl0sIi9wZXJtaXNzaW9ucyI6WyI2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDBfQUNDT1VOVFMiLCJzYWZ3YXQuZmF0aGlAYm9jYS5wcm9fRU1BSUwiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OmFjY291bnRzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OmNsaWVudHM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6Y29tcGFuaWVzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OmZpbGVzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50Omludm9pY2VzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OnBheW1lbnRhZGRyZXNzZXM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6cGF5bWVudG1ldGhvZHM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6cGF5bWVudHM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6cHJvamVjdHM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6bWVzc2FnZXM6YWxsOiIsIndoZW46c2VsZjo2ODE4ZTA0Yi02ZWI0LWRhMTgtYTJiNS03ODZmMDAwMDAwMDA6Z3JhbnQ6dHJhY2tpbmdzOmFsbDoiLCJ3aGVuOnNlbGY6NjgxOGUwNGItNmViNC1kYTE4LWEyYjUtNzg2ZjAwMDAwMDAwOmdyYW50OnRpbWVjbG9ja2VudHJpZXM6YWxsOiJdLCJpc3MiOiJodHRwczovL2Rldi1hdXRoLmluY2x1ZGUuY29tLyIsInN1YiI6ImF1dGgwfDY4MThlMDRiNmViNGRhMThhMmI1Nzg2ZiIsImF1ZCI6WyJodHRwczovL2Rldi1wb3J0YWwtYXBpLmluY2x1ZGUuY29tIiwiaHR0cHM6Ly9kZXYtcnZqYS1uMXcudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTc0ODA4NzA4NywiZXhwIjoxNzQ4MTczMDg3LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXpwIjoiaDJkMG9ubGY4NU5oTDJvckpGbkg2MG1oVTRhR2JtTmIiLCJwZXJtaXNzaW9ucyI6W119.HjD-8MmcpQYREQ59NsAgFrf6EIFoUJYlyPZrlcpd6q-rMrMgR6Gh229zl60r_5Z6NhBOG3NsdLqz5HXYZos1fNYW_R_Hzns0CAmRFCos0IXpiSCTBw4pRP59AqUPnt1gnTpQbFYtlXEywlPwSzRIRC4-9g_REf3UKXNub_ZDLBVytgLjrj8Zvsq1n6rn_P2pXntqZ1UoBXjgTcl8OrxwO8ybCzPGA_bss3lYaZJHdLTZ9bGlTQfLjPjiqTHSMQ5E35nP2c7iAtT--n0sXIJFWWLEUjxw6TcMlCHmlw4T7dD-Qbn_czxNPwU4UxGRzMK4n-BviPHIy1zgzUonurJD2w";

const GanttChartSandBox = () => {
  const ganttRef = useRef<GanttComponent | null>(null);

  // const dataSourceLocal = fetch("http://localhost:3000/projects");
  // console.log(
  // 	"🚀 ~ :49 ~ GanttChartSandBox ~ dataSourceLocal:",
  // 	dataSourceLocal
  // );

  const dataSource = new DataManager({
    url: "/projects",
    // url: "https://services.syncfusion.com/react/production/api/GanttLoadOnDemand",
    // adaptor: new WebApiAdaptor(),
    adaptor: new CustomGanttAdaptor(),
    crossDomain: true,
    // enableCache: true,
    // enablePersistence: true,
    headers: [
      {
        Authorization: `Bearer ${token}`,
      },
    ],
    // cachingPageSize: 50,
  });

  // const dataSource = new DataManager({
  // 	url: "https://services.syncfusion.com/react/production/api/GanttLoadOnDemand",
  // 	adaptor: new WebApiAdaptor(),
  // 	crossDomain: true,
  // });

  // Custom query to transform the data
  // const query = new Query().addParams("transformResponse", "true");

  const taskFields: TaskFieldsModel = {
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

  const projectStartDate: Date = new Date("01/02/2020");
  const projectEndDate: Date = new Date("12/01/2025");

  // Custom adaptor to transform the response
  // const customAdaptor = new WebApiAdaptor();
  // customAdaptor.processResponse = (data: any) => {
  // 	return {
  // 		result: transformApiResponse(data),
  // 		count: data.length,
  // 	};
  // };

  return (
    <GanttComponent
      id="GanttChartSandBox"
      ref={ganttRef}
      dataSource={dataSource}
      treeColumnIndex={0}
      taskFields={taskFields}
      enableVirtualization={true}
      loadChildOnDemand={true}
      height="600px"
      width="100%"
      projectStartDate={projectStartDate}
      projectEndDate={projectEndDate}
      loadingIndicator={{ indicatorType: "Shimmer" }}
      allowSelection={true}
      // query={query}
    >
      <ColumnsDirective>
        <ColumnDirective field="taskId" width="180"></ColumnDirective>
        <ColumnDirective
          field="taskName"
          headerText="Project Name"
          width="200"
          clipMode="EllipsisWithTooltip"
        ></ColumnDirective>
        <ColumnDirective field="startDate"></ColumnDirective>
        <ColumnDirective field="duration"></ColumnDirective>
        <ColumnDirective field="progress"></ColumnDirective>
      </ColumnsDirective>
      <Inject services={[VirtualScroll, Selection]} />
    </GanttComponent>
  );
};

export default GanttChartSandBox;
