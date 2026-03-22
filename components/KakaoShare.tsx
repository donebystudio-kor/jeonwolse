"use client";

import { useEffect, useCallback } from "react";

const KAKAO_JS_KEY = "4862de3f11b4fc081e99138e41e3cba9";

interface Props {
  region: string;
  area: string;
  rentType: "jeonse" | "wolse";
  deposit: string;
  monthly?: string;
  verdict: string;
}

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: Record<string, unknown>) => void;
      };
    };
  }
}

export default function KakaoShare({
  region,
  area,
  rentType,
  deposit,
  monthly,
  verdict,
}: Props) {
  useEffect(() => {
    if (document.getElementById("kakao-sdk")) return;
    const script = document.createElement("script");
    script.id = "kakao-sdk";
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(KAKAO_JS_KEY);
      }
    };
    document.head.appendChild(script);
  }, []);

  const typeLabel = rentType === "jeonse" ? "전세" : "월세";
  const priceText =
    rentType === "jeonse"
      ? `${Number(deposit).toLocaleString()}만원`
      : `${Number(deposit).toLocaleString()}/${monthly ? Number(monthly).toLocaleString() : 0}만원`;

  const shareText = `[${region}] ${area}m² ${typeLabel} ${priceText} → ${verdict}`;

  const handleShare = useCallback(() => {
    if (window.Kakao?.Share) {
      window.Kakao.Share.sendDefault({
        objectType: "text",
        text: shareText,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
        buttonTitle: "전월세 진단해보기",
      });
    } else {
      if (navigator.share) {
        navigator.share({
          title: "전월세 진단기",
          text: shareText,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        alert("클립보드에 복사되었습니다!");
      }
    }
  }, [shareText]);

  return (
    <button
      onClick={handleShare}
      className="w-full py-3 rounded-xl text-sm font-medium bg-[#FEE500] text-[#3C1E1E] hover:bg-[#F5DC00] transition-colors flex items-center justify-center gap-2"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 1C4.58 1 1 3.87 1 7.35c0 2.22 1.48 4.17 3.71 5.27l-.95 3.52c-.08.3.25.55.52.39l4.2-2.77c.17.01.34.02.52.02 4.42 0 8-2.87 8-6.43C17 3.87 13.42 1 9 1z"
          fill="#3C1E1E"
        />
      </svg>
      카카오톡으로 공유
    </button>
  );
}
