import React from "react";
import ForgeReconciler, {
  Label,
  SectionMessage,
  Stack,
  Text,
  Textfield,
  useConfig,
} from "@forge/react";

/** Macro configuration UI (opens when configuring the macro) */
const Config = () => (
  <Stack space="space.200">
    <div>
      <Label>JQL query</Label>
      <Textfield
        name="jql"
        placeholder='e.g. project = "Jira Agent Mode" ORDER BY created DESC'
      />
    </div>
    <div>
      <Label>Max results</Label>
      <Textfield name="maxResults" placeholder="50" />
    </div>
  </Stack>
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
    <Stack space="space.200">
      <Text>
        <strong>JQL:</strong> {jql}
      </Text>
      <Text>
        <strong>Max results:</strong> {maxResults}
      </Text>
      <SectionMessage appearance="information" title="Status">
        <Text>UI Kit React is rendering. Data table comes next.</Text>
      </SectionMessage>
    </Stack>
  );
};

// Register UI + config with UI Kit (Forge React)
ForgeReconciler.render(<App />);
ForgeReconciler.addConfig(<Config />);
