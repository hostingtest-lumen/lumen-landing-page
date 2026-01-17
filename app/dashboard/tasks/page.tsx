export default function TasksPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Mis Tareas</h1>
            <div className="p-10 text-center bg-white border border-gray-100 rounded-xl">
                <span className="text-4xl">✅</span>
                <h3 className="mt-4 text-lg font-medium">Lista de Tareas</h3>
                <p className="text-gray-500">Tus pendientes asignados desde ERPNext.</p>
            </div>
        </div>
    );
}
