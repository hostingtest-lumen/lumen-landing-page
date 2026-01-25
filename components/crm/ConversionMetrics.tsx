"use client";

import { TrendingUp, TrendingDown, Users, Target, Clock, DollarSign } from "lucide-react";
import { Lead } from "@/types/crm";
import { Pipeline } from "@/types/pipelines";

interface ConversionMetricsProps {
    leads: Lead[];
    pipeline: Pipeline;
}

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: number;
    icon: React.ReactNode;
    color?: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricCard({ title, value, subtitle, trend, icon, color = 'blue' }: MetricCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    };

    return (
        <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    {icon}
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-500'
                        }`}>
                        {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
            <div className="text-xs text-gray-500">{title}</div>
            {subtitle && (
                <div className="text-[10px] text-gray-400 mt-1">{subtitle}</div>
            )}
        </div>
    );
}

export function ConversionMetrics({ leads, pipeline }: ConversionMetricsProps) {
    // Calculate metrics
    const totalLeads = leads.length;

    // Find "won" columns (usually last successful column)
    const wonColumns = pipeline.columns.filter(c =>
        c.name.toLowerCase().includes('ganado') ||
        c.name.toLowerCase().includes('completado') ||
        c.name.toLowerCase().includes('satisfecho') ||
        c.color === 'green'
    );
    const wonColumnIds = wonColumns.map(c => c.id);

    // Find "lost" columns
    const lostColumns = pipeline.columns.filter(c =>
        c.name.toLowerCase().includes('perdido') ||
        c.name.toLowerCase().includes('descartado') ||
        c.color === 'red'
    );
    const lostColumnIds = lostColumns.map(c => c.id);

    const wonLeads = leads.filter(l => wonColumnIds.includes(l.columnId || ''));
    const lostLeads = leads.filter(l => lostColumnIds.includes(l.columnId || ''));
    const activeLeads = leads.filter(l =>
        !wonColumnIds.includes(l.columnId || '') &&
        !lostColumnIds.includes(l.columnId || '')
    );

    // Conversion rate
    const closedDeals = wonLeads.length + lostLeads.length;
    const conversionRate = closedDeals > 0
        ? Math.round((wonLeads.length / closedDeals) * 100)
        : 0;

    // Total value
    const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);
    const wonValue = wonLeads.reduce((sum, l) => sum + (l.value || 0), 0);

    // Average time in pipeline (mock calculation)
    const avgDays = 14; // Would calculate from actual dates

    // Format currency
    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
        return `$${value}`;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <MetricCard
                icon={<Users className="w-5 h-5" />}
                title="Total Leads"
                value={totalLeads}
                subtitle={`${activeLeads.length} activos`}
                color="blue"
            />
            <MetricCard
                icon={<Target className="w-5 h-5" />}
                title="Tasa de Conversión"
                value={`${conversionRate}%`}
                subtitle={`${wonLeads.length} ganados / ${closedDeals} cerrados`}
                trend={5}
                color="green"
            />
            <MetricCard
                icon={<DollarSign className="w-5 h-5" />}
                title="Valor Total"
                value={formatCurrency(totalValue)}
                subtitle={`${formatCurrency(wonValue)} ganado`}
                color="purple"
            />
            <MetricCard
                icon={<Clock className="w-5 h-5" />}
                title="Tiempo Promedio"
                value={`${avgDays} días`}
                subtitle="en pipeline"
                color="orange"
            />
        </div>
    );
}

// Mini version for tighter spaces
export function ConversionMetricsMini({ leads, pipeline }: ConversionMetricsProps) {
    const totalLeads = leads.length;
    const wonColumns = pipeline.columns.filter(c => c.color === 'green');
    const wonLeads = leads.filter(l => wonColumns.map(c => c.id).includes(l.columnId || ''));
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads.length / totalLeads) * 100) : 0;

    return (
        <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-gray-600">{totalLeads} leads</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-gray-600">{conversionRate}% conversión</span>
            </div>
        </div>
    );
}
