"use client";

import { useState, useMemo } from "react";
import { calcTax, classifyIncomeType, type TaxInput } from "@/lib/tax-calc";

export default function ShotokuPage() {
  const [income, setIncome] = useState("500000");
  const [expense, setExpense] = useState("150000");
  const [blueDeduction, setBlueDeduction] =
    useState<TaxInput["blueDeduction"]>(0);
  const [socialInsurance, setSocialInsurance] = useState("0");
  const [lifeInsuranceDeduction, setLifeInsuranceDeduction] = useState("0");
  const [spouseDeduction, setSpouseDeduction] = useState("0");
  const [dependentDeduction, setDependentDeduction] = useState("0");
  const [otherIncome, setOtherIncome] = useState("0");
  const [hasSideJob, setHasSideJob] = useState(true);
  const [isContinuous, setIsContinuous] = useState(true);
  const [isRecorded, setIsRecorded] = useState(false);

  const result = useMemo(() => {
    return calcTax({
      income: Number(income) || 0,
      expense: Number(expense) || 0,
      blueDeduction,
      socialInsurance: Number(socialInsurance) || 0,
      lifeInsuranceDeduction: Number(lifeInsuranceDeduction) || 0,
      spouseDeduction: Number(spouseDeduction) || 0,
      dependentDeduction: Number(dependentDeduction) || 0,
      basicDeduction: 480_000,
      otherIncome: Number(otherIncome) || 0,
      hasSideJob,
    });
  }, [income, expense, blueDeduction, socialInsurance, lifeInsuranceDeduction, spouseDeduction, dependentDeduction, otherIncome, hasSideJob]);

  const classification = useMemo(() => {
    return classifyIncomeType({
      income: Number(income) || 0,
      hasSideJob,
      isContinuous,
      isRecorded,
    });
  }, [income, hasSideJob, isContinuous, isRecorded]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-6">
        <p className="text-amber-600 text-sm font-medium mb-1">💴 所得税概算ツール</p>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          所得税・住民税の参考額を計算
        </h1>
        <p className="text-sm text-zinc-600 leading-relaxed">
          売上と経費・各種控除を入力すると、納税額の参考値を表示します。
          すべて<strong>参考値</strong>です。最終的な申告は税理士か税務署にご確認ください。
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="bg-white border border-zinc-200 rounded-2xl p-5">
          <h2 className="font-bold mb-4 text-zinc-900">📝 収支</h2>
          <div className="space-y-4">
            <FieldNumber
              label="同人活動の年間売上"
              value={income}
              onChange={setIncome}
              hint="頒布・通販・FANBOX等すべての合計"
            />
            <FieldNumber
              label="経費の年間合計"
              value={expense}
              onChange={setExpense}
              hint="印刷費・参加費・遠征費等の合計"
            />
            <FieldNumber
              label="他の所得（給与所得控除後）"
              value={otherIncome}
              onChange={setOtherIncome}
              hint="本業給与の所得金額（給与所得控除後）"
            />
          </div>
        </section>

        <section className="bg-white border border-zinc-200 rounded-2xl p-5">
          <h2 className="font-bold mb-4 text-zinc-900">⚙️ 申告区分</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasSideJob}
                onChange={(e) => setHasSideJob(e.target.checked)}
                className="mt-1 accent-amber-500"
              />
              <span className="text-sm">
                <strong>本業の給与所得がある（副業として申告）</strong>
                <span className="block text-xs text-zinc-500 mt-0.5">
                  会社員等で副業として同人活動している場合はチェック
                </span>
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isContinuous}
                onChange={(e) => setIsContinuous(e.target.checked)}
                className="mt-1 accent-amber-500"
              />
              <span className="text-sm">
                継続的・反復的に活動している
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecorded}
                onChange={(e) => setIsRecorded(e.target.checked)}
                className="mt-1 accent-amber-500"
              />
              <span className="text-sm">
                帳簿を備え付けて記帳している
              </span>
            </label>

            <div className="pt-3">
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                青色申告特別控除
              </label>
              <select
                value={blueDeduction}
                onChange={(e) => setBlueDeduction(Number(e.target.value) as TaxInput["blueDeduction"])}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value={0}>使わない（白色申告 / 雑所得）</option>
                <option value={100000}>10万円控除（簡易帳簿）</option>
                <option value={550000}>55万円控除（複式簿記）</option>
                <option value={650000}>65万円控除（複式簿記＋e-Tax）</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white border border-zinc-200 rounded-2xl p-5 mt-4">
        <h2 className="font-bold mb-4 text-zinc-900">🛡️ 所得控除（年間）</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <FieldNumber
            label="社会保険料控除"
            value={socialInsurance}
            onChange={setSocialInsurance}
            hint="国民健康保険・国民年金・厚生年金等"
          />
          <FieldNumber
            label="生命保険料控除"
            value={lifeInsuranceDeduction}
            onChange={setLifeInsuranceDeduction}
            hint="最大12万円程度"
          />
          <FieldNumber
            label="配偶者（特別）控除"
            value={spouseDeduction}
            onChange={setSpouseDeduction}
            hint="配偶者の所得により0〜38万円"
          />
          <FieldNumber
            label="扶養控除"
            value={dependentDeduction}
            onChange={setDependentDeduction}
            hint="扶養親族×38万円が目安"
          />
        </div>
        <p className="text-xs text-zinc-500 mt-3">
          ※ 基礎控除48万円は自動で適用されます
        </p>
      </section>

      <section className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-2xl p-6 mt-6">
        <h2 className="font-bold mb-4 text-amber-900">📊 試算結果（参考値）</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <Stat label="売上" value={result.breakdown[0].value} />
          <Stat label="事業所得" value={result.netIncome} />
          <Stat label="課税所得" value={result.taxableIncome} />
          <Stat
            label="税額合計"
            value={result.totalTax}
            highlight
          />
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="text-sm font-medium text-zinc-700 mb-2">内訳</div>
          <table className="w-full text-sm">
            <tbody>
              {result.breakdown.map((row, i) => (
                <tr key={i} className="border-b last:border-b-0 border-zinc-100">
                  <td className="py-1.5 text-zinc-700">
                    {row.label}
                    {row.note && (
                      <span className="text-xs text-zinc-500 ml-1">({row.note})</span>
                    )}
                  </td>
                  <td className={`py-1.5 text-right font-mono ${
                    row.value < 0 ? "text-zinc-500" : "text-zinc-900"
                  }`}>
                    {row.value < 0 ? "−" : ""}
                    {Math.abs(row.value).toLocaleString()}円
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-amber-900">
          <strong>所得に対する実効税率：</strong>{" "}
          {(result.effectiveRate * 100).toFixed(1)}%
        </div>

        {result.warnings.length > 0 && (
          <div className="bg-white border border-amber-300 rounded-lg p-3 mt-3">
            <div className="text-sm font-medium text-amber-900 mb-2">💡 アドバイス</div>
            <ul className="text-xs text-zinc-700 space-y-1.5 list-disc list-inside">
              {result.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="bg-white border border-sky-200 rounded-2xl p-5 mt-4">
        <h2 className="font-bold mb-2 text-sky-900">
          🏷 所得区分の判定: <span className="text-sky-700">{classification.classification}</span>
        </h2>
        <p className="text-sm text-zinc-700">{classification.reason}</p>
      </section>

      <p className="text-xs text-zinc-500 mt-6 leading-relaxed">
        ※ 本計算は2026年度税制を前提とした<strong>参考値</strong>です。社会保険料控除は申告者本人による年間支払額をもとに計算されます。実際の申告額は、所得控除の細目（医療費控除、ふるさと納税等）、所得の種類（譲渡所得・一時所得等）により異なります。最終的な税額は税務署または税理士にご確認ください。
      </p>
    </div>
  );
}

function FieldNumber({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 pr-8 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
          min={0}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
          円
        </span>
      </div>
      {hint && <p className="text-xs text-zinc-500 mt-1">{hint}</p>}
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-lg ${
        highlight
          ? "bg-amber-600 text-white"
          : "bg-white text-zinc-900"
      }`}
    >
      <div className={`text-xs ${highlight ? "text-amber-100" : "text-zinc-500"}`}>
        {label}
      </div>
      <div className="font-bold text-lg mt-0.5 font-mono">
        {value.toLocaleString()}
        <span className={`text-xs ml-0.5 ${highlight ? "text-amber-100" : "text-zinc-500"}`}>円</span>
      </div>
    </div>
  );
}
