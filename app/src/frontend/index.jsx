import React from "react";
import ForgeReconciler, {
  Label,
  SectionMessage,
  Text,
  Textfield,
  useConfig,
} from "@forge/react";

/** Macro configuration UI (allowed components only — no Stack) */
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

/** Macro view */
const App = () => {
  const cfg = useConfig() || {};
  const jql = (cfg.jql || "").trim();
  const maxResults = (cfg.maxResults || "50").trim();

  if (!jql) {
    return (
      <SectionMessage appearance="information" title="Jira Issues Clone">
        <Text>Set a JQL query in the macro config.</Text>
      </SectionMessage>
    );
  }

  return (
    <>
      <Text>
        <strong>JQL:</strong> {jql}
      </Text>
      <Text>
        <strong>Max results:</strong> {maxResults}
      </Text>
      <SectionMessage appearance="information" title="Status">
        <Text>UI Kit React is rendering. Data table comes next.</Text>
      </SectionMessage>
    </>
  );
};

// Register UI + config
ForgeReconciler.render(<App />);
ForgeReconciler.addConfig(<Config />);
