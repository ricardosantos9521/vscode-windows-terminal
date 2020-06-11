import * as vscode from 'vscode';

export enum OS {
  WINDOWS,
  UNIX,
  UNIXLIKE
}

enum OSShellKey {
  WINDOWS = 'windows',
  LINUX = 'linux',
  MACOS = 'osx'
}

// Default shells in vscode
const defaultShells = {
  windows: 'powershell.exe',
  linux: '$SHELL',
  osx: '$SHELL',
};

function getShell(os: OSShellKey) {

  const integratedShell = vscode.workspace.getConfiguration('terminal.integrated.shell');

  const shell = integratedShell?.get<string>(os);
  if (shell) {
    return shell;
  }

  return defaultShells[os];
}

export function shellScript(os: OS) {
  if (os === OS.WINDOWS) {
    return `${getShell(OSShellKey.WINDOWS)}`;
  }

  if (os === OS.UNIX) {
    return `${getShell(OSShellKey.LINUX)} || exec $SHELL`;
  }

  if (os === OS.UNIXLIKE) {
    return `if [[ "$(uname -s)" = "Darwin" ]]\\; then ${getShell(OSShellKey.MACOS)}\\; else ${getShell(OSShellKey.LINUX)}\\; fi || exec $SHELL`;
  }

  return '';
}
