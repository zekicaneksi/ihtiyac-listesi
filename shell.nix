let
  config = {
    allowUnfree = true;
  };
  pkgs = import <nixpkgs> { inherit config; };
in
  pkgs.mkShell {
    packages = [
      pkgs.nodejs_20

      pkgs.mongodb-compass

      pkgs.nodePackages.prettier # formatter
      pkgs.nodePackages.eslint # linter
    ];
  }
