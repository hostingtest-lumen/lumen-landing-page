"use client";

import { useState, useEffect } from "react";
import {
    DollarSign, TrendingUp, TrendingDown, AlertCircle,
    FileText, ArrowUpRight, ArrowDownLeft, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinanceDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/erp/finance-global");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-100px)] flex items-center justify-center text-lumen-priority">
                <Loader2 className="w-8 h-8 animate-spin mr-2" /> Cargando finanzas desde ERPNext...
            </div>
        );
    }

    if (!data) return <div className="p-8 text-red-500">Error al cargar datos financieros.</div>;

    // Calculations
    const totalInvoiced = data.invoices.reduce((acc: number, curr: any) => acc + curr.grand_total, 0);
    const totalOutstanding = data.invoices.reduce((acc: number, curr: any) => acc + curr.outstanding_amount, 0);
    const totalExpenses = data.expenses.reduce((acc: number, curr: any) => acc + curr.grand_total, 0);
    const totalPaidReceived = data.payments
        .filter((p: any) => p.payment_type === "Receive")
        .reduce((acc: number, curr: any) => acc + curr.paid_amount, 0);

    const netIncome = totalPaidReceived - totalExpenses;

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-lumen-priority" /> Panel Financiero
                </h1>
                <p className="text-gray-500 text-sm">Visión global de la salud financiera de la agencia.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Recibido</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Ingresos Reales</p>
                    <h3 className="text-2xl font-bold text-gray-900">$ {totalPaidReceived.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Gastos</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Gastos Totales</p>
                    <h3 className="text-2xl font-bold text-gray-900">$ {totalExpenses.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <DollarSign className="w-24 h-24 text-lumen-priority" />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-lumen-priority/10 rounded-lg text-lumen-priority">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Neto</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Beneficio Neto</p>
                    <h3 className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        $ {netIncome.toLocaleString()}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm border-l-4 border-l-yellow-400">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pendiente</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Por Cobrar</p>
                    <h3 className="text-2xl font-bold text-gray-900">$ {totalOutstanding.toLocaleString()}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Invoices */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Facturas Recientes</h3>
                        <Button variant="ghost" size="sm" className="text-xs text-lumen-priority">Ver Todo</Button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-400 font-medium text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3">Cliente</th>
                                    <th className="px-6 py-3">Estado</th>
                                    <th className="px-6 py-3 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.invoices.slice(0, 10).map((inv: any) => (
                                    <tr key={inv.name} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {inv.customer}
                                            <div className="text-[10px] text-gray-400">{inv.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                    inv.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>{inv.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono">
                                            ${inv.grand_total.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Expenses & Payments */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Últimos Movimientos</h3>
                        </div>
                        <div className="overflow-y-auto flex-1 p-4 space-y-3">
                            {data.payments.slice(0, 10).map((pay: any) => (
                                <div key={pay.name} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${pay.payment_type === 'Receive' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {pay.payment_type === 'Receive' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">{pay.party}</p>
                                            <p className="text-xs text-gray-400">{pay.posting_date}</p>
                                        </div>
                                    </div>
                                    <div className={`font-mono font-bold text-sm ${pay.payment_type === 'Receive' ? 'text-green-600' : 'text-red-600'}`}>
                                        {pay.payment_type === 'Receive' ? '+' : '-'}${pay.paid_amount.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
