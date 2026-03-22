"use client";

interface Props {
  myPrice: number;
  min: number;
  max: number;
  avg: number;
  median: number;
  label: string;
  unit?: string;
  compareCount?: number;
}

function getComment(isExpensive: boolean, isCheap: boolean): string {
  if (isCheap) return "현재 시세보다 저렴해요. 좋은 매물입니다 👍";
  if (isExpensive) return "시세보다 높아요. 협상을 시도해보세요 💬";
  return "현재 시세와 비슷한 수준이에요";
}

export default function PriceGauge({
  myPrice,
  min,
  max,
  avg,
  median,
  label,
  unit = "만원",
  compareCount,
}: Props) {
  const lowData = compareCount !== undefined && compareCount < 5;

  // 거래가 1건이라 min === max인 경우
  if (max === min) {
    const diff = myPrice - avg;
    const isEqual = diff === 0;
    return (
      <div className="space-y-3">
        <div className="rounded-xl border bg-navy-50 border-navy-200 p-4 text-center">
          <p className="text-sm text-navy-600 mb-1">{label} 진단 결과</p>
          <p className="text-navy-500 text-sm">
            비교 가능한 거래가 1건뿐입니다 (거래가: {avg.toLocaleString()}{unit})
          </p>
          {!isEqual && (
            <p className="text-sm mt-1">
              내 가격과{" "}
              <span className={diff > 0 ? "text-price-high font-semibold" : "text-price-low font-semibold"}>
                {Math.abs(diff).toLocaleString()}{unit} 차이
              </span>
            </p>
          )}
        </div>
        {lowData && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 text-center">
            ⚠️ 데이터 부족으로 정확도가 낮을 수 있습니다
          </p>
        )}
      </div>
    );
  }

  const range = max - min;
  const padding = range * 0.1;
  const gaugeMin = Math.max(0, min - padding);
  const gaugeMax = max + padding;
  const gaugeRange = gaugeMax - gaugeMin;

  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  const myPos = clamp(((myPrice - gaugeMin) / gaugeRange) * 100);
  const avgPos = clamp(((avg - gaugeMin) / gaugeRange) * 100);
  const medianPos = clamp(((median - gaugeMin) / gaugeRange) * 100);

  // 평균과 중위값 라벨이 너무 가까우면 중위값 라벨 숨김
  const showMedianLabel = Math.abs(avgPos - medianPos) > 8;

  const diff = myPrice - avg;
  const diffPercent = avg > 0 ? ((diff / avg) * 100).toFixed(1) : "0";
  const isExpensive = diff > avg * 0.05;
  const isCheap = diff < -avg * 0.05;
  const verdict = isExpensive ? "높음" : isCheap ? "낮음" : "적정";
  const verdictColor = isExpensive
    ? "text-price-high"
    : isCheap
      ? "text-price-low"
      : "text-price-mid";
  const verdictBg = isExpensive
    ? "bg-red-50 border-red-200"
    : isCheap
      ? "bg-emerald-50 border-emerald-200"
      : "bg-amber-50 border-amber-200";

  return (
    <div className="space-y-4">
      {lowData && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 text-center">
          ⚠️ 비교 대상이 {compareCount}건으로 정확도가 낮을 수 있습니다
        </p>
      )}

      <div className={`rounded-xl border p-4 ${verdictBg}`}>
        <p className="text-sm text-navy-600 mb-1">{label} 진단 결과</p>
        <p className={`text-2xl font-bold ${verdictColor}`}>
          시세 대비 {verdict}
        </p>
        <p className="text-sm text-navy-500 mt-1">
          평균 대비{" "}
          <span className={`font-semibold ${verdictColor}`}>
            {diff > 0 ? "+" : ""}
            {diff.toLocaleString()}
            {unit} ({diff > 0 ? "+" : ""}
            {diffPercent}%)
          </span>
        </p>
        <p className="text-sm mt-2 text-navy-600">
          {getComment(isExpensive, isCheap)}
        </p>
      </div>

      {/* 게이지 바 */}
      <div className="relative pt-8 pb-6">
        {/* 배경 바 */}
        <div className="h-3 rounded-full bg-gradient-to-r from-price-low via-price-mid to-price-high opacity-80" />

        {/* 평균 마커 */}
        <div
          className="absolute top-0 flex flex-col items-center"
          style={{ left: `${avgPos}%`, transform: "translateX(-50%)" }}
        >
          <span className="text-[10px] text-navy-500 whitespace-nowrap">
            {showMedianLabel ? "평균" : "평균/중위"} {avg.toLocaleString()}
          </span>
          <div className="w-0.5 h-3 bg-navy-400 mt-0.5" />
        </div>

        {/* 중위값 마커 */}
        <div
          className="absolute flex flex-col items-center"
          style={{
            left: `${medianPos}%`,
            transform: "translateX(-50%)",
            bottom: 0,
          }}
        >
          <div className="w-0.5 h-3 bg-navy-300" />
          {showMedianLabel && (
            <span className="text-[10px] text-navy-400 whitespace-nowrap">
              중위 {median.toLocaleString()}
            </span>
          )}
        </div>

        {/* 내 가격 마커 (파란색) */}
        <div
          className="absolute top-5 flex flex-col items-center"
          style={{ left: `${myPos}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 whitespace-nowrap">
            {myPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 범위 */}
      <div className="flex justify-between text-xs text-navy-400">
        <span>
          최저 {min.toLocaleString()}
          {unit}
        </span>
        <span>
          최고 {max.toLocaleString()}
          {unit}
        </span>
      </div>
    </div>
  );
}
