{
  mkShell,
  alejandra,
  bash,
  nodejs,
  pnpm,
}:
mkShell rec {
  name = "matt-init";

  packages = [
    bash
    nodejs
    pnpm

    # Required for CI for format checking.
    alejandra
  ];
}
