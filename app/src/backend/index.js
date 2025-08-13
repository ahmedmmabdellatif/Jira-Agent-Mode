import Resolver from "@forge/resolver";
import { api } from "@forge/api";

const resolver = new Resolver();

resolver.define("searchIssues", async ({ payload }) => {
  const jqlRaw = String((payload && payload.jql) || "").trim();
  if (!jqlRaw) {
    return { total: 0, issues: [], error: "Missing JQL" };
  }
  const maxRaw = String((payload && payload.maxResults) || "50");
  const maxNum = Number.parseInt(maxRaw, 10);
  const cap = Math.max(1, Math.min(Number.isFinite(maxNum) ? maxNum : 50, 100));

  const jql = encodeURIComponent(jqlRaw);
  const url =
    `/rest/api/3/search?jql=${jql}&maxResults=${cap}` +
    `&fields=summary,status,assignee,priority,updated`;

  const resp = await api.asUser().requestJira(url, {
    headers: { Accept: "application/json" },
  });

  if (!resp.ok) {
    const text = await resp.text();
    return {
      total: 0,
      issues: [],
      error: `Jira API ${resp.status}: ${String(text).slice(0, 300)}`,
    };
  }

  const data = await resp.json();
  const issues = (data.issues || []).map((it) => ({
    key: it.key,
    summary: (it.fields && it.fields.summary) || "",
    status: (it.fields && it.fields.status && it.fields.status.name) || "",
    assignee:
      (it.fields && it.fields.assignee && it.fields.assignee.displayName) ||
      "Unassigned",
    priority: (it.fields && it.fields.priority && it.fields.priority.name) || "",
    updated: (it.fields && it.fields.updated) || "",
  }));

  return { total: typeof data.total === "number" ? data.total : issues.length, issues };
});

export const run = resolver.getDefinitions();
