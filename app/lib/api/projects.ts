export async function createProject(payload: any) {
  const res = await fetch("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return res.json();
}
