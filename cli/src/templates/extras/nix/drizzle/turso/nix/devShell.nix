{
  mkShell,
  alejandra,
  bash,
  nodejs,
  pnpm,
  turso-cli,
  sqld,
}:
mkShell rec {
  name = "__APP_NAME__";

  packages = [
    bash
    nodejs
    pnpm

    # Required for CI for format checking.
    alejandra

    turso-cli
    sqld
  ];
}
