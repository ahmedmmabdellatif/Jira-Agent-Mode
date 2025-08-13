import Resolver from "@forge/resolver";
import { api } from "@forge/api";

const resolver = new Resolver();

resolver.define("searchIssues", async ({ payload }) => {
  const jqlRaw = (payload?&jql || "").trim();
  if (!jqlRaw) {
    return { total: 0, issues: [], error: "Missing JQL" };
  }
  const cap = Math.max(1, Math.min(parseInt(payload?.maxResults || "50", 10) || 50, 100));
  const jql = encodeURIComponent(jqlRaw);
  const url = `/rest/api/3/search?jql=${jql}&maxResults=${cap}&fields=summary,status,assignee,priority,updated`;

  const resp = await api.asUser().requestJira(url, {
    headers: { Accept: "application/json" },
  });

  if (!resp.ok) {
    const text = await resp.text();
    return { total: 0, issues: [], error: `Jira API ${resp.status}: ${text?.slice(0, 300)}` };
  }

  const data = await resp.json();
  const issues = (data.issues || []).map((it) => ({
    key: it.key,
    summary: it.fields?.summary || "",
    status: it.fields?.status?.name || "",
    assignee: it.fields?.assignee?.displayName || "Unassigned",
    priority: it.fields?.priority?.name || "",
    updated: it.fields?.updated || "",
  }));

  return { total: data.total ?? issues.length, issues };
});

export const run = resolver.getDefinitions();