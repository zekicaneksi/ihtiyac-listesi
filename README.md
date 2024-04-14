# ihtiyac-listesi

Requirement for setting up the project locally;

- With Nix
    - Docker
- Without Nix
    - Docker
    - Node.js (20) with NPM

To get the project running, go into these directories, and follow instructions to get them running;

- `frontend`
- `backend`
- `reverse_proxy`

Then visit [http://localhost:3000](http://localhost:3000)

### Notes

#### Ports

Ports among `frontend`, `backend`, and `reverse_proxy` must be consistent.

#### About Nix

Nix is a package manager. And with `nix-shell` you can have a virtual environment that has all the tools neccessary for each of your projects easily. Provided `shell.nix` file is to be used with the `nix-shell` command.
