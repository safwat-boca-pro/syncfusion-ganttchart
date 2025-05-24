import { useEffect } from "react";
import GanttChart from "./components/GanttChart";
import GanttChartSandBox from "./components/GanttChartSandBox";
import LoadOnDemandGanttChart from "./components/LoadOnDemandGanttChart";
import { registerServiceWorker } from "./utils/registerServiceWorker";
import GanttPOC from "./components/GanttChartSandBox/GanttPOC";

function App() {
  useEffect(() => {
    // Register service worker when component mounts
    registerServiceWorker();
  }, []);
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Custom Gantt Chart</h1>
          {/* <GanttChart /> */}
          <GanttChartSandBox />
          {/* <GanttPOC /> */}
          <h1 className="text-2xl font-bold">Load On Demand Gantt Chart</h1>
          <LoadOnDemandGanttChart />
        </div>
      </div>
    </div>
  );
}

export default App;
