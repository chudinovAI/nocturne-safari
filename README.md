# Nocturne

A local Safari extension for dark mode. It uses the open-source [Dark Reader](https://github.com/darkreader/darkreader) engine (MIT); this is not the official Dark Reader extension.

## Installing on This Mac

After building, the application is located at `build/Build/Products/Debug/Nocturne.app`; a ready-made build is not included in the source repository. Launch it once. When built using the instructions below, it is signed only with a local ad-hoc signature, not an Apple developer certificate.

1. In Safari, open “Settings” → “Add-ons” / “Advanced” and enable “Show features for web developers”.
2. In the “Developer” tab that appears, enable “Allow unsigned extensions”. This reduces Safari's protection and resets after quitting Safari. Enable it only if you understand the risk.
3. In “Settings” → “Extensions”, enable Nocturne and grant it access to the websites where it should work. Open or refresh a page; the Nocturne toolbar button controls the mode.

For some newer Safari versions, Apple also describes temporarily installing the `extension` folder through “Settings” → “Developer” → “Add Temporary Extension”. Before installing from a fresh copy of the project, run `npm ci` and `npm run build` in its root: the generated `extension/content.js` is not stored in the repository. The temporary extension is removed when Safari quits or after 24 hours. More details: [Apple's instructions](https://developer.apple.com/documentation/safariservices/running-your-safari-web-extension).

## Controls and Limitations

- **Dark mode** disables the effect everywhere; **This website** disables it for the exact hostname, separately from subdomains. Settings are saved locally in `browser.storage.local`.
- **Brightness** adjusts brightness from 50% to 150%; changes are applied when the slider is released. The switches update already open pages where the extension has been started.
- Only the top-level document on HTTP(S) is processed: embedded iframes may remain light. Safari's internal pages and other protected pages are inaccessible to extensions. Sites with complex styles may display incorrectly; disable the mode for them.
- The extension needs access to the content of visited websites to change their appearance, as well as access to tabs to identify the current host. The interface code does not send settings to a server; the engine may request resources from the websites themselves to process styles.
- It uses the Dark Reader library but does not include all of the official extension's features, settings, and site-specific compatibility rules.

## Building

Requires Node.js 18 or newer, npm, Xcode 27 or newer, installed Xcode command-line tools, and macOS SDK 27 or newer. The saved project has a macOS deployment target of 27.0.

The Xcode project is already included in the source; it does not need to be recreated for a normal build. The generated `extension/content.js` is not stored in the repository, so build the JavaScript first:

```sh
npm ci
npm run build
xcodebuild -project 'Safari/Nocturne/Nocturne.xcodeproj' -scheme Nocturne \
  -configuration Debug -derivedDataPath build \
  CODE_SIGN_STYLE=Manual CODE_SIGN_IDENTITY=- CODE_SIGNING_REQUIRED=YES build
```

**Recreating the project:** `npm run package:safari` runs Apple's converter and creates `Safari/Nocturne`. If the project already exists, regenerating it first requires saving your changes and manually deleting the existing `Safari/Nocturne`. This deletes the current project and its custom settings, including license references; restore and verify them after generation. Do not run the recreation command for a normal build. Icons can be regenerated if needed with `swift scripts/icons.swift`.

Dark Reader and its dependency malevic are distributed under MIT: the full notices are in `extension/DARKREADER-LICENSE.txt` and `extension/MALEVIC-LICENSE.txt` and are included in the extension's resources. Keep them when distributing a built version.
