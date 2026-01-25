"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { DollarSign, ArrowUp, ArrowDown } from "lucide-react";

interface FinanceChartProps {
    invoices: any[];
    expenses: any[];
}

export default function FinanceChart({ invoices, expenses }: FinanceChartProps) {
    const chartData = useMemo(() => {
        const last6Months: any[] = [];
        const today = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = d.toISOString().slice(0, 7); // YYYY-MM
            const monthName = d.toLocaleString('es-ES', { month: 'short' });

            // Filter and sum
            const income = invoices
                .filter(inv => inv.posting_date.startsWith(monthKey))
                .reduce((acc, curr) => acc + curr.grand_total, 0);

            const expense = expenses
                .filter(exp => exp.posting_date.startsWith(monthKey))
                .reduce((acc, curr) => acc + curr.grand_total, 0);

            last6Months.push({ month: monthName, income, expense });
        }
        return last6Months;
    }, [invoices, expenses]);

    const maxVal = Math.max(...chartData.map(d => Math.max(d.income, d.expense, 100)));

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Flujo de Caja (Últimos 6 Meses)</h3>
                <p className="text-gray-400 text-sm">Comparativa de facturación vs gastos reales</p>
            </div>

            <div className="flex items-end justify-between h-64 gap-2 md:gap-4">
                {chartData.map((data, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs p-2 rounded pointer-events-none z-10 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-green-300">
                                <ArrowUp className="w-3 h-3" /> ${data.income.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1 text-red-300">
                                <ArrowDown className="w-3 h-3" /> ${data.expense.toLocaleString()}
                            </div>
                        </div>

                        <div className="w-full h-full flex items-end justify-center gap-1 rounded-t-lg bg-gray-50/50 relative">
                            {/* Income Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(data.income / maxVal) * 100}%` }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="w-1/3 bg-gray-900 rounded-t-sm hover:bg-lumen-priority transition-colors"
                            />
                            {/* Expense Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(data.expense / maxVal) * 100}%` }}
                                transition={{ duration: 0.5, delay: idx * 0.1 + 0.05 }}
                                className="w-1/3 bg-gray-200 rounded-t-sm"
                            />
                        </div>
                        <span className="text-xs text-gray-400 font-medium uppercase">{data.month}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-900 rounded-sm"></div>
                    <span>Ingresos</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                    <span>Gastos</span>
                </div>
            </div>
        </div>
    );
}
