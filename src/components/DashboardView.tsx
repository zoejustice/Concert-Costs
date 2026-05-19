"use client";

import type { Concert } from "@/lib/types";
import {
  COST_FIELDS,
  formatCurrency,
  getCostPerHour,
  getFunPointsPer100,
  getTotalCost,
} from "@/lib/concert-math";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#f43f5e",
  "#84cc16",
];

function truncateLabel(label: string, max = 18) {
  return label.length > max ? `${label.slice(0, max)}…` : label;
}

export function DashboardView({ concerts }: { concerts: Concert[] }) {
  if (concerts.length === 0) {
    return (
      <div className="card bg-base-100 border border-dashed border-base-300">
        <div className="card-body items-center text-center py-16">
          <h2 className="text-xl font-semibold">Your dashboard is waiting</h2>
          <p className="text-base-content/70 max-w-md">
            No concerts logged yet. Add your first concert to start seeing your
            dashboard.
          </p>
        </div>
      </div>
    );
  }

  const totals = concerts.map((c) => ({
    concert: c,
    total: getTotalCost(c),
    costPerHour: getCostPerHour(c),
    funPer100: getFunPointsPer100(c),
  }));

  const totalSpent = totals.reduce((sum, t) => sum + t.total, 0);
  const avgCost = totalSpent / concerts.length;
  const avgFun =
    concerts.reduce((sum, c) => sum + c.fun_rating, 0) / concerts.length;
  const avgCostPerHour =
    totals.reduce((sum, t) => sum + t.costPerHour, 0) / concerts.length;

  const bestValue = [...totals].sort((a, b) => b.funPer100 - a.funPer100)[0];
  const mostExpensive = [...totals].sort((a, b) => b.total - a.total)[0];
  const highestFun = [...concerts].sort(
    (a, b) => b.fun_rating - a.fun_rating,
  )[0];

  const categoryTotals = COST_FIELDS.map(({ key, label }) => ({
    name: label,
    value: concerts.reduce((sum, c) => sum + Number(c[key]), 0),
  })).filter((c) => c.value > 0);

  const byConcert = totals.map(({ concert, total, funPer100 }) => ({
    name: truncateLabel(concert.concert_name),
    total,
    fun: concert.fun_rating,
    funPer100,
  }));

  const statCards = [
    { title: "Total concerts", value: String(concerts.length) },
    { title: "Total amount spent", value: formatCurrency(totalSpent) },
    { title: "Average cost per concert", value: formatCurrency(avgCost) },
    { title: "Average fun rating", value: avgFun.toFixed(1) },
    { title: "Average cost per hour", value: formatCurrency(avgCostPerHour) },
    {
      title: "Best value concert",
      value: bestValue.concert.concert_name,
      desc: `${bestValue.funPer100.toFixed(2)} Fun Points per $100`,
    },
    {
      title: "Most expensive concert",
      value: mostExpensive.concert.concert_name,
      desc: formatCurrency(mostExpensive.total),
    },
    {
      title: "Highest fun rating",
      value: highestFun.concert_name,
      desc: `${highestFun.fun_rating} / 10`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="stat bg-base-100 border border-base-300 shadow-sm rounded-box"
          >
            <div className="stat-title text-xs">{card.title}</div>
            <div className="stat-value text-lg leading-tight">{card.value}</div>
            {card.desc ? (
              <div className="stat-desc">{card.desc}</div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Spending by cost category">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryTotals}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(props) => {
                  const name = props.name ?? "";
                  const percent = props.percent ?? 0;
                  return `${name} ${(percent * 100).toFixed(0)}%`;
                }}
              >
                {categoryTotals.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => formatCurrency(Number(v ?? 0))}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Total cost by concert">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byConcert} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `$${v}`} />
              <Tooltip
                formatter={(v) => formatCurrency(Number(v ?? 0))}
              />
              <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fun rating by concert">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byConcert} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="fun" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fun Points per $100 by concert">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byConcert} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip
                formatter={(v) => [
                  Number(v ?? 0).toFixed(2),
                  "Fun Points per $100",
                ]}
              />
              <Bar dataKey="funPer100" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body">
        <h3 className="card-title text-base mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );
}
