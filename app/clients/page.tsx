import ClientsTable from "@/components/ClientsTable";

export default function ClientsPage() {
  return (
    <div>
      <p className="text-gray-700">List and manage your clients here.</p>
      <ClientsTable />
    </div>
  );
}
