import ForgeUI, {
  render,
  Macro,
  MacroConfig,
  TextField,
  Text,
  SectionMessage,
  useConfig,
} from "@forge/ui";

/**
 * Macro configuration shown in the right-hand panel while editing.
 * We collect a JQL string and a Max Results number. This is stored by Forge automatically.
 */
const Config = () => (
  <MacroConfig>
    <TextField
      name="jql"
      label="JQL query"
      description='Example: project = "Jira Agent Mode" ORDER BY created DESC'
      isRequired={true}
    />
    <TextField
      name="maxResults"
      label="Max results"
      description="How many issues to display (we'll cap/validate in code later)."
      placeholder="50"
    />
  </MacroConfig>
);

/**
 * Published view. For now we just render the saved config to prove install/render works.
 * Next steps will call Jira REST and render a real issues table to match the native macro.
 */
const View = () => {
  const cfg = useConfig() || {};
  const jql = (cfg.jql || "").trim();
  const maxResults = (cfg.maxResults || "50").trim();

  if (!jql) {
    return (
      <SectionMessage title="Jira Issues Clone">
        <Text>Configure this macro: set a JQL query in the right panel.</Text>
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
      <SectionMessage title="Status">
        <Text>Macro installed and rendering. Data fetch & full UI come next.</Text>
      </SectionMessage>
    </>
  );
};

export const run = render(<Macro app={<View />} config={<Config />} />);
