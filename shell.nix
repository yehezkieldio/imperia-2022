{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
    name = "imperia";
    packages = with pkgs; [
        nodejs
        yarn
        neofetch # For support purposes.
        duf # Don't mind me adding a disk checker :)
    ];
}