{
  description = "A basic flake with a shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [ pkgs.bashInteractive ];
          nativeBuildInputs = [
            pkgs.nodejs_20
            pkgs.typescript
          ];
          buildInputs = [ ];

          NIX_LD_LIBRARY_PATH = with pkgs; lib.makeLibraryPath [
            stdenv.cc.cc
            openssl
            xorg.libXcomposite
            xorg.libXtst
            xorg.libXrandr
            xorg.libXext
            xorg.libX11
            xorg.libXfixes
            libGL
            libva
            pipewire
            xorg.libxcb
            xorg.libXdamage
            xorg.libxshmfence
            xorg.libXxf86vm
            libelf
            
            # Required
            glib
            gtk2
            gtk3
            bzip2

            xorg.libXinerama
            xorg.libXcursor
            xorg.libXrender
            xorg.libXScrnSaver
            xorg.libXi
            xorg.libSM
            xorg.libICE
            gnome2.GConf
            nspr
            nss
            cups
            libcap
            SDL2
            libusb1
            dbus-glib
            ffmpeg
            # Only libraries are needed from those two
            libudev0-shim

            flac
            freeglut
            libjpeg
            libpng
            libpng12
            libsamplerate
            libmikmod
            libtheora
            libtiff
            pixman
            speex
            SDL_image
            SDL_ttf
            SDL_mixer
            SDL2_ttf
            SDL2_mixer
            libappindicator-gtk2
            libdbusmenu-gtk2
            libindicator-gtk2
            libcaca
            libcanberra
            libgcrypt
            libvpx
            librsvg
            xorg.libXft
            libvdpau
            gnome2.pango
            cairo
            atk
            gdk-pixbuf
            fontconfig
            freetype
            dbus
            alsaLib
            expat

            # Needed for electron
            libdrm
            mesa
            libxkbcommon
            # ...
            ];

            NIX_LD = pkgs.lib.fileContents "${pkgs.stdenv.cc}/nix-support/dynamic-linker";
        };
      });
}
