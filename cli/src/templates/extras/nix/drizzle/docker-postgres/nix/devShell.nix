{
  mkShell,
  alejandra,
  bash,
  nodejs,
  pnpm,
  docker-compose,
}:
mkShell rec {
  name = "matt-init-docker-postgres";

  packages = [
    bash
    nodejs
    pnpm

    # Required for CI for format checking.
    alejandra

    docker-compose
  ];
}
