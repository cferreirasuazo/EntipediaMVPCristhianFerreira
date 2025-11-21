"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";

type Client = {
  id: number;
  name: string;
  type: "Persona" | "Compañía";
  value: string | number;
  since_date: string | null;
  until_date: string | null;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ClientsTable() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<{ id: number; field: string } | null>(
    null
  );
  const [localEdits, setLocalEdits] = useState<Record<number, Partial<Client>>>(
    {}
  );
  const [showCreate, setShowCreate] = useState(false);

  const { data, mutate } = useSWR(
    `/api/clients?page=${page}&pageSize=10`,
    fetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    // reset edits when page changes
    setEditing(null);
    setLocalEdits({});
  }, [page]);

  const clients: Client[] = data?.data || [];
  const total: number = data?.total || 0;
  const pageSize: number = data?.pageSize || 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function startEdit(id: number, field: string) {
    setEditing({ id, field });
    setLocalEdits((ed) => ({ ...ed, [id]: { ...(ed[id] || {}) } }));
  }

  async function saveEdit(id: number) {
    const patch = localEdits[id];
    if (!patch) return;
    // convert value types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = { id };
    if (patch.name !== undefined) payload.name = String(patch.name);
    if (patch.type !== undefined) payload.type = String(patch.type);
    if (patch.value !== undefined) payload.value = Number(patch.value);
    if (patch.since_date !== undefined)
      payload.since_date = patch.since_date || null;
    if (patch.until_date !== undefined)
      payload.until_date = patch.until_date || null;

    await fetch("/api/clients", {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    setEditing(null);
    mutate();
  }

  async function deleteClient(id: number) {
    if (!confirm("Borrar cliente? Esta acción es irreversible.")) return;
    await fetch(`/api/clients?id=${id}`, { method: "DELETE" });
    mutate();
  }

  function formatCurrency(v: number | string) {
    const num = typeof v === "string" ? Number(v) : v || 0;
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(num);
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Clientes</h2>
        <div>
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white"
            onClick={() => setShowCreate(true)}
          >
            Crear cliente
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-right">Valor (DOP)</th>
              <th className="px-4 py-2 text-left">Desde</th>
              <th className="px-4 py-2 text-left">Hasta</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2">
                  {editing?.id === c.id && editing.field === "name" ? (
                    <input
                      autoFocus
                      value={(localEdits[c.id]?.name ?? c.name) as string}
                      onChange={(event) =>
                        setLocalEdits((prev) => ({
                          ...prev,
                          [c.id]: {
                            ...(prev[c.id] || {}),
                            name: event.target.value,
                          },
                        }))
                      }
                      onBlur={() => saveEdit(c.id)}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <div
                      onClick={() => startEdit(c.id, "name")}
                      className="cursor-pointer"
                    >
                      {c.name}
                    </div>
                  )}
                </td>

                <td className="px-4 py-2">
                  {editing?.id === c.id && editing.field === "type" ? (
                    <select
                      value={(localEdits[c.id]?.type ?? c.type) as string}
                      onChange={(event) =>
                        setLocalEdits((prev) => ({
                          ...prev,
                          [c.id]: {
                            ...(prev[c.id] || {}),
                            type: event.target.value as "Persona" | "Compañía",
                          },
                        }))
                      }
                      onBlur={() => saveEdit(c.id)}
                      className="border rounded px-2 py-1"
                    >
                      <option>Persona</option>
                      <option>Compañía</option>
                    </select>
                  ) : (
                    <div
                      onClick={() => startEdit(c.id, "type")}
                      className="cursor-pointer"
                    >
                      {c.type}
                    </div>
                  )}
                </td>

                <td className="px-4 py-2 text-right">
                  {editing?.id === c.id && editing.field === "value" ? (
                    <input
                      type="number"
                      step="0.01"
                      value={
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (localEdits[c.id]?.value ?? String(c.value)) as any
                      }
                      onChange={(event) =>
                        setLocalEdits((prev) => ({
                          ...prev,
                          [c.id]: {
                            ...(prev[c.id] || {}),
                            value: event.target.value,
                          },
                        }))
                      }
                      onBlur={() => saveEdit(c.id)}
                      className="w-32 border rounded px-2 py-1 text-right"
                    />
                  ) : (
                    <div
                      onClick={() => startEdit(c.id, "value")}
                      className="cursor-pointer"
                    >
                      {formatCurrency(Number(c.value))}
                    </div>
                  )}
                </td>

                <td className="px-4 py-2">
                  {editing?.id === c.id && editing.field === "since_date" ? (
                    <input
                      type="date"
                      value={
                        (localEdits[c.id]?.since_date ??
                          c.since_date ??
                          "") as string
                      }
                      onChange={(event) =>
                        setLocalEdits((prev) => ({
                          ...prev,
                          [c.id]: {
                            ...(prev[c.id] || {}),
                            since_date: event.target.value,
                          },
                        }))
                      }
                      onBlur={() => saveEdit(c.id)}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    <div
                      onClick={() => startEdit(c.id, "since_date")}
                      className="cursor-pointer"
                    >
                      {c.since_date || "-"}
                    </div>
                  )}
                </td>

                <td className="px-4 py-2">
                  {editing?.id === c.id && editing.field === "until_date" ? (
                    <input
                      type="date"
                      value={
                        (localEdits[c.id]?.until_date ??
                          c.until_date ??
                          "") as string
                      }
                      onChange={(event) =>
                        setLocalEdits((prev) => ({
                          ...prev,
                          [c.id]: {
                            ...(prev[c.id] || {}),
                            until_date: event.target.value,
                          },
                        }))
                      }
                      onBlur={() => saveEdit(c.id)}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    <div
                      onClick={() => startEdit(c.id, "until_date")}
                      className="cursor-pointer"
                    >
                      {c.until_date || "-"}
                    </div>
                  )}
                </td>

                <td className="px-4 py-2 text-center">
                  <button
                    className="px-2 py-1 mr-2 rounded bg-yellow-500 text-white"
                    onClick={() => {
                      setEditing({ id: c.id, field: "name" });
                    }}
                    title="Editar"
                  >
                    Editar
                  </button>
                  <button
                    className="px-2 py-1 rounded bg-red-600 text-white"
                    onClick={() => deleteClient(c.id)}
                    title="Borrar"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          Mostrando página {page} de {totalPages} — {total} clientes
        </div>
        <div>
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2 py-1 mr-2 rounded border"
          >
            Anterior
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-2 py-1 rounded border"
          >
            Siguiente
          </button>
        </div>
      </div>

      {showCreate && (
        <CreateModal
          onClose={() => {
            setShowCreate(false);
            mutate();
          }}
        />
      )}
    </div>
  );
}

function CreateModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"Persona" | "Compañía">("Persona");
  const [value, setValue] = useState<number>(0);
  const [since_date, setSince] = useState<string>("");
  const [until_date, setUntil] = useState<string>("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/clients", {
      method: "POST",
      body: JSON.stringify({
        name,
        type,
        value,
        since_date: since_date || undefined,
        until_date: until_date || undefined,
      }),
      headers: { "Content-Type": "application/json" },
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Crear cliente</h3>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm">Nombre</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block text-sm">Tipo</label>
            <select
              value={type}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setType(e.target.value as any)}
              className="w-full border rounded px-2 py-1"
            >
              <option>Persona</option>
              <option>Compañía</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Valor (DOP)</label>
            <input
              type="number"
              step="0.01"
              value={String(value)}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm">Desde</label>
              <input
                type="date"
                value={since_date}
                onChange={(e) => setSince(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm">Hasta</label>
              <input
                type="date"
                value={until_date}
                onChange={(e) => setUntil(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-3 py-1 rounded border"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 text-white"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
