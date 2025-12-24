"use client";

const BANKS = [
  { name: "Bonus" },
  { name: "World" },
  { name: "Axess" },
  { name: "Maximum" },
  { name: "Paraf" },
  { name: "Troy" },
  { name: "Visa" },
];

export default function BankStripe() {
  return (
    <section className="mt-10 mb-8">
      <div className="border rounded-2xl bg-white px-6 py-4 flex flex-wrap gap-4 items-center">
        <p className="text-sm font-semibold text-gray-700 min-w-[140px]">
          Desteklenen Kartlar
        </p>
        <div className="flex gap-3 flex-wrap">
          {BANKS.map((bank) => (
            <div
              key={bank.name}
              className="h-10 px-5 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-sm font-medium text-gray-700 hover:border-red-200 hover:bg-red-50 transition"
            >
              {bank.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
