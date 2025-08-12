import Resolver from '@forge/resolver';
import api from '@forge/api';

const resolver = new Resolver();

resolver.define('fetchIssues', async ({ payload }) => {
  const { jql, maxResults } = payload;
    const jqlEncoded = encodeURIComponent(jql);
  const res = await api.asUser().requestJira(`/rest/api/3/search?jql=${jqlEncoded}&maxResults=${maxResults}`);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  const data = await res.json();
  const issues = data.issues.map(issue => ({
    key: issue.key,
    summary: issue.fields.summary,
    status: issue.fields.status?.name || '',
    assignee: issue.fields.assignee?.displayName || 'Unassigned',
    priority: issue.fields.priority?.name || '',
    updated: issue.fields.updated,
  }));
  return issues;
});

export const handler = resolver.getDefinitions();
