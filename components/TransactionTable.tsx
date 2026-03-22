"use client";

import { useState, useMemo } from "react";

interface Transaction {
  aptNm: string;
  buildYear: string;
  dealDay: string;
  dealMonth: string;
  dealYear: string;
  deposit: string;
  excluUseAr: string;
  floor: string;
  monthlyRent: string;
  umdNm: string;
  contractType: string;
}

const toPyeong = (m2: number) => Math.round(m2 * 0.3025 * 10) / 10;
const fmtArea = (m2: string, usePyeong: boolean) => {
  const val = parseFloat(m2);
  if (isNaN(val)) return m2;
  return usePyeong ? `${toPyeong(val)}평` : `${val}m²`;
};

interface Props {
  transactions: Transaction[];
  usePyeong?: boolean;
}

type SortKey = "date" | "deposit" | "area" | "apt";

export default function TransactionTable({ transactions, usePyeong = false }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [showAll, setShowAll] = useState(false);

  const parseNum = (s: string) => Number(String(s).replace(/,/g, "").trim()) || 0;

  const sorted = useMemo(() => [...transactions].sort((a, b) => {
    switch (sortKey) {
      case "date": {
        const da = `${a.dealYear}${String(a.dealMonth).padStart(2, "0")}${String(a.dealDay).padStart(2, "0")}`;
        const db = `${b.dealYear}${String(b.dealMonth).padStart(2, "0")}${String(b.dealDay).padStart(2, "0")}`;
        return db.localeCompare(da);
      }
      case "deposit":
        return parseNum(b.deposit) - parseNum(a.deposit);
      case "area":
        return parseFloat(b.excluUseAr) - parseFloat(a.excluUseAr);
      case "apt":
        return (a.aptNm || "").localeCompare(b.aptNm || "");
      default:
        return 0;
    }
  }), [transactions, sortKey]);

  const visible = showAll ? sorted : sorted.slice(0, 20);

  return (
    <div>
      {/* 정렬 버튼 */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {(
          [
            ["date", "최신순"],
            ["deposit", "보증금순"],
            ["area", "면적순"],
            ["apt", "이름순"],
          ] as [SortKey, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSortKey(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sortKey === key
                ? "bg-navy-900 text-white"
                : "bg-white border border-navy-200 text-navy-600 hover:bg-navy-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 모바일: 카드 뷰 */}
      <div className="md:hidden space-y-2">
        {visible.map((t, i) => {
          const isJeonse = parseNum(t.monthlyRent) === 0;
          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-navy-100 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm text-navy-900">
                    {t.aptNm || t.umdNm}
                  </p>
                  <p className="text-xs text-navy-400">
                    {t.umdNm} · {fmtArea(t.excluUseAr, usePyeong)}{t.floor ? ` · ${t.floor}층` : ""}
                  </p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isJeonse
                      ? "bg-blue-50 text-blue-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {isJeonse ? "전세" : "월세"}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-lg font-bold text-navy-900">
                    {parseNum(t.deposit).toLocaleString()}
                  </span>
                  <span className="text-xs text-navy-500 ml-1">만원</span>
                  {!isJeonse && (
                    <span className="text-sm text-amber-600 ml-2">
                      / {parseNum(t.monthlyRent).toLocaleString()}만원
                    </span>
                  )}
                </div>
                <span className="text-xs text-navy-400">
                  {t.dealYear}.{String(t.dealMonth).padStart(2, "0")}.
                  {String(t.dealDay).padStart(2, "0")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 데스크톱: 테이블 뷰 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-200 text-navy-600">
              <th className="text-left py-3 px-2 font-medium">건물명</th>
              <th className="text-left py-3 px-2 font-medium">동</th>
              <th className="text-right py-3 px-2 font-medium">면적</th>
              <th className="text-right py-3 px-2 font-medium">층</th>
              <th className="text-right py-3 px-2 font-medium">보증금</th>
              <th className="text-right py-3 px-2 font-medium">월세</th>
              <th className="text-center py-3 px-2 font-medium">유형</th>
              <th className="text-right py-3 px-2 font-medium">계약일</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((t, i) => {
              const isJeonse = parseNum(t.monthlyRent) === 0;
              return (
                <tr
                  key={i}
                  className="border-b border-navy-50 hover:bg-navy-50 transition-colors"
                >
                  <td className="py-2.5 px-2 font-medium text-navy-900">
                    {t.aptNm || t.umdNm}
                  </td>
                  <td className="py-2.5 px-2 text-navy-500">{t.umdNm}</td>
                  <td className="py-2.5 px-2 text-right text-navy-600">
                    {fmtArea(t.excluUseAr, usePyeong)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-navy-600">
                    {t.floor || "-"}
                  </td>
                  <td className="py-2.5 px-2 text-right font-semibold text-navy-900">
                    {t.deposit}
                  </td>
                  <td className="py-2.5 px-2 text-right text-amber-600">
                    {isJeonse ? "-" : t.monthlyRent}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isJeonse
                          ? "bg-blue-50 text-blue-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {isJeonse ? "전세" : "월세"}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right text-navy-400">
                    {t.dealYear}.{String(t.dealMonth).padStart(2, "0")}.
                    {String(t.dealDay).padStart(2, "0")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 더보기 */}
      {!showAll && sorted.length > 20 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-2.5 bg-white border border-navy-200 text-navy-600 rounded-xl text-sm hover:bg-navy-50 transition-colors"
          >
            전체 {sorted.length}건 보기
          </button>
        </div>
      )}
    </div>
  );
}
