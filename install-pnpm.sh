#!/usr/bin/env bash

# tr -d '"' is used to remove the double quotes from the string
package_json=$(<package.json)
package_manager=$( echo $package_json | jq .packageManager | tr -d '"')
pnpm_version=$(echo $package_manager | cut -d "@" -f 2)

wget -qO- https://pnpm.js.org/pnpm.js | node - add --global pnpm@"$pnpm_version"
