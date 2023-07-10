{
  inputs.dream2nix.url = "github:nix-community/dream2nix";
  outputs = inp:
    inp.dream2nix.lib.makeFlakeOutputs {
      systemsFromFile = ./nix_systems;
      config.projectRoot = ./.;
      source = ./.;
      projects = ./projects.toml;
	  settings = [
		{
			subsystemInfo.noDev = true;
			subsystemInfo.nodejs = 18;
		}
	  ];
    };
}
