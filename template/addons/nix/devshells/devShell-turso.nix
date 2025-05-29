{
  mkShell,
  alejandra,
  bash,
  nodejs,
  pnpm,
  turso-cli,
  sqld
}:
mkShell rec {
  name = "{{PROJECT_NAME}}";

  packages = [
    bash
    nodejs
    pnpm

    # Required for CI for format checking.
    alejandra

    # Turso CLI and SQL client
    turso-cli
    sqld
  ];
}
