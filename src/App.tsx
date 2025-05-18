import { useEffect } from "react";
import GanttChart from "./components/GanttChart";
import GanttChartSandBox from "./components/GanttChartSandBox";
import LoadOnDemandGanttChart from "./components/LoadOnDemandGanttChart";
import { registerServiceWorker } from "./utils/registerServiceWorker";

function App() {
	useEffect(() => {
		// Register service worker when component mounts
		registerServiceWorker();
	}, []);
	return (
		<div className="w-full">
			<div className="container mx-auto">
				<div className="flex flex-col gap-4">
					<h1 className="text-2xl font-bold">Gantt Chart</h1>
					{/* <GanttChart /> */}
					<GanttChartSandBox />
					{/* <LoadOnDemandGanttChart /> */}
				</div>
			</div>
		</div>
	);
}

export default App;
