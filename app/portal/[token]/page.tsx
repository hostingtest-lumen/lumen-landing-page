"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { clientService } from "@/lib/clients";
import { deliverableService } from "@/lib/deliverables";
import { Client } from "@/types/clients";
import { Deliverable } from "@/types/deliverables";
import { ContentGridItem } from "@/types/content-grid";
import { ExternalLink, CheckCircle, Clock, Calendar, Check, MessageSquare, Instagram, Facebook, Linkedin, Video, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


import { DollarSign, FileText, Download, TrendingUp } from "lucide-react";

export default function ClientPortalPage() {
    const params = useParams();
    const token = params?.token as string;

    const [client, setClient] = useState<Client | undefined>(undefined);
    const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
    const [gridItems, setGridItems] = useState<ContentGridItem[]>([]);
    const [financeData, setFinanceData] = useState<{ invoices: any[], payments: any[] }>({ invoices: [], payments: [] });
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'deliverables' | 'planning' | 'finance' | 'documents'>('deliverables');

    useEffect(() => {
        if (token) {
            loadData();
        }
    }, [token]);

    const loadData = async () => {
        const clientData = clientService.getByToken(token);

        if (clientData) {
            setClient(clientData);

            // 1. Fetch Deliverables (Backend)
            const allDeliverables = await deliverableService.getByClientId(clientData.id);
            setDeliverables(allDeliverables);

            // 2. Fetch Content Grid (ERPNext API)
            try {
                const erpIdentifier = clientData.erpId || clientData.name;
                const res = await fetch(`/api/erp/tasks?id=${encodeURIComponent(erpIdentifier)}`);
                if (res.ok) {
                    const gridData: ContentGridItem[] = await res.json();
                    const visibleItems = gridData
                        .filter(i => i.status !== 'draft')
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    setGridItems(visibleItems);
                }
            } catch (e) {
                console.error("Error loading grid", e);
            }

            // 3. Fetch Finance & Docs
            try {
                // Assuming clientData.name maps to Customer Name in ERPNext
                const financeRes = await fetch(`/api/erp/client-finance?clientName=${encodeURIComponent(clientData.name)}`);
                if (financeRes.ok) setFinanceData(await financeRes.json());

                const docsRes = await fetch(`/api/erp/client-documents?clientName=${encodeURIComponent(clientData.name)}`);
                if (docsRes.ok) {
                    const docsJson = await docsRes.json();
                    setDocuments(docsJson.files || []);
                }
            } catch (e) {
                console.error("Error loading extra modules", e);
            }
        }
        setLoading(false);
    };

    const handleApproveGridItem = async (item: ContentGridItem) => {
        // ... (Same implementation as before) ...
        if (item.status === 'approved') return;
        setGridItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'approved' } : i));
        try {
            await fetch('/api/erp/tasks', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...item, status: 'approved' }) });
            alert("✅ Idea aprobada.");
        } catch (e) {
            loadData();
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-lumen-priority">Cargando portal...</div>;
    if (!client) return <div className="min-h-screen flex items-center justify-center">Acceso Denegado</div>;

    const pendingItems = deliverables.filter(d => d.status !== 'approved');
    const approvedItems = deliverables.filter(d => d.status === 'approved');

    // Calculations for Finance Tab
    const totalOutstanding = financeData.invoices.reduce((acc, curr) => acc + curr.outstanding_amount, 0);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Header */}
            <header className="bg-lumen-structure text-white p-6 sticky top-0 z-20 shadow-lg">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-xs text-lumen-priority uppercase tracking-widest font-bold mb-1">Portal de Cliente</p>
                        <h1 className="text-lg md:text-xl font-bold leading-tight">{client.name}</h1>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">
                        {client.name.substring(0, 2).toUpperCase()}
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-[88px] z-10 overflow-x-auto">
                <div className="max-w-4xl mx-auto flex">
                    <button onClick={() => setActiveTab('deliverables')} className={`px-6 py-4 text-sm font-bold border-b-2 flex gap-2 ${activeTab === 'deliverables' ? 'border-lumen-priority text-lumen-priority' : 'border-transparent text-gray-500'}`}>
                        <Clock className="w-4 h-4" /> Aprobaciones
                        {pendingItems.length > 0 && <span className="bg-lumen-priority text-white text-[10px] px-1.5 rounded-full">{pendingItems.length}</span>}
                    </button>
                    <button onClick={() => setActiveTab('planning')} className={`px-6 py-4 text-sm font-bold border-b-2 flex gap-2 ${activeTab === 'planning' ? 'border-lumen-priority text-lumen-priority' : 'border-transparent text-gray-500'}`}>
                        <Calendar className="w-4 h-4" /> Planificación
                    </button>
                    <button onClick={() => setActiveTab('finance')} className={`px-6 py-4 text-sm font-bold border-b-2 flex gap-2 ${activeTab === 'finance' ? 'border-lumen-priority text-lumen-priority' : 'border-transparent text-gray-500'}`}>
                        <DollarSign className="w-4 h-4" /> Finanzas
                        {totalOutstanding > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">!</span>}
                    </button>
                    <button onClick={() => setActiveTab('documents')} className={`px-6 py-4 text-sm font-bold border-b-2 flex gap-2 ${activeTab === 'documents' ? 'border-lumen-priority text-lumen-priority' : 'border-transparent text-gray-500'}`}>
                        <FileText className="w-4 h-4" /> Documentos
                    </button>
                </div>
            </div>

            <main className="max-w-4xl mx-auto p-4 md:p-8">
                {activeTab === 'deliverables' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Pending Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-lumen-priority/10 rounded-full flex items-center justify-center text-lumen-priority">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Pendiente de Aprobación</h2>
                            </div>

                            {pendingItems.length === 0 ? (
                                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
                                    <p>¡Todo al día! No tienes revisiones de diseño pendientes.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {pendingItems.map(item => (
                                        <Link key={item.id} href={`/review/${item.id}`}>
                                            <div className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-lumen-priority/50 transition-all cursor-pointer overflow-hidden relative">
                                                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                                                    {item.type === 'image' || item.type === 'carousel' ? (
                                                        <img src={item.url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-white/50 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
                                                            <ExternalLink className="w-5 h-5 text-gray-600" />
                                                        </div>
                                                    )}
                                                    {item.status === 'changes_requested' && (
                                                        <div className="absolute top-2 right-2 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded shadow-sm">
                                                            Cambios Solicitados
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-bold text-lg mb-1 group-hover:text-lumen-priority transition-colors">{item.title}</h3>
                                                    <p className="text-gray-500 text-sm line-clamp-2">{item.description || "Sin descripción."}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* APPROVED HISTORY (Keeping simplified for brevity) */}
                        <section className="opacity-75">
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Diseños Aprobados</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {approvedItems.map(item => (
                                    <Link key={item.id} href={`/review/${item.id}`}>
                                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded border flex-center text-xs overflow-hidden">
                                                {item.type === 'image' ? <img src={item.url} className="w-full h-full object-cover" /> : "MEDIA"}
                                            </div>
                                            <h4 className="font-medium text-sm text-gray-700 truncate">{item.title}</h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'planning' && (
                    <div className="space-y-4 animate-in fade-in">
                        {gridItems.length === 0 ? <p className="text-center text-gray-400 py-10">No hay planificación disponible.</p> :
                            gridItems.map((item) => (
                                <div key={item.id} className="bg-white border rounded-xl p-4 flex gap-4">
                                    <div className="bg-gray-100 p-3 rounded flex flex-col items-center justify-center min-w-[3.5rem]">
                                        <span className="text-lg font-bold">{new Date(item.date).getDate()}</span>
                                        <span className="text-xs">{new Date(item.date).toLocaleString('es-ES', { month: 'short' })}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold">{item.concept}</h3>
                                        <p className="text-sm text-gray-500">{item.caption}</p>
                                        <div className="mt-2 text-sm">
                                            {item.status === 'approved' ? <span className="text-green-600 font-bold">✅ Aprobado</span> :
                                                <Button size="sm" onClick={() => handleApproveGridItem(item)}>Aprobar</Button>}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )}

                {activeTab === 'finance' && (
                    <div className="animate-in fade-in space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <p className="text-sm text-gray-500 mb-1">Total Pendiente de Pago</p>
                                <h3 className={`text-3xl font-bold ${totalOutstanding > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                    ${totalOutstanding.toLocaleString()}
                                </h3>
                                <p className="text-xs text-gray-400 mt-2">Facturas vencidas o por vencer.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <p className="text-sm text-gray-500 mb-1">Pagos Realizados (Recientes)</p>
                                <h3 className="text-3xl font-bold text-gray-900">
                                    ${financeData.payments.reduce((acc, curr) => acc + curr.paid_amount, 0).toLocaleString()}
                                </h3>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-bold text-gray-800">Facturas</h3>
                            </div>
                            <table className="w-full text-sm">
                                <thead className="text-left text-gray-500 bg-gray-50/50">
                                    <tr>
                                        <th className="p-4">Fecha</th>
                                        <th className="p-4">Factura</th>
                                        <th className="p-4">Estado</th>
                                        <th className="p-4 text-right">Monto</th>
                                        <th className="p-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {financeData.invoices.map((inv) => (
                                        <tr key={inv.name} className="border-t border-gray-100">
                                            <td className="p-4">{inv.posting_date}</td>
                                            <td className="p-4 font-mono">{inv.name}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                        inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>{inv.status}</span>
                                            </td>
                                            <td className="p-4 text-right font-bold">${inv.grand_total.toLocaleString()}</td>
                                            <td className="p-4 text-right">
                                                <Button size="sm" variant="ghost">Descargar</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="animate-in fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents.map((doc) => (
                            <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="block">
                                <div className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 truncate max-w-[200px]" title={doc.name}>{doc.name}</h3>
                                        <p className="text-xs text-gray-500">{doc.date}</p>
                                    </div>
                                    <span className="text-xs font-bold text-lumen-priority flex items-center gap-1">
                                        <Download className="w-3 h-3" /> Descargar
                                    </span>
                                </div>
                            </a>
                        ))}
                        {documents.length === 0 && <p className="col-span-3 text-center text-gray-400 py-10">No hay documentos compartidos.</p>}
                    </div>
                )}

            </main>
        </div>
    );
}
