import React, { useEffect, useState } from "react";
import ForgeReconciler, {
  Label,
  Link,
  SectionMessage,
  Text,
  Textfield,
  useConfig,
} from "@forge/react";
import { invoke } from "@forge/bridge";

const Config = () => (
  <>
    <Label>JQL query</Label>
    <Textfield
      name="jql"
      placeholder='e.g. project = "Jira Agent Mode" ORDER BY created DESC'
      isRequired
    />
    <Label>Max results</Label>
    <Textfield name="maxResults" placeholder="50" />
  </>
);

const IssueRow = ({ site, issue }) => {
  const browseUrl = `https://${site}/browse/${issue.key}`;
  return (
    <Text>
      {issue.key} – <Link href={browseUrl}>{issue.summary || "(no summary)"}</Link>{" "}
      | Status: {issue.status || "-"} | Assignee: {issue.assignee || "Unassigned"} | Priority:{" "}
      {issue.priority || "-"} | Updated: {issue.updated?.slice(0, 10) || "-"}
    </Text>
  );
};

const App = () => {
  const cfg = useConfig() || {};
  const jql = (cfg.jql || "").trim();
  const maxResults = (cfg.maxResults || "50").trim();

  const [state, setState] = useState({ loading: false, error: "", items: [], total: 0 });

  useEffect(() => {
    let active = true;
    const runFetch = async () => {
      if (!jql) return;
      setState((s) => ({ ...s, loading: true, error: "" }));
      try {
        const res = await invoke("searchIssues", { jql, maxResults });
        if (!active) return;
        if (res?.error) {
          setState({ loading: false, error: res.error, items: [], total: 0 });
        } else {
          setState({
            loading: false,
            error: "",
            items: res.issues || [],
            total: res.total || 0,
          });
        }
      } catch (e) {
        if (!active) return;
        setState({
          loading: false,
          error: `Invoke failed: ${String(e).slice(0, 300)}`,
          items: [],
          total: 0,
        });
      }
    };
    runFetch();
    return () => {
      active = false;
    };
  }, [jql, maxResults]);

  if (!jql) {
    return (
      <SectionMessage appearance="information" title="Jira Issues Clone">
        <Text>Set a JQL query in the macro config, then publish.</Text>
      </SectionMessage>
    );
  }
  if (state.loading) {
    return (
      <SectionMessage appearance="information" title="Loading">
        <Text>Fetching issues…</Text>
      </SectionMessage>
    );
  }
  if (state.error) {
    return (
      <SectionMessage appearance="error" title="Error">
        <Text>{state.error}</Text>
      </SectionMessage>
    );
  }
  if (!state.items.length) {
    return (
      <>
        <Text>JQL: {jql}</Text>
        <Text>Max results: {maxResults}</Text>
        <SectionMessage appearance="warning" title="No results">
          <Text>No issues match this filter.</Text>
        </SectionMessage>
      </>
    );
  }
  const site = "jiraagentmode.atlassian.net";
  return (
    <>
      <Text>JQL: {jql}</Text>
      <Text>Max results: {maxResults}</Text>
      <SectionMessage appearance="information" title={`Results (${state.total})`}>
        <Text>Rendering first {state.items.length} item(s).</Text>
      </SectionMessage>
      {state.items.map((it) => (
        <IssueRow key={it.key} site={site} issue={it} />
      ))}
    </>
  );
};

ForgeReconciler.render(<App />);
ForgeReconciler.addConfig(<Config />);