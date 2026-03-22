import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "서비스 소개 | 전월세 진단기",
  description:
    "전월세 진단기는 국토교통부 실거래가 데이터를 기반으로 아파트 전월세 적정가를 진단해주는 무료 서비스입니다.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-navy-500 text-sm hover:text-navy-700 transition-colors mb-8 inline-block"
        >
          ← 홈으로
        </Link>
        <h1 className="text-2xl font-bold text-navy-900 mb-6">서비스 소개</h1>

        <div className="space-y-6 text-sm leading-7 text-navy-700">
          <section>
            <h2 className="text-navy-900 text-base font-semibold mb-2">
              전월세 진단기란?
            </h2>
            <p>
              전월세 진단기는 국토교통부가 제공하는 아파트, 오피스텔,
              연립다세대, 단독/다가구 전월세 실거래가 공공데이터를 기반으로,
              내가 계약하려는 전세/월세 가격이 시세 대비 적정한지 진단해주는
              무료 서비스입니다.
            </p>
          </section>

          <section>
            <h2 className="text-navy-900 text-base font-semibold mb-2">
              어떻게 작동하나요?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-navy-600">
              <li>건물 유형(아파트/오피스텔/연립다세대/단독다가구)과 지역, 기간을 선택하면 실거래 데이터를 조회합니다</li>
              <li>내 전용면적과 보증금/월세를 입력하면 같은 면적대의 최근 거래와 비교합니다</li>
              <li>평균/중위값 대비 내 가격이 높은지, 적정한지, 낮은지 한눈에 보여줍니다</li>
            </ul>
          </section>

          <section>
            <h2 className="text-navy-900 text-base font-semibold mb-2">
              데이터 출처
            </h2>
            <p>
              국토교통부 아파트·오피스텔·연립다세대·단독다가구 전월세
              실거래가 자료 (공공데이터포털)를 활용하고 있습니다. 실거래가는 실제 계약 신고 기반 데이터이므로
              높은 신뢰도를 가지고 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-navy-900 text-base font-semibold mb-2">
              유의사항
            </h2>
            <p>
              진단 결과는 참고용이며, 실제 거래 시에는 공인중개사 등
              전문가와 상담하시기 바랍니다. 같은 아파트라도 동/호수, 향,
              리모델링 여부 등에 따라 가격 차이가 있을 수 있습니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
