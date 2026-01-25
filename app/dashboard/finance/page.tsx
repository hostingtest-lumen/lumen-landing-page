"use client";

import { useState, useEffect, useMemo } from "react";
import {
    DollarSign, TrendingUp, TrendingDown, AlertCircle,
    FileText, ArrowUpRight, ArrowDownLeft, Loader2, Plus,
    Calendar, Download, Eye, Search, Filter, RefreshCw,
    PieChart, BarChart3, CreditCard, Wallet, Receipt,
    CheckCircle, Clock, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton, SkeletonMetricCard, SkeletonTableRow } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import InvoiceForm from "@/components/dashboard/InvoiceForm";

// Mock Data for standalone frontend
const MOCK_INVOICES = [
    { id: 'INV-2026-001', customer: 'Hotel Santa Ana', status: 'Paid', grand_total: 2500, outstanding_amount: 0, posting_date: '2026-01-15', due_date: '2026-01-30' },
    { id: 'INV-2026-002', customer: 'Restaurante El Fogón', status: 'Unpaid', grand_total: 1800, outstanding_amount: 1800, posting_date: '2026-01-10', due_date: '2026-01-25' },
    { id: 'INV-2025-048', customer: 'Clínica Dental Sonrisa', status: 'Overdue', grand_total: 3200, outstanding_amount: 3200, posting_date: '2025-12-20', due_date: '2026-01-05' },
    { id: 'INV-2026-003', customer: 'Boutique La Elegante', status: 'Paid', grand_total: 950, outstanding_amount: 0, posting_date: '2026-01-18', due_date: '2026-02-02' },
    { id: 'INV-2025-047', customer: 'Gimnasio PowerFit', status: 'Paid', grand_total: 1500, outstanding_amount: 0, posting_date: '2025-12-15', due_date: '2025-12-30' },
    { id: 'INV-2026-004', customer: 'Cafetería Aroma', status: 'Unpaid', grand_total: 750, outstanding_amount: 750, posting_date: '2026-01-20', due_date: '2026-02-04' },
    { id: 'INV-2025-046', customer: 'Librería El Saber', status: 'Overdue', grand_total: 1200, outstanding_amount: 1200, posting_date: '2025-12-01', due_date: '2025-12-15' },
];

const MOCK_EXPENSES = [
    { id: 'EXP-001', description: 'Software Adobe CC', category: 'Software', grand_total: 450, posting_date: '2026-01-05' },
    { id: 'EXP-002', description: 'Publicidad Meta', category: 'Marketing', grand_total: 800, posting_date: '2026-01-10' },
    { id: 'EXP-003', description: 'Hosting y Dominios', category: 'Infraestructura', grand_total: 120, posting_date: '2026-01-15' },
    { id: 'EXP-004', description: 'Equipo Fotográfico', category: 'Equipamiento', grand_total: 1200, posting_date: '2025-12-20' },
    { id: 'EXP-005', description: 'Oficina Coworking', category: 'Renta', grand_total: 350, posting_date: '2026-01-01' },
];

const MOCK_PAYMENTS = [
    { id: 'PAY-001', party: 'Hotel Santa Ana', payment_type: 'Receive', paid_amount: 2500, posting_date: '2026-01-20', mode_of_payment: 'Transferencia' },
    { id: 'PAY-002', party: 'Boutique La Elegante', payment_type: 'Receive', paid_amount: 950, posting_date: '2026-01-19', mode_of_payment: 'Efectivo' },
    { id: 'PAY-003', party: 'Gimnasio PowerFit', payment_type: 'Receive', paid_amount: 1500, posting_date: '2025-12-28', mode_of_payment: 'Transferencia' },
    { id: 'PAY-004', party: 'Adobe Inc', payment_type: 'Pay', paid_amount: 450, posting_date: '2026-01-05', mode_of_payment: 'Tarjeta' },
    { id: 'PAY-005', party: 'Meta Platforms', payment_type: 'Pay', paid_amount: 800, posting_date: '2026-01-10', mode_of_payment: 'Tarjeta' },
];

// Chart data for last 6 months
const MOCK_CHART_DATA = [
    { month: 'Ago', income: 8500, expense: 3200 },
    { month: 'Sep', income: 12000, expense: 4100 },
    { month: 'Oct', income: 9800, expense: 3800 },
    { month: 'Nov', income: 15200, expense: 5200 },
    { month: 'Dic', income: 11000, expense: 4500 },
    { month: 'Ene', income: 7700, expense: 2920 },
];

type ViewTab = 'overview' | 'invoices' | 'expenses' | 'payments';
type InvoiceFilter = 'all' | 'paid' | 'unpaid' | 'overdue';

export default function FinanceDashboard() {
    const [loading, setLoading] = useState(true);
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);
    const [activeTab, setActiveTab] = useState<ViewTab>('overview');
    const [invoiceFilter, setInvoiceFilter] = useState<InvoiceFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Calculations
    const totalInvoiced = MOCK_INVOICES.reduce((acc, curr) => acc + curr.grand_total, 0);
    const totalOutstanding = MOCK_INVOICES.reduce((acc, curr) => acc + curr.outstanding_amount, 0);
    const totalExpenses = MOCK_EXPENSES.reduce((acc, curr) => acc + curr.grand_total, 0);
    const totalPaidReceived = MOCK_PAYMENTS
        .filter(p => p.payment_type === "Receive")
        .reduce((acc, curr) => acc + curr.paid_amount, 0);

    const netIncome = totalPaidReceived - totalExpenses;

    const overdueInvoices = MOCK_INVOICES.filter(inv => inv.status === 'Overdue');
    const paidInvoices = MOCK_INVOICES.filter(inv => inv.status === 'Paid');
    const unpaidInvoices = MOCK_INVOICES.filter(inv => inv.status === 'Unpaid' || inv.status === 'Overdue');

    // Filtered invoices
    const filteredInvoices = useMemo(() => {
        let result = MOCK_INVOICES;

        if (invoiceFilter !== 'all') {
            if (invoiceFilter === 'paid') result = result.filter(i => i.status === 'Paid');
            if (invoiceFilter === 'unpaid') result = result.filter(i => i.status === 'Unpaid');
            if (invoiceFilter === 'overdue') result = result.filter(i => i.status === 'Overdue');
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(i => i.customer.toLowerCase().includes(query) || i.id.toLowerCase().includes(query));
        }

        return result;
    }, [invoiceFilter, searchQuery]);

    const maxChartVal = Math.max(...MOCK_CHART_DATA.map(d => Math.max(d.income, d.expense)));

    const handleMarkAsPaid = (invoiceId: string) => {
        alert(`✅ Factura ${invoiceId} marcada como pagada (demo)`);
    };

    const handleDownloadPdf = (invoiceId: string) => {
        alert(`📄 Descargando PDF de ${invoiceId} (demo)`);
    };

    if (loading) {
        return (
            <div className="space-y-8 pb-10">
                <div className="flex justify-between items-end">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                    <Skeleton className="h-10 w-36" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <SkeletonMetricCard key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-lumen-priority" /> Panel Financiero
                    </h1>
                    <p className="text-gray-500 text-sm">Visión global de la salud financiera de la agencia.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                    </Button>
                    <Button
                        onClick={() => setShowInvoiceForm(true)}
                        className="bg-lumen-priority text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Factura
                    </Button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {[
                    { id: 'overview', label: 'Resumen', icon: PieChart },
                    { id: 'invoices', label: 'Facturas', icon: FileText },
                    { id: 'expenses', label: 'Gastos', icon: Receipt },
                    { id: 'payments', label: 'Pagos', icon: CreditCard },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ViewTab)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* KPI Cards - Always visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-green-50 rounded-xl text-green-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full">+12%</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Ingresos Recibidos</p>
                    <h3 className="text-2xl font-bold text-gray-900">$ {totalPaidReceived.toLocaleString()}</h3>
                    <p className="text-xs text-gray-400 mt-1">{paidInvoices.length} facturas cobradas</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-red-50 rounded-xl text-red-600">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Gastos</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Gastos Totales</p>
                    <h3 className="text-2xl font-bold text-gray-900">$ {totalExpenses.toLocaleString()}</h3>
                    <p className="text-xs text-gray-400 mt-1">{MOCK_EXPENSES.length} registros</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-lumen-priority/10 to-amber-50 p-5 rounded-2xl border border-amber-200/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wallet className="w-20 h-20 text-lumen-priority" />
                    </div>
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-white rounded-xl text-lumen-priority shadow-sm">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${netIncome >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {netIncome >= 0 ? 'Positivo' : 'Negativo'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Beneficio Neto</p>
                    <h3 className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        $ {netIncome.toLocaleString()}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Ingresos - Gastos</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition-shadow ${overdueInvoices.length > 0 ? 'border-red-200 border-l-4 border-l-red-400' : 'border-gray-200'
                        }`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-yellow-50 rounded-xl text-yellow-600">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        {overdueInvoices.length > 0 && (
                            <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate-pulse">
                                {overdueInvoices.length} vencidas
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Por Cobrar</p>
                    <h3 className="text-2xl font-bold text-gray-900">$ {totalOutstanding.toLocaleString()}</h3>
                    <p className="text-xs text-gray-400 mt-1">{unpaidInvoices.length} facturas pendientes</p>
                </motion.div>
            </div>

            {/* Main Content based on Tab */}
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    >
                        {/* Chart */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 text-lg">Flujo de Caja (Últimos 6 Meses)</h3>
                                <p className="text-gray-400 text-sm">Comparativa de ingresos vs gastos</p>
                            </div>

                            <div className="flex items-end justify-between h-64 gap-2 md:gap-4">
                                {MOCK_CHART_DATA.map((data, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                                        <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs p-2 rounded pointer-events-none z-10 whitespace-nowrap">
                                            <div className="flex items-center gap-1 text-green-300">
                                                <TrendingUp className="w-3 h-3" /> ${data.income.toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-1 text-red-300">
                                                <TrendingDown className="w-3 h-3" /> ${data.expense.toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="w-full h-full flex items-end justify-center gap-1">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(data.income / maxChartVal) * 100}%` }}
                                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                className="w-1/3 bg-gradient-to-t from-green-600 to-green-400 rounded-t-md"
                                            />
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(data.expense / maxChartVal) * 100}%` }}
                                                transition={{ duration: 0.5, delay: idx * 0.1 + 0.05 }}
                                                className="w-1/3 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-md"
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium uppercase">{data.month}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gradient-to-t from-green-600 to-green-400 rounded-sm"></div>
                                    <span>Ingresos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
                                    <span>Gastos</span>
                                </div>
                            </div>
                        </div>

                        {/* Overdue Alerts */}
                        <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-red-50 bg-red-50/30 flex justify-between items-center">
                                <h3 className="font-bold text-red-900 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Vencimientos
                                </h3>
                                <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full">{overdueInvoices.length}</span>
                            </div>
                            <div className="overflow-y-auto flex-1 p-4 space-y-3 max-h-[300px]">
                                {overdueInvoices.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 text-sm">
                                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                                        ¡Excelente! No hay facturas vencidas.
                                    </div>
                                ) : (
                                    overdueInvoices.map((inv) => (
                                        <div key={inv.id} className="flex items-center justify-between p-3 border border-red-100 bg-red-50/10 rounded-lg hover:shadow-sm transition-all">
                                            <div>
                                                <p className="font-bold text-sm text-gray-800">{inv.customer}</p>
                                                <p className="text-xs text-red-400">Venció: {inv.due_date}</p>
                                            </div>
                                            <div className="font-mono font-bold text-sm text-red-600">
                                                ${inv.outstanding_amount.toLocaleString()}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'invoices' && (
                    <motion.div
                        key="invoices"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar facturas..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                                />
                            </div>
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                                {[
                                    { id: 'all', label: 'Todas', count: MOCK_INVOICES.length },
                                    { id: 'paid', label: 'Pagadas', count: paidInvoices.length },
                                    { id: 'unpaid', label: 'Pendientes', count: MOCK_INVOICES.filter(i => i.status === 'Unpaid').length },
                                    { id: 'overdue', label: 'Vencidas', count: overdueInvoices.length },
                                ].map(filter => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setInvoiceFilter(filter.id as InvoiceFilter)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${invoiceFilter === filter.id
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {filter.label} <span className="text-xs opacity-60">({filter.count})</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Invoices Table */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-400 font-medium text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-3">Factura</th>
                                        <th className="px-6 py-3">Cliente</th>
                                        <th className="px-6 py-3">Estado</th>
                                        <th className="px-6 py-3">Vencimiento</th>
                                        <th className="px-6 py-3 text-right">Monto</th>
                                        <th className="px-6 py-3 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredInvoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{inv.id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{inv.customer}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                        inv.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {inv.status === 'Paid' && <CheckCircle className="w-3 h-3" />}
                                                    {inv.status === 'Overdue' && <XCircle className="w-3 h-3" />}
                                                    {inv.status === 'Unpaid' && <Clock className="w-3 h-3" />}
                                                    {inv.status === 'Paid' ? 'Pagada' : inv.status === 'Overdue' ? 'Vencida' : 'Pendiente'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{inv.due_date}</td>
                                            <td className="px-6 py-4 text-right font-mono font-medium">
                                                ${inv.grand_total.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    {inv.status !== 'Paid' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Marcar como Pagada"
                                                            onClick={() => handleMarkAsPaid(inv.id)}
                                                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        >
                                                            <DollarSign className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Descargar PDF"
                                                        onClick={() => handleDownloadPdf(inv.id)}
                                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'expenses' && (
                    <motion.div
                        key="expenses"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Gastos Registrados</h3>
                            <Button size="sm" variant="outline">
                                <Plus className="w-4 h-4 mr-1" /> Nuevo Gasto
                            </Button>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-400 font-medium text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3">Descripción</th>
                                    <th className="px-6 py-3">Categoría</th>
                                    <th className="px-6 py-3">Fecha</th>
                                    <th className="px-6 py-3 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {MOCK_EXPENSES.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{exp.description}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">{exp.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{exp.posting_date}</td>
                                        <td className="px-6 py-4 text-right font-mono font-medium text-red-600">
                                            -${exp.grand_total.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}

                {activeTab === 'payments' && (
                    <motion.div
                        key="payments"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Últimos Movimientos</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {MOCK_PAYMENTS.map((pay) => (
                                <div key={pay.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${pay.payment_type === 'Receive' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {pay.payment_type === 'Receive' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{pay.party}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <span>{pay.posting_date}</span>
                                                <span>•</span>
                                                <span>{pay.mode_of_payment}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`font-mono font-bold text-lg ${pay.payment_type === 'Receive' ? 'text-green-600' : 'text-red-600'}`}>
                                        {pay.payment_type === 'Receive' ? '+' : '-'}${pay.paid_amount.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Invoice Form Modal */}
            <InvoiceForm
                isOpen={showInvoiceForm}
                onClose={() => setShowInvoiceForm(false)}
                onSuccess={() => {
                    alert('Factura creada exitosamente (demo)');
                }}
            />
        </div>
    );
}
