{
  mkShell,
  alejandra,
  bash,
  nodejs,
  pnpm,{{ADDITIONAL_PARAMS}}
}:
mkShell rec {
  name = "{{PROJECT_NAME}}";

  packages = [
    bash
    nodejs
    pnpm{{ADDITIONAL_PACKAGES}}

    # Required for CI for format checking.
    alejandra
  ];
}