import React from "react";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
function Graphe3BatonnetComptes({
  graphData2,
  barSpacing2,
  CustomTooltip2,
  fixedWidth2,
}) {
  const [t, i18n] = useTranslation();

  return (
    <div>
      <div
        className="w-full flex -translate-y-6 flex-col justify-end h-[300px] overflow-x-auto p-4 bg-gray-100 rounded-xl"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div style={{ width: `${fixedWidth2}px`, height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={graphData2}
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 0, bottom: -10 }}
              barCategoryGap={barSpacing2 - 10}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="shortName"
                type="category"
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis hide={true} />
              <Tooltip content={<CustomTooltip2 />} />
              <Bar
                dataKey="totalDisplay"
                fill="#22c55e"
                name="Total"
                radius={[8, 8, 0, 0]}
                barSize={7}
                animationDuration={1000}
              />

              <Bar
                dataKey="inactifsDisplay"
                fill="#9333ea"
                name="Inactifs"
                radius={[8, 8, 0, 0]}
                barSize={7}
                animationDuration={1000}
              />

              <Bar
                dataKey="actifsDisplay"
                fill="#f97316"
                name="Actifs"
                radius={[8, 8, 0, 0]}
                barSize={7}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Graphe3BatonnetComptes;
