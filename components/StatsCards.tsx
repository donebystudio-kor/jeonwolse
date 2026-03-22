"use client";

interface Props {
  totalCount: number;
  jeonseCount: number;
  wolseCount: number;
  avgJeonse: number;
  avgWolseDeposit: number;
  avgMonthlyRent: number;
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm">
      <p className="text-xs text-navy-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-navy-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function StatsCards({
  totalCount,
  jeonseCount,
  wolseCount,
  avgJeonse,
  avgWolseDeposit,
  avgMonthlyRent,
}: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        label="총 거래"
        value={`${totalCount}건`}
        sub={`전세 ${jeonseCount} / 월세 ${wolseCount}`}
        color="text-navy-900"
      />
      <StatCard
        label="전세 평균"
        value={`${avgJeonse.toLocaleString()}`}
        sub="만원"
        color="text-blue-600"
      />
      <StatCard
        label="월세 보증금 평균"
        value={`${avgWolseDeposit.toLocaleString()}`}
        sub="만원"
        color="text-navy-700"
      />
      <StatCard
        label="월세 평균"
        value={`${avgMonthlyRent.toLocaleString()}`}
        sub="만원/월"
        color="text-amber-600"
      />
    </div>
  );
}
