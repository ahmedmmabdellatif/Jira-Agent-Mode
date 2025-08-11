import React from "react";
import ForgeReconciler, {
  Label,
  SectionMessage,
  Stack,
  Text,
  Textfield,
  useConfig,
} from "@forge/react";

/**
 * Macro configuration (right panel in editor)
 */
const Config = () => {
  return (
    <Stack space="space.200">
      <div>
        <Label>JQL query</Label>
        <Textfield
          name="jql"
          placeholder='e.g. project = "Jira Agent Mode" ORDER BY created DESC'
          isRequired
        />
      </div>
      <div>
        <Label>Max results</Label>
        <Textfield name="maxResults" placeholder="50" />
      </div>
    </Stack>
  );
};

/**
 * Macro view
 */
const App = () => {
  const cfg = useConfig() || {};
  const jql = (cfg.jql || "").trim();
  const maxResults = (cfg.maxResults || "50").trim();

  if (!jql) {
    return (
      <SectionMessage title="Jira Issues Clone">
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
        <Text>Macro installed and rendering via @forge/react. Data fetch & full table come next.</Text>
      </SectionMessage>
    </Stack>
  );
};

// Register UI Kit render + config for the macro
ForgeReconciler.render(<App />);
ForgeReconciler.addConfig(<Config />);
