import SearchClient from "./SearchClient";
import Link from "next/link";

const FAQ = [
  {
    q: "전월세 적정가는 어떻게 판단하나요?",
    a: "같은 지역, 같은 면적대(±10%)의 최근 실거래 데이터를 기반으로 평균과 중위값을 산출하여, 입력하신 가격과 비교합니다. 평균 대비 ±5% 이내면 '적정', 5% 초과면 '높음', 미만이면 '낮음'으로 진단합니다.",
  },
  {
    q: "전용면적과 공급면적의 차이는 무엇인가요?",
    a: "전용면적은 실제로 거주하는 공간의 면적이고, 공급면적은 복도·계단 등 공용 부분이 포함된 면적입니다. 일반적으로 전용면적은 공급면적의 약 75~80% 수준입니다. 이 서비스의 모든 데이터는 전용면적 기준입니다.",
  },
  {
    q: "데이터는 얼마나 최신인가요?",
    a: "국토교통부 실거래가 공공데이터를 실시간으로 조회합니다. 실거래 신고는 계약일로부터 30일 이내에 이루어지므로, 최근 1~2개월 데이터에는 아직 신고되지 않은 거래가 있을 수 있습니다.",
  },
];

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "전월세",
  "url": "https://jeonwolse-drab.vercel.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://jeonwolse-drab.vercel.app/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* 히어로 */}
      <header className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white py-12 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-navy-300 text-sm font-medium tracking-wider mb-3">
            실거래가 기반 진단 서비스
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            내 전월세,
            <br />
            적정가일까?
          </h1>
          <p className="text-navy-300 text-sm md:text-base max-w-md mx-auto">
            아파트·오피스텔·연립다세대·단독다가구 실거래가 데이터로
            내 전월세가 비싼지, 적정한지 한눈에 확인하세요
          </p>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-3xl mx-auto px-4 -mt-6 pb-16">
        <SearchClient />

        {/* SEO: 서비스 설명 */}
        <section className="mt-16 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-navy-900 mb-3">
              전월세 적정가란?
            </h2>
            <p className="text-sm leading-7 text-navy-600">
              전월세 적정가란 특정 지역과 면적에서 형성된 시세를 기반으로, 해당
              조건의 전세 보증금이나 월세가 합리적인 수준인지를 판단하는
              기준입니다. 같은 아파트 단지 내에서도 층수, 향, 리모델링 여부 등에
              따라 가격 차이가 있을 수 있지만, 최근 실거래 데이터의 평균값과
              중위값을 참고하면 대략적인 시세를 파악할 수 있습니다. 전월세
              계약 전에 실거래가를 확인하는 것은 불필요한 비용을 줄이고,
              합리적인 가격에 계약하기 위한 필수 과정입니다.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-navy-900 mb-3">
              실거래가 기반 진단이란?
            </h2>
            <p className="text-sm leading-7 text-navy-600">
              이 서비스는 국토교통부가 공개하는 아파트, 오피스텔, 연립다세대,
              단독/다가구 전월세 실거래가 신고 데이터를 활용합니다. 실거래가는 실제 계약이 이루어진 가격으로,
              호가(부르는 가격)와 달리 시장의 실제 거래 수준을 반영합니다.
              선택한 지역의 최근 1~12개월 거래 데이터를 조회한 후, 입력한
              전용면적 ±10% 범위의 거래만 필터링하여 평균, 중위값, 최솟값,
              최댓값을 산출합니다. 이를 통해 내가 계약하려는 가격이 시세
              대비 어느 위치에 있는지 시각적으로 확인할 수 있습니다.
            </p>
          </div>
        </section>

        {/* SEO: FAQ */}
        <section className="mt-12">
          <h2 className="text-lg font-bold text-navy-900 mb-4">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className="bg-white border border-navy-100 rounded-xl group"
              >
                <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-navy-900 flex items-center justify-between">
                  {item.q}
                  <span className="text-navy-400 group-open:rotate-180 transition-transform ml-2">
                    ▼
                  </span>
                </summary>
                <p className="px-5 pb-4 text-sm leading-7 text-navy-600">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

      </main>

      {/* 푸터 */}
      <footer className="border-t border-navy-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center gap-4 mb-4">
            <div className="flex gap-4 text-xs">
              <Link
                href="/about"
                className="text-navy-500 hover:text-navy-700 transition-colors"
              >
                서비스 소개
              </Link>
              <Link
                href="/privacy"
                className="text-navy-500 hover:text-navy-700 transition-colors"
              >
                개인정보처리방침
              </Link>
            </div>
          </div>
          <div className="text-center text-xs text-navy-400 space-y-1">
            <p>국토교통부 전월세 실거래가 공공데이터 활용</p>
            <p>
              실거래가 데이터는 참고용이며, 실제 거래 시 전문가 상담을
              권장합니다
            </p>
            <p className="text-navy-300">
              &copy; 2026 전월세 진단기 &middot; donebystudio
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
