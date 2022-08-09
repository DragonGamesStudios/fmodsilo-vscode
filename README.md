# fmodsilo README

FModSilo is a language server for Factorio modding. It will be updated when it will be updated, as I also have plenty of other things to take care of. I will try to maintain the project as well as I can and keep working on it in my free time, though. This is only the client part of FModSilo. The server side is available here: https://github.com/DragonGamesStudios/fmodsilo-ls. Note, that to get the extension working, you need both this extension and the server. You will also have to build the server yourself, e. g. using `cargo install fmodsilo_interface_stdio`. The server is written in [Rust](https://www.rust-lang.org/). Then, simply set the path to the compiled executable in user settings and you should be good.

## Features

It's pretty much a newborn project, so the server doesn't do much. Yet. There is, however, quite a lot of planned features.

## Requirements

### FModSilo server side

You will first need to install [Rust](https://www.rust-lang.org/) with Cargo (they usually come in one package). Then, simply run `cargo install fmodsilo_interface_stdio` and set the path to the new executable in settings under `fmodsilo.serverExecutablePath`.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `fmodsilo.serverExecutablePath`: enable/disable this extension

## Known Issues

None so far, apart from the fact that the server does nothing.

## Release Notes

### 0.1.1

Initial release of FModSilo.
