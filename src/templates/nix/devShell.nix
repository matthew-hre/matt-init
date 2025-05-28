{
  mkShell,
  alejandra,
  bash,
  nodejs,
  pnpm,
}:
mkShell rec {
  name = "{{PROJECT_NAME}}";

  packages = [
    bash
    nodejs
    pnpm

    # Required for CI for format checking.
    alejandra
  ];
}