export type TaxInput = {
  income: number;
  expense: number;
  blueDeduction: 0 | 100000 | 550000 | 650000;
  socialInsurance: number;
  lifeInsuranceDeduction: number;
  spouseDeduction: number;
  dependentDeduction: number;
  basicDeduction: number;
  otherIncome: number;
  hasSideJob: boolean;
  applyBusinessTax: boolean;
};

export type TaxResult = {
  grossProfit: number;
  netIncome: number;
  taxableIncome: number;
  incomeTax: number;
  reconstructionTax: number;
  residentTax: number;
  residentEqualShare: number;
  businessTax: number;
  totalTax: number;
  effectiveRate: number;
  breakdown: { label: string; value: number; note?: string }[];
  warnings: string[];
};

const INCOME_TAX_BRACKETS: { upTo: number; rate: number; deduct: number }[] = [
  { upTo: 1_950_000, rate: 0.05, deduct: 0 },
  { upTo: 3_300_000, rate: 0.10, deduct: 97_500 },
  { upTo: 6_950_000, rate: 0.20, deduct: 427_500 },
  { upTo: 9_000_000, rate: 0.23, deduct: 636_000 },
  { upTo: 18_000_000, rate: 0.33, deduct: 1_536_000 },
  { upTo: 40_000_000, rate: 0.40, deduct: 2_796_000 },
  { upTo: Infinity, rate: 0.45, deduct: 4_796_000 },
];

function calcIncomeTax(taxable: number): number {
  if (taxable <= 0) return 0;
  for (const b of INCOME_TAX_BRACKETS) {
    if (taxable <= b.upTo) {
      return Math.floor((taxable * b.rate - b.deduct) / 100) * 100;
    }
  }
  return 0;
}

const RESIDENT_DEDUCTION_DIFF = 50_000;
const RESIDENT_EQUAL_SHARE_JPY = 5_000;

export function calcTax(input: TaxInput): TaxResult {
  const warnings: string[] = [];

  const grossProfit = input.income - input.expense;
  const netIncome = Math.max(0, grossProfit - input.blueDeduction);

  const deductionSum =
    input.socialInsurance +
    input.lifeInsuranceDeduction +
    input.spouseDeduction +
    input.dependentDeduction +
    input.basicDeduction;

  const taxableIncome = Math.max(0, netIncome + input.otherIncome - deductionSum);
  const taxableForCalc = Math.floor(taxableIncome / 1000) * 1000;

  const incomeTax = calcIncomeTax(taxableForCalc);
  const reconstructionTax = Math.floor(incomeTax * 0.021);

  const residentTaxableRaw = Math.max(0, netIncome + input.otherIncome - (deductionSum - RESIDENT_DEDUCTION_DIFF));
  const residentTaxableIncome = Math.floor(residentTaxableRaw / 1000) * 1000;
  const residentTax = Math.floor((residentTaxableIncome * 0.10) / 100) * 100;
  const residentEqualShare = residentTaxableIncome > 0 ? RESIDENT_EQUAL_SHARE_JPY : 0;

  const businessTaxBase = Math.max(0, netIncome - 2_900_000);
  const businessTax = input.applyBusinessTax
    ? Math.floor((businessTaxBase * 0.05) / 100) * 100
    : 0;

  const totalTax = incomeTax + reconstructionTax + residentTax + residentEqualShare + businessTax;
  const effectiveRate = input.income > 0 ? totalTax / input.income : 0;

  if (input.income > 0 && netIncome < 480_000 && !input.hasSideJob) {
    warnings.push(
      "専業（給与所得なし）の場合、所得が基礎控除等の合計を下回れば所得税は0円ですが、住民税申告や国民健康保険料の関係で申告した方が有利な場合があります。"
    );
  }
  if (input.hasSideJob && input.income > 0 && netIncome > 200_000) {
    warnings.push(
      "副業の所得（経費・青色控除後）が20万円超なので、所得税の確定申告が必要です。本業の源泉徴収票と合わせて申告してください。"
    );
  }
  if (input.hasSideJob && netIncome > 0 && netIncome <= 200_000) {
    warnings.push(
      "副業の所得（経費・青色控除後）が20万円以下のため、給与の年末調整が済んでいれば所得税の確定申告は原則不要です。ただし住民税申告は別途必要、医療費控除等の還付申告をする場合はすべての所得を申告する必要があります。"
    );
  }
  if (input.blueDeduction > 0 && input.income < 500_000) {
    warnings.push(
      "売上規模が小さい場合、青色申告の事務負担に対して節税額が見合わないこともあります。10万円控除なら簡易帳簿で済みます。"
    );
  }
  if (input.income > 10_000_000) {
    warnings.push(
      "課税売上1,000万円超の場合、2年後から消費税の課税事業者となります。インボイス制度・2割特例等もあわせて要検討。"
    );
  }
  if (input.applyBusinessTax && businessTax > 0) {
    warnings.push(
      "同人作家の創作活動は地方税法上「文芸業」として個人事業税が非課税となる解釈もあります。所轄の都道府県税事務所に確認してください。"
    );
  }

  const breakdown = [
    { label: "売上（同人収入）", value: input.income },
    { label: "経費合計", value: -input.expense },
    { label: "総所得（売上−経費）", value: grossProfit },
    ...(input.blueDeduction > 0
      ? [{ label: `青色申告特別控除`, value: -input.blueDeduction, note: `${input.blueDeduction.toLocaleString()}円控除` }]
      : []),
    { label: "事業所得", value: netIncome },
    ...(input.otherIncome > 0 ? [{ label: "その他の所得", value: input.otherIncome }] : []),
    { label: "所得控除合計（所得税）", value: -deductionSum },
    { label: "課税所得（千円未満切捨）", value: taxableForCalc },
    { label: "所得税（参考値）", value: incomeTax },
    { label: "復興特別所得税（2.1%）", value: reconstructionTax },
    { label: "住民税 所得割（約10%）", value: residentTax, note: "住民税の基礎控除は43万円・他控除も低めに簡易補正" },
    ...(residentEqualShare > 0 ? [{ label: "住民税 均等割（参考）", value: residentEqualShare, note: "自治体により4,000〜6,000円程度" }] : []),
    ...(businessTax > 0 ? [{ label: "個人事業税（5%、290万円超部分）", value: businessTax, note: "文芸業として非課税解釈の余地あり" }] : []),
    { label: "税額合計", value: totalTax },
  ];

  return {
    grossProfit,
    netIncome,
    taxableIncome: taxableForCalc,
    incomeTax,
    reconstructionTax,
    residentTax,
    residentEqualShare,
    businessTax,
    totalTax,
    effectiveRate,
    breakdown,
    warnings,
  };
}

export function classifyIncomeType(input: {
  income: number;
  hasSideJob: boolean;
  isContinuous: boolean;
  isRecorded: boolean;
}): {
  classification: "事業所得" | "雑所得" | "判定要相談";
  reason: string;
} {
  const { income, hasSideJob, isContinuous, isRecorded } = input;

  if (!hasSideJob && isContinuous && isRecorded) {
    return {
      classification: "事業所得",
      reason: "本業として継続的に行い、帳簿を備え付けている場合は原則として事業所得（所得税法27条）。青色申告特別控除や損益通算の対象となる。",
    };
  }
  if (hasSideJob && isRecorded && isContinuous) {
    if (income >= 3_000_000) {
      return {
        classification: "事業所得",
        reason: "副業でも収入300万円超かつ帳簿記録ありなら、原則として事業所得（2022年国税庁通達のパブコメ修正後の考え方）。ただし社会通念での個別判定が必要。",
      };
    }
    return {
      classification: "事業所得",
      reason: "副業で収入300万円以下でも、帳簿を備え付けている場合は原則として事業所得（2022年通達のパブコメ修正後の考え方）。ただし社会通念で副業性が強いと判断される場合は雑所得となる余地もある。",
    };
  }
  if (hasSideJob && !isRecorded) {
    if (income <= 3_000_000) {
      return {
        classification: "雑所得",
        reason: "副業かつ帳簿を備えていない、収入300万円以下なら、2022年通達により原則として「業務に係る雑所得」に分類される。",
      };
    }
    return {
      classification: "判定要相談",
      reason: "副業で帳簿なしだが収入300万円超は、事業性の社会通念上の判断が必要。税理士相談を推奨。",
    };
  }
  return {
    classification: "判定要相談",
    reason: "事業所得 / 雑所得の判定は個別事情（営利性・継続性・反復性・規模・帳簿の有無・社会通念）に依存するため、税理士に相談してください。",
  };
}
