{
  mkShell,
  alejandra,
  bash,
  nodejs,
  pnpm,
}:
mkShell rec {
  name = "__APP_NAME__";

  packages = [
    bash
    nodejs
    pnpm

    # Required for CI for format checking.
    alejandra
  ];
}
