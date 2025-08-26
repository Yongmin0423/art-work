import { Line } from "recharts";
import { ChartTooltipContent, type ChartConfig } from "~/components/ui/chart";
import { ChartTooltip } from "~/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ChartContainer } from "~/components/ui/chart";
import { CartesianGrid, LineChart, XAxis } from "recharts";
import { useOutletContext } from "react-router";
import type { Route } from "./+types/dashboard-page";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Dashboard | wemake" }];
};

const chartData = [
  { month: "January", views: 186 },
  { month: "February", views: 305 },
  { month: "March", views: 237 },
  { month: "April", views: 73 },
  { month: "May", views: 209 },
  { month: "June", views: 214 },
];
const chartConfig = {
  views: {
    label: "👁️",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

type OutletContext = {
  isLoggedIn: boolean;
  name?: string;
  userId?: string;
  username?: string;
  avatar?: string;
  email?: string;
  isAdmin?: boolean;
};

export default function DashboardPage() {
  const context = useOutletContext<OutletContext>();
  const isAdmin = context?.isAdmin ?? false;

  return (
    <div className="w-full space-y-5">
      <h1 className="text-2xl font-semibold mb-6">
        {isAdmin ? "관리자 대시보드" : "Dashboard"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile views</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <Line
                  dataKey="views"
                  type="natural"
                  stroke="var(--color-views)"
                  strokeWidth={2}
                  dot={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>관리자 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>총 사용자 수</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span>대기 중인 커미션</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span>미처리 주문</span>
                  <span className="font-semibold">5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
