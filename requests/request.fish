#!/usr/bin/env fish

source ./requests/auth.fish

set -x -g base_url "http://[::1]:8080"
set -x -g endpoint ""
set -x -g curl_args

# options:
# --auth <boolean> - whether to use auth (optional)
# --endpoint <string> - the endpoint to hit (optional)

if contains -- --auth $argv
    echo "Authenticating..." >&2
    set -x -g token $(auth $base_url)
end


if contains -- --endpoint $argv
    set index $(contains -i -- --endpoint $argv)
    set value_index (math $index + 1)
    set -x -g endpoint $argv[$value_index]
end

if test $endpoint && test $(string sub -l 1 $endpoint) = /
    set -x -g endpoint (string sub -s 2 $endpoint)
end

set url "$base_url/$endpoint"

if test $token
    set --append curl_args -H "Authorization: Bearer $token"
end

for arg in $argv
    if test $arg != --auth && test $arg != --endpoint && contains $endpoint $arg
        set --append curl_args $arg
    end
end

echo "Requesting $url" >&2

echo "ARGS: $curl_args" >&2
echo -e "\n" >&2

echo "RESPONSE:" >&2
curl $url -s $curl_args
