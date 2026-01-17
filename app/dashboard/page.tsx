import DashboardView from "@/components/team/DashboardView";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Hola, Kevin 👋</h1>
                    <p className="text-gray-500">Aquí está el resumen de operaciones de hoy.</p>
                </div>
            </div>

            <DashboardView />
        </div>
    );
}
