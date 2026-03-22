import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

// Vercel 환경변수: RENT_API_SERVICE_KEY 설정 필요
const SERVICE_KEY = process.env.RENT_API_SERVICE_KEY || "";

type BuildingType = "apt" | "officetel" | "rowhouse" | "house";

const API_URLS: Record<BuildingType, string> = {
  apt: "https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent",
  officetel: "https://apis.data.go.kr/1613000/RTMSDataSvcOffiRent/getRTMSDataSvcOffiRent",
  rowhouse: "https://apis.data.go.kr/1613000/RTMSDataSvcRHRent/getRTMSDataSvcRHRent",
  house: "https://apis.data.go.kr/1613000/RTMSDataSvcSHRent/getRTMSDataSvcSHRent",
};

const NAME_FIELDS: Record<BuildingType, string> = {
  apt: "aptNm",
  officetel: "offiNm",
  rowhouse: "mhouseNm",
  house: "",
};

function getRecentMonths(count: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${y}${m}`);
  }
  return months;
}

function normalizeItem(item: Record<string, unknown>, buildingType: BuildingType) {
  const nameField = NAME_FIELDS[buildingType];
  const buildingName = nameField ? String(item[nameField] || "") : String(item.umdNm || "");
  const area = buildingType === "house"
    ? String(item.totalFloorAr || "")
    : String(item.excluUseAr || "");
  const floor = item.floor != null ? String(item.floor) : "";

  return {
    aptNm: buildingName,
    excluUseAr: area,
    floor,
    deposit: String(item.deposit || ""),
    monthlyRent: String(item.monthlyRent || 0),
    dealYear: String(item.dealYear || ""),
    dealMonth: String(item.dealMonth || ""),
    dealDay: String(item.dealDay || ""),
    umdNm: String(item.umdNm || ""),
    buildYear: String(item.buildYear || ""),
    contractType: String(item.contractType || ""),
    jibun: String(item.jibun || ""),
    sggCd: String(item.sggCd || ""),
    useRRRight: String(item.useRRRight || ""),
    preDeposit: String(item.preDeposit || ""),
    preMonthlyRent: String(item.preMonthlyRent || ""),
  };
}

async function fetchMonth(baseUrl: string, lawdCd: string, dealYmd: string) {
  try {
    const url = `${baseUrl}?serviceKey=${SERVICE_KEY}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&numOfRows=9999&pageNo=1`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();

    const parser = new XMLParser();
    const json = parser.parse(xml);

    const header = json?.response?.header;
    if (header?.resultCode !== "000" && header?.resultCode !== 0) {
      return [];
    }

    const items = json?.response?.body?.items?.item;
    if (!items) return [];
    return Array.isArray(items) ? items : [items];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lawdCd = searchParams.get("lawdCd");
  const aptName = searchParams.get("aptName");
  const monthCount = Number(searchParams.get("months") || "3");
  const buildingType = (searchParams.get("buildingType") || "apt") as BuildingType;

  if (!lawdCd) {
    return NextResponse.json(
      { error: "lawdCd는 필수입니다" },
      { status: 400 }
    );
  }

  if (!/^\d{5}$/.test(lawdCd)) {
    return NextResponse.json(
      { error: "유효하지 않은 지역코드입니다" },
      { status: 400 }
    );
  }

  const validTypes: BuildingType[] = ["apt", "officetel", "rowhouse", "house"];
  const safeType = validTypes.includes(buildingType) ? buildingType : "apt";
  const baseUrl = API_URLS[safeType];

  const safeMonthCount = Math.max(1, Math.min(Number(monthCount) || 3, 12));
  const months = getRecentMonths(safeMonthCount);

  const allItems = (
    await Promise.all(months.map((m) => fetchMonth(baseUrl, lawdCd, m)))
  ).flat();

  // 필드명 정규화
  const normalized = allItems.map((item) => normalizeItem(item, safeType));

  let filtered = normalized;
  if (aptName && aptName.trim()) {
    const nameField = NAME_FIELDS[safeType];
    if (nameField) {
      const keyword = aptName.trim().toLowerCase();
      filtered = normalized.filter((item) =>
        item.aptNm.toLowerCase().includes(keyword)
      );
    }
  }

  // 정렬: 최신 거래 먼저
  filtered.sort((a, b) => {
    const dateA = `${a.dealYear}${String(a.dealMonth).padStart(2, "0")}${String(a.dealDay).padStart(2, "0")}`;
    const dateB = `${b.dealYear}${String(b.dealMonth).padStart(2, "0")}${String(b.dealDay).padStart(2, "0")}`;
    return dateB.localeCompare(dateA);
  });

  return NextResponse.json({
    transactions: filtered,
    totalCount: filtered.length,
    months,
  });
}
