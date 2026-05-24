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
};

export type TaxResult = {
  grossProfit: number;
  netIncome: number;
  taxableIncome: number;
  incomeTax: number;
  reconstructionTax: number;
  residentTax: number;
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
  const reconstructionTax = Math.floor((incomeTax * 0.021) / 100) * 100;

  const residentTaxableIncome = Math.max(0, netIncome + input.otherIncome - (deductionSum - 50_000));
  const residentTax = Math.floor((residentTaxableIncome * 0.10) / 100) * 100;

  const businessTaxBase = Math.max(0, netIncome - 2_900_000);
  const businessTax = Math.floor((businessTaxBase * 0.05) / 100) * 100;

  const totalTax = incomeTax + reconstructionTax + residentTax + businessTax;
  const effectiveRate = input.income > 0 ? totalTax / input.income : 0;

  if (input.income > 0 && input.income < 200_000 && !input.hasSideJob) {
    warnings.push(
      "本業収入がなく同人収入が20万円未満なら、所得税の確定申告は原則不要です（住民税は別途必要な場合あり）。"
    );
  }
  if (input.hasSideJob && input.income > 0 && grossProfit > 200_000) {
    warnings.push(
      "副業の所得が20万円超なので、所得税の確定申告が必要です。本業の源泉徴収票と合わせて申告してください。"
    );
  }
  if (input.hasSideJob && grossProfit > 0 && grossProfit <= 200_000) {
    warnings.push(
      "副業の所得が20万円以下なので所得税の確定申告は原則不要ですが、住民税の申告は別途必要です。"
    );
  }
  if (input.blueDeduction > 0 && input.income < 500_000) {
    warnings.push(
      "売上規模が小さい場合、青色申告承認申請の手間に対して節税額が見合わないこともあります。"
    );
  }
  if (input.income > 10_000_000) {
    warnings.push(
      "売上1,000万円超は翌々年から消費税課税事業者の判定対象です。インボイス制度も含めて要検討。"
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
    { label: "所得控除合計", value: -deductionSum },
    { label: "課税所得", value: taxableIncome },
    { label: "所得税（参考値）", value: incomeTax },
    { label: "復興特別所得税（2.1%）", value: reconstructionTax },
    { label: "住民税（参考値、約10%）", value: residentTax },
    ...(businessTax > 0 ? [{ label: "個人事業税（5%、290万円超部分）", value: businessTax }] : []),
    { label: "税額合計", value: totalTax },
  ];

  return {
    grossProfit,
    netIncome,
    taxableIncome,
    incomeTax,
    reconstructionTax,
    residentTax,
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

  if (!hasSideJob && income >= 3_000_000 && isContinuous && isRecorded) {
    return {
      classification: "事業所得",
      reason: "本業として継続的に行い、帳簿を備え、相応の収入規模があるため事業所得と判定される可能性が高い。",
    };
  }
  if (hasSideJob && income < 3_000_000 && !isRecorded) {
    return {
      classification: "雑所得",
      reason: "副業で帳簿を備えていない場合、国税庁通達により原則として雑所得（業務に係る雑所得）に分類される。",
    };
  }
  if (hasSideJob && income >= 3_000_000 && isContinuous && isRecorded) {
    return {
      classification: "事業所得",
      reason: "副業でも事業性（継続性・帳簿記録・規模）が認められれば事業所得として申告可能。",
    };
  }
  return {
    classification: "判定要相談",
    reason: "事業所得 / 雑所得の判定は個別事情に依存するため、税理士に相談してください。",
  };
}
