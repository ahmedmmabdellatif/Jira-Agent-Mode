import React, { useState, useEffect } from "react";
import ForgeReconciler, {
  Label,
  SectionMessage,
  Text,
  Textfield,
  useConfig,
  Table,
  Head,
  Row,
  Cell,
  Body,
} from "@forge/react";
import { invoke } from '@forge/bridge';

/** Macro configuration UI (allowed components only — no Stack) */
const Config = () => (
  <>
    <Label>JQL query</Label>
    <Textfield
      name="jql"
      placeholder="e.g. project = 'Jira Agent Mode' ORDER BY created DESC"
      isRequired
    />
    <Label>Max results</Label>
    <Textfield name="maxResults" placeholder="50" />
  </>
);

/** Macro view */
const App = () => {
  const cfg = useConfig() || {};
  const jql = (cfg.jql || '').trim();
  const maxResults = (cfg.maxResults || '50').trim();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadIssues = async () => {
      if (!jql) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fetched = await invoke('fetchIssues', { jql, maxResults });
        setIssues(fetched);
      } catch (e) {
        setError(e.toString());
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, [jql, maxResults]);

  if (!jql) {
    return (
      <SectionMessage appearance="information" title="Jira Issues Clone">
        <Text>Set a JQL query in the macro config.</Text>
      </SectionMessage>
    );
  }

  if (loading) {
    return <Text>Loading issues…</Text>;
  }

  if (error) {
    return (
      <SectionMessage appearance="error" title="Error">
        <Text>{error}</Text>
      </SectionMessage>
    );
  }

  return (
    <>
      <Text>JQL: {jql}</Text>
      <Text>Max results: {maxResults}</Text>
      {issues.length === 0 ? (
        <SectionMessage appearance="warning" title="No issues">
          <Text>No issues match this filter.</Text>
        </SectionMessage>
      ) : (
        <Table>
          <Head>
            <Row>
              <Cell><Text>Key</Text></Cell>
              <Cell><Text>Summary</Text></Cell>
              <Cell><Text>Status</Text></Cell>
              <Cell><Text>Assignee</Text></Cell>
              <Cell><Text>Priority</Text></Cell>
              <Cell><Text>Updated</Text></Cell>
            </Row>
          </Head>
          <Body>
            {issues.map(issue => (
              <Row key={issue.key}>
                <Cell>
                  <a href={`https://jiraagentmode.atlassian.net/browse/${issue.key}`}>{issue.key}</a>
                </Cell>
                <Cell><Text>{issue.summary}</Text></Cell>
                <Cell><Text>{issue.status}</Text></Cell>
                <Cell><Text>{issue.assignee}</Text></Cell>
                <Cell><Text>{issue.priority}</Text></Cell>
                <Cell><Text>{issue.updated}</Text></Cell>
              </Row>
            ))}
          </Body>
        </Table>
      )}
    </>
  );
};

ForgeReconciler.render(<App />);
ForgeReconciler.addConfig(<Config />);
