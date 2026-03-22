export interface RentTransaction {
  aptNm: string;
  buildYear: string;
  dealDay: string;
  dealMonth: string;
  dealYear: string;
  deposit: string; // 만원, comma-formatted
  excluUseAr: string; // ㎡
  floor: string;
  monthlyRent: string; // 만원, 0이면 전세
  umdNm: string;
  contractType: string;
  jibun: string;
  roadnm: string;
  sggCd: string;
  useRRRight: string;
  preDeposit: string;
  preMonthlyRent: string;
}

export interface SearchResult {
  transactions: RentTransaction[];
  totalCount: number;
  query: {
    regionName: string;
    aptName?: string;
    months: string[];
  };
}

export interface PriceStats {
  count: number;
  avgDeposit: number;
  minDeposit: number;
  maxDeposit: number;
  medianDeposit: number;
  avgMonthlyRent: number;
  deposits: number[];
}
