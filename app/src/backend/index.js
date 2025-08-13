import Resolver from "@forge/resolver";
import { api } from "@forge/api";

const resolver = new Resolver();

// Fetch Jira issues via JQL; used by the macro frontend with invoke('searchIssues', ...)
resolver.define("searchIssues", async ({ payload }) => {
  const jqlRaw = (payload && payload.jql ? String(payload.jql) : "").trim();
  if (!jqlRaw) return { total: 0, issues: [], error: "Missing JQL" };

  const maxRaw = (payload && payload.maxResults ? String(payload.maxResults) : "50").trim();
  const max = Math.max(1, Math.min(parseInt(maxRaw, 10) || 50, 100));

  const url =
    `/rest/api/3/search?jql=${encodeURIComponent(jqlRaw)}&maxResults=${max}` +
    `&fields=summary,status,assignee,priority,updated`;

  const resp = await api.asUser().requestJira(url, { headers: { Accept: "application/json" } });
  if (!resp.ok) {
    const text = await resp.text();
    return { total: 0, issues: [], error: `Jira API ${resp.status}: ${String(text).slice(0,300)}` };
  }

  const data = await resp.json();
  const items = (data.issues || []).map((it) => ({
    key: it.key,
    summary: (it.fields && it.fields.summary) || "",
    status: (it.fields && it.fields.status && it.fields.status.name) || "",
    assignee: (it.fields && it.fields.assignee && it.fields.assignee.displayName) || "Unassigned",
    priority: (it.fields && it.fields.priority && it.fields.priority.name) || "",
    updated: (it.fields && it.fields.updated) || "",
  }));

  return { total: typeof data.total === "number" ? data.total : items.length, issues: items };
});

// Forge expects a named export that matches the manifest handler suffix
export const handler = resolver.getDefinitions();
