import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 전월세 진단기",
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-navy-500 text-sm hover:text-navy-700 transition-colors mb-8 inline-block"
        >
          ← 홈으로
        </Link>
        <h1 className="text-2xl font-bold text-navy-900 mb-2">
          개인정보처리방침
        </h1>
        <p className="text-navy-500 text-sm mb-10">최종 수정일: 2026년 3월 8일</p>

        <div className="space-y-8 text-sm leading-7 text-navy-700">
          <section>
            <h2 className="text-navy-900 text-base font-semibold mb-3">
              1. 개인정보의 처리 목적
            </h2>
            <p>
              전월세 진단기(이하 &quot;서비스&quot;)는 아파트 전월세 실거래가
              기반 적정가 진단 서비스로, 별도의 회원가입 없이 이용할 수
              있습니다. 서비스는 다음의 목적을 위해 최소한의 정보를 처리합니다.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-navy-500">
              <li>아파트·오피스텔·연립다세대·단독다가구 전월세 실거래가 조회 및 적정가 진단</li>
              <li>서비스 이용 통계 및 개선</li>
            </ul>
          </section>

          <section>
            <h2 className="text-navy-900 text-base font-semibold mb-3">
              2. 처리하는 개인정보 항목
            </h2>
            <p>
              서비스는 회원가입을 요구하지 않으며, 서버에 개인정보를 저장하지
              않습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-navy-500">
              <li>
                <strong className="text-navy-700">자동 수집 정보:</strong> 서비스
                이용 시 IP 주소, 브라우저 종류, 접속 시간 등이 호스팅
                서비스(Vercel)에 의해 자동으로 수집됩니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-navy-900 text-base font-semibold mb-3">
              3. 개인정보의 보유 및 이용 기간
            </h2>
            <p>
              서비스는 서버에 개인정보를 저장하지 않습니다. 자동 수집되는 접속
              로그는 호스팅 서비스(Vercel)의 정책에 따라 보관됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-navy-900 text-base font-semibold mb-3">
              4. 개인정보의 제3자 제공
            </h2>
            <p>
              서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만,
              서비스 운영을 위해 아래의 외부 서비스를 이용하고 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-navy-500">
              <li>Vercel (호스팅): 접속 로그 자동 수집</li>
              <li>
                국토교통부 공공데이터 API: 아파트·오피스텔·연립다세대·단독다가구 실거래가 데이터 조회 (개인정보 미포함)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-navy-900 text-base font-semibold mb-3">
              5. 이용자의 권리
            </h2>
            <p>
              서비스는 개인정보를 수집하거나 저장하지 않으므로 별도의 열람,
              수정, 삭제 절차가 필요하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-navy-900 text-base font-semibold mb-3">
              6. 개인정보처리방침의 변경
            </h2>
            <p>
              이 개인정보처리방침은 법령이나 서비스 변경 사항을 반영하여 수정될
              수 있습니다. 변경 시에는 &quot;최종 수정일&quot;을 업데이트하여
              고지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-navy-900 text-base font-semibold mb-3">
              7. 문의
            </h2>
            <ul className="list-none space-y-1">
              <li>서비스명: 전월세 진단기</li>
              <li className="text-navy-500">이메일: donebystudio@gmail.com</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
