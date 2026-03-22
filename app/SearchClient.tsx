"use client";

import { useState, useMemo } from "react";
import { SIDO, SIGUNGU } from "@/constants/regions";
import StatsCards from "@/components/StatsCards";
import PriceGauge from "@/components/PriceGauge";
import TransactionTable from "@/components/TransactionTable";
import KakaoShare from "@/components/KakaoShare";

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
  jibun: string;
  roadnm: string;
  sggCd: string;
  useRRRight: string;
  preDeposit: string;
  preMonthlyRent: string;
}

const parseNum = (s: string) => Number(String(s).replace(/,/g, "").trim()) || 0;
const M2_TO_PYEONG = 0.3025;
const PYEONG_TO_M2 = 3.3058;
const toPyeong = (m2: number) => Math.round(m2 * M2_TO_PYEONG * 10) / 10;
const toM2 = (py: number) => Math.round(py * PYEONG_TO_M2 * 100) / 100;
const formatArea = (m2: string, usePyeong: boolean) => {
  const val = parseFloat(m2);
  if (isNaN(val)) return m2;
  return usePyeong ? `${toPyeong(val)}평` : `${val}m²`;
};

type BuildingType = "apt" | "officetel" | "rowhouse" | "house";

const BUILDING_TYPES: { value: BuildingType; label: string }[] = [
  { value: "apt", label: "아파트" },
  { value: "officetel", label: "오피스텔" },
  { value: "rowhouse", label: "연립다세대" },
  { value: "house", label: "단독/다가구" },
];

const BUILDING_NAME_LABELS: Record<BuildingType, string> = {
  apt: "아파트명",
  officetel: "오피스텔명",
  rowhouse: "건물명",
  house: "",
};

const AREA_LABELS: Record<BuildingType, string> = {
  apt: "전용면적",
  officetel: "전용면적",
  rowhouse: "전용면적",
  house: "계약면적",
};

export default function SearchClient() {
  const [buildingType, setBuildingType] = useState<BuildingType>("apt");
  const [sidoCode, setSidoCode] = useState("");
  const [sggCode, setSggCode] = useState("");
  const [aptName, setAptName] = useState("");
  const [monthCount, setMonthCount] = useState("3");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searched, setSearched] = useState(false);

  // 내 가격 입력
  const [rentType, setRentType] = useState<"jeonse" | "wolse">("jeonse");
  const [myDeposit, setMyDeposit] = useState("");
  const [myMonthly, setMyMonthly] = useState("");
  const [myArea, setMyArea] = useState("");

  // 면적 단위 토글 (myArea는 항상 m² 기준으로 저장)
  const [usePyeong, setUsePyeong] = useState(false);

  const handleToggleUnit = () => {
    setUsePyeong((prev) => !prev);
  };

  // 면적 입력 표시값 (usePyeong이면 평으로 환산해서 표시)
  const myAreaDisplay = useMemo(() => {
    if (!myArea) return "";
    const m2 = parseFloat(myArea);
    if (isNaN(m2)) return myArea;
    return usePyeong ? String(toPyeong(m2)) : myArea;
  }, [myArea, usePyeong]);

  const handleAreaInput = (val: string) => {
    if (!val) {
      setMyArea("");
      return;
    }
    // 입력값을 항상 m²로 변환하여 저장
    if (usePyeong) {
      const py = parseFloat(val);
      if (!isNaN(py)) setMyArea(String(toM2(py)));
    } else {
      setMyArea(val);
    }
  };

  // 면적 필터
  const [areaFilter, setAreaFilter] = useState("");

  const sigunguList = sidoCode ? SIGUNGU[sidoCode] || [] : [];

  const clearResults = () => {
    setTransactions([]);
    setTotalCount(0);
    setSearched(false);
    setAreaFilter("");
  };

  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!sggCode || loading) return;
    setLoading(true);
    setSearched(true);
    setError("");

    try {
      const params = new URLSearchParams({
        lawdCd: sggCode,
        months: monthCount,
        buildingType,
      });
      if (aptName.trim() && buildingType !== "house") params.set("aptName", aptName.trim());

      const res = await fetch(`/api/search?${params}`);
      if (!res.ok) throw new Error("서버 오류");
      const data = await res.json();

      setTransactions(data.transactions || []);
      setTotalCount(data.totalCount || 0);
    } catch {
      setTransactions([]);
      setTotalCount(0);
      setError("데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 면적별 필터링
  const filtered = useMemo(() => {
    if (!areaFilter) return transactions;
    const [min, max] = areaFilter.split("-").map(Number);
    return transactions.filter((t) => {
      const area = parseFloat(t.excluUseAr);
      return area >= min && area < max;
    });
  }, [transactions, areaFilter]);

  // 통계 계산
  const stats = useMemo(() => {
    const jeonse = filtered.filter((t) => parseNum(t.monthlyRent) === 0);
    const wolse = filtered.filter((t) => parseNum(t.monthlyRent) > 0);

    const jeonseDeposits = jeonse.map((t) => parseNum(t.deposit));
    const wolseDeposits = wolse.map((t) => parseNum(t.deposit));
    const monthlyRents = wolse.map((t) => parseNum(t.monthlyRent));

    const avg = (arr: number[]) =>
      arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    const median = (arr: number[]) => {
      if (!arr.length) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    };
    const min = (arr: number[]) => (arr.length ? Math.min(...arr) : 0);
    const max = (arr: number[]) => (arr.length ? Math.max(...arr) : 0);

    return {
      totalCount: filtered.length,
      jeonseCount: jeonse.length,
      wolseCount: wolse.length,
      avgJeonse: avg(jeonseDeposits),
      medianJeonse: median(jeonseDeposits),
      minJeonse: min(jeonseDeposits),
      maxJeonse: max(jeonseDeposits),
      avgWolseDeposit: avg(wolseDeposits),
      medianWolseDeposit: median(wolseDeposits),
      minWolseDeposit: min(wolseDeposits),
      maxWolseDeposit: max(wolseDeposits),
      avgMonthlyRent: avg(monthlyRents),
      medianMonthlyRent: median(monthlyRents),
      minMonthlyRent: min(monthlyRents),
      maxMonthlyRent: max(monthlyRents),
    };
  }, [filtered]);

  // 면적 구간 옵션 계산
  const areaOptions = useMemo(() => {
    const areas = transactions.map((t) => parseFloat(t.excluUseAr));
    if (!areas.length) return [];
    const ranges = [
      { label: "전체", labelPy: "전체", value: "" },
      { label: "~60m²", labelPy: "~18평", value: "0-60" },
      { label: "60~85m²", labelPy: "18~25평", value: "60-85" },
      { label: "85~135m²", labelPy: "25~40평", value: "85-135" },
      { label: "135m²~", labelPy: "40평~", value: "135-9999" },
    ];
    return ranges.filter((r) => {
      if (!r.value) return true;
      const [min, max] = r.value.split("-").map(Number);
      return areas.some((a) => a >= min && a < max);
    });
  }, [transactions]);

  // 진단용 필터링: 전체 거래에서 내 면적 ±10% 범위만 비교 (면적 필터 무시)
  const diagnosisFiltered = useMemo(() => {
    if (!myArea) return transactions;
    const area = parseFloat(myArea);
    if (!area) return transactions;
    const margin = area * 0.1;
    return transactions.filter((t) => {
      const tArea = parseFloat(t.excluUseAr);
      return tArea >= area - margin && tArea <= area + margin;
    });
  }, [transactions, myArea]);

  const diagnosisStats = useMemo(() => {
    const data = diagnosisFiltered;
    const jeonse = data.filter((t) => parseNum(t.monthlyRent) === 0);
    const wolse = data.filter((t) => parseNum(t.monthlyRent) > 0);

    const jeonseDeposits = jeonse.map((t) => parseNum(t.deposit));
    const wolseDeposits = wolse.map((t) => parseNum(t.deposit));
    const monthlyRents = wolse.map((t) => parseNum(t.monthlyRent));

    const avg = (arr: number[]) =>
      arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    const median = (arr: number[]) => {
      if (!arr.length) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    };
    const min = (arr: number[]) => (arr.length ? Math.min(...arr) : 0);
    const max = (arr: number[]) => (arr.length ? Math.max(...arr) : 0);

    return {
      jeonseCount: jeonse.length,
      wolseCount: wolse.length,
      avgJeonse: avg(jeonseDeposits),
      medianJeonse: median(jeonseDeposits),
      minJeonse: min(jeonseDeposits),
      maxJeonse: max(jeonseDeposits),
      avgWolseDeposit: avg(wolseDeposits),
      medianWolseDeposit: median(wolseDeposits),
      minWolseDeposit: min(wolseDeposits),
      maxWolseDeposit: max(wolseDeposits),
      avgMonthlyRent: avg(monthlyRents),
      medianMonthlyRent: median(monthlyRents),
      minMonthlyRent: min(monthlyRents),
      maxMonthlyRent: max(monthlyRents),
      compareCount: data.length,
    };
  }, [diagnosisFiltered]);

  const regionName = useMemo(() => {
    const sido = SIDO.find((s) => s.code === sidoCode);
    const sgg = sigunguList.find((s) => s.code === sggCode);
    return [sido?.name, sgg?.name].filter(Boolean).join(" ");
  }, [sidoCode, sggCode, sigunguList]);

  return (
    <div className="space-y-8">
      {/* 건물 유형 */}
      <div className="flex gap-2">
        {BUILDING_TYPES.map((bt) => (
          <button
            key={bt.value}
            onClick={() => { setBuildingType(bt.value); setAptName(""); clearResults(); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              buildingType === bt.value
                ? "bg-navy-900 text-white"
                : "bg-white border border-navy-200 text-navy-600 hover:bg-navy-50"
            }`}
          >
            {bt.label}
          </button>
        ))}
      </div>

      {/* 검색 폼 */}
      <div className="bg-white rounded-2xl border border-navy-100 shadow-sm p-5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 시/도 */}
          <div>
            <label className="block text-xs font-medium text-navy-600 mb-1.5">
              시/도
            </label>
            <select
              value={sidoCode}
              onChange={(e) => {
                setSidoCode(e.target.value);
                setSggCode("");
                clearResults();
              }}
              className="w-full border border-navy-200 rounded-xl px-4 py-3 text-sm bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-400"
            >
              <option value="">선택하세요</option>
              {SIDO.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 시/군/구 */}
          <div>
            <label className="block text-xs font-medium text-navy-600 mb-1.5">
              시/군/구
            </label>
            <select
              value={sggCode}
              onChange={(e) => { setSggCode(e.target.value); clearResults(); }}
              disabled={!sidoCode}
              className="w-full border border-navy-200 rounded-xl px-4 py-3 text-sm bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-400 disabled:bg-navy-50 disabled:text-navy-300"
            >
              <option value="">선택하세요</option>
              {sigunguList.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 건물명 (단독/다가구는 건물명 없음) */}
          {buildingType !== "house" && (
            <div>
              <label className="block text-xs font-medium text-navy-600 mb-1.5">
                {BUILDING_NAME_LABELS[buildingType]} (선택)
              </label>
              <input
                type="text"
                value={aptName}
                onChange={(e) => { setAptName(e.target.value); clearResults(); }}
                placeholder={buildingType === "apt" ? "예: 래미안, 자이, 힐스테이트" : "예: 건물명 입력"}
                className="w-full border border-navy-200 rounded-xl px-4 py-3 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-navy-400"
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSearch()}
              />
            </div>
          )}

          {/* 조회 기간 */}
          <div>
            <label className="block text-xs font-medium text-navy-600 mb-1.5">
              조회 기간
            </label>
            <select
              value={monthCount}
              onChange={(e) => { setMonthCount(e.target.value); clearResults(); }}
              className="w-full border border-navy-200 rounded-xl px-4 py-3 text-sm bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-400"
            >
              <option value="1">최근 1개월</option>
              <option value="3">최근 3개월</option>
              <option value="6">최근 6개월</option>
              <option value="12">최근 1년</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={!sggCode || loading}
          className="w-full mt-5 bg-navy-900 text-white font-semibold py-3.5 rounded-xl hover:bg-navy-800 transition-colors disabled:bg-navy-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="animate-pulse-slow">검색 중...</span>
          ) : (
            "실거래가 검색"
          )}
        </button>
      </div>

      {/* 검색 결과 */}
      {searched && !loading && (
        <div className="animate-fade-in-up space-y-6">
          {error ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">⚠️</p>
              <p className="text-navy-600 font-medium">{error}</p>
              <button
                onClick={handleSearch}
                className="mt-4 px-5 py-2 bg-navy-900 text-white text-sm rounded-xl hover:bg-navy-800 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🏠</p>
              <p className="text-navy-600 font-medium">
                검색 결과가 없습니다
              </p>
              <p className="text-sm text-navy-400 mt-1">
                다른 지역이나 기간을 선택해보세요
              </p>
            </div>
          ) : (
            <>
              {/* 결과 헤더 */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-navy-900">
                    {regionName}
                    {aptName && buildingType !== "house" ? ` "${aptName}"` : ""}{" "}
                    {BUILDING_TYPES.find((b) => b.value === buildingType)?.label} 실거래 현황
                  </h2>
                  <p className="text-sm text-navy-500 mt-1">
                    최근 {Number(monthCount) >= 12 ? "1년" : `${monthCount}개월`} · 총 {totalCount}건
                  </p>
                </div>
                <button
                  onClick={handleToggleUnit}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-navy-200 text-navy-600 hover:bg-navy-50 transition-colors"
                >
                  {usePyeong ? "m² 보기" : "평 보기"}
                </button>
              </div>

              {/* 면적 필터 */}
              <p className="text-[11px] text-navy-400">
                ※ 면적은 {AREA_LABELS[buildingType]} 기준입니다{buildingType !== "house" ? " (네이버부동산 등에 표시되는 공급면적과 다를 수 있습니다)" : ""}
              </p>
              {areaOptions.length > 2 && (
                <div className="flex gap-2 flex-wrap">
                  {areaOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAreaFilter(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        areaFilter === opt.value
                          ? "bg-navy-900 text-white"
                          : "bg-white border border-navy-200 text-navy-600 hover:bg-navy-50"
                      }`}
                    >
                      {usePyeong ? opt.labelPy : opt.label}
                    </button>
                  ))}
                </div>
              )}

              {/* 통계 카드 */}
              <StatsCards
                totalCount={stats.totalCount}
                jeonseCount={stats.jeonseCount}
                wolseCount={stats.wolseCount}
                avgJeonse={stats.avgJeonse}
                avgWolseDeposit={stats.avgWolseDeposit}
                avgMonthlyRent={stats.avgMonthlyRent}
              />

              {/* 내 가격 진단 */}
              <div className="bg-white rounded-2xl border border-navy-100 shadow-sm p-5 md:p-6">
                <h3 className="text-lg font-bold text-navy-900 mb-5 text-center">
                  내 전월세 진단하기
                </h3>

                <div className="max-w-md mx-auto space-y-4">
                  {/* 전세/월세 탭 */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setRentType("jeonse"); setMyDeposit(""); setMyMonthly(""); setMyArea(""); }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        rentType === "jeonse"
                          ? "bg-blue-600 text-white"
                          : "bg-navy-50 text-navy-600"
                      }`}
                    >
                      전세
                    </button>
                    <button
                      onClick={() => { setRentType("wolse"); setMyDeposit(""); setMyMonthly(""); setMyArea(""); }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        rentType === "wolse"
                          ? "bg-amber-500 text-white"
                          : "bg-navy-50 text-navy-600"
                      }`}
                    >
                      월세
                    </button>
                  </div>

                  {/* 면적 */}
                  <div>
                    <label className="block text-xs text-navy-500 mb-1">
                      {AREA_LABELS[buildingType]} ({usePyeong ? "평" : "m²"})
                    </label>
                    <input
                      type="number"
                      value={myAreaDisplay}
                      onChange={(e) => handleAreaInput(e.target.value)}
                      placeholder={usePyeong ? "예: 18" : "예: 59"}
                      className="w-full border border-navy-200 rounded-xl px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-400"
                    />
                    {myArea && (
                      <p className="text-[10px] text-navy-400 mt-1">
                        = {usePyeong ? `${parseFloat(parseFloat(myArea).toFixed(1))}m²` : `${toPyeong(parseFloat(myArea))}평`} · ±10% 범위 비교
                      </p>
                    )}
                    <p className="text-[10px] text-navy-300 mt-1">
                      ※ {AREA_LABELS[buildingType]} 기준입니다{buildingType !== "house" ? " (네이버부동산 등에 표시되는 공급면적과 다를 수 있습니다)" : ""}
                    </p>
                  </div>

                  {/* 보증금 */}
                  <div>
                    <label className="block text-xs text-navy-500 mb-1">
                      보증금 (만원)
                    </label>
                    <input
                      type="number"
                      value={myDeposit}
                      onChange={(e) => setMyDeposit(e.target.value)}
                      placeholder="예: 30000"
                      className="w-full border border-navy-200 rounded-xl px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-400"
                    />
                  </div>

                  {/* 월세 (월세 탭일 때만) */}
                  {rentType === "wolse" && (
                    <div>
                      <label className="block text-xs text-navy-500 mb-1">
                        월세 (만원)
                      </label>
                      <input
                        type="number"
                        value={myMonthly}
                        onChange={(e) => setMyMonthly(e.target.value)}
                        placeholder="예: 80"
                        className="w-full border border-navy-200 rounded-xl px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-400"
                      />
                    </div>
                  )}
                </div>

                {/* 진단 결과 게이지 */}
                {myDeposit && myArea && rentType === "jeonse" && diagnosisStats.jeonseCount > 0 && (
                  <div>
                    <p className="text-xs text-navy-500 mb-3">
                      {formatArea(myArea, usePyeong)} 기준 · 비교 대상 {diagnosisStats.jeonseCount}건
                    </p>
                    <PriceGauge
                      myPrice={Number(myDeposit)}
                      min={diagnosisStats.minJeonse}
                      max={diagnosisStats.maxJeonse}
                      avg={diagnosisStats.avgJeonse}
                      median={diagnosisStats.medianJeonse}
                      label="전세 보증금"
                      compareCount={diagnosisStats.jeonseCount}
                    />
                  </div>
                )}
                {myDeposit && myArea && rentType === "wolse" && diagnosisStats.wolseCount > 0 && (
                  <div className="space-y-6">
                    <p className="text-xs text-navy-500">
                      {formatArea(myArea, usePyeong)} 기준 · 비교 대상 {diagnosisStats.wolseCount}건
                    </p>
                    <PriceGauge
                      myPrice={Number(myDeposit)}
                      min={diagnosisStats.minWolseDeposit}
                      max={diagnosisStats.maxWolseDeposit}
                      avg={diagnosisStats.avgWolseDeposit}
                      median={diagnosisStats.medianWolseDeposit}
                      label="월세 보증금"
                      compareCount={diagnosisStats.wolseCount}
                    />
                    {myMonthly && (
                      <PriceGauge
                        myPrice={Number(myMonthly)}
                        min={diagnosisStats.minMonthlyRent}
                        max={diagnosisStats.maxMonthlyRent}
                        avg={diagnosisStats.avgMonthlyRent}
                        median={diagnosisStats.medianMonthlyRent}
                        label="월세"
                        unit="만원/월"
                        compareCount={diagnosisStats.wolseCount}
                      />
                    )}
                  </div>
                )}

                {myDeposit && myArea && diagnosisStats.compareCount === 0 && (
                  <p className="text-center text-sm text-navy-400 py-6">
                    해당 면적 범위의 거래 내역이 없습니다. 면적을 조정해보세요.
                  </p>
                )}

                {(!myDeposit || !myArea) && (
                  <p className="text-center text-sm text-navy-400 py-6">
                    전용면적과 보증금을 입력하면 같은 면적대 시세와 비교합니다
                  </p>
                )}
              </div>

              {/* 카카오톡 공유 */}
              {myDeposit && myArea && diagnosisStats.compareCount > 0 && (
                <KakaoShare
                  region={regionName}
                  area={myArea}
                  rentType={rentType}
                  deposit={myDeposit}
                  monthly={myMonthly}
                  verdict={
                    rentType === "jeonse"
                      ? (Number(myDeposit) - diagnosisStats.avgJeonse > diagnosisStats.avgJeonse * 0.05
                          ? "시세 대비 높음"
                          : Number(myDeposit) - diagnosisStats.avgJeonse < -diagnosisStats.avgJeonse * 0.05
                            ? "시세 대비 낮음"
                            : "적정 수준")
                      : (Number(myDeposit) - diagnosisStats.avgWolseDeposit > diagnosisStats.avgWolseDeposit * 0.05
                          ? "시세 대비 높음"
                          : Number(myDeposit) - diagnosisStats.avgWolseDeposit < -diagnosisStats.avgWolseDeposit * 0.05
                            ? "시세 대비 낮음"
                            : "적정 수준")
                  }
                />
              )}

              {/* 거래 내역 */}
              <div>
                <h3 className="text-lg font-bold text-navy-900 mb-1">
                  거래 내역
                </h3>
                <p className="text-[11px] text-navy-400 mb-4">
                  ※ 면적은 {AREA_LABELS[buildingType]} 기준입니다{buildingType !== "house" ? " (네이버부동산 등에 표시되는 공급면적과 다를 수 있습니다)" : ""}
                </p>
                <TransactionTable transactions={filtered} usePyeong={usePyeong} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
