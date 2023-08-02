#!/usr/bin/env fish

# options:
# --auth <boolean> - whether to use auth (optional)
# --endpoint <string> - the endpoint to hit (optional)

source ./requests/auth.fish

function normalize_endpoint
    set -l input $argv[1]
    if test $input && test (string sub -l 1 -- $input) = /
        set input (string sub -s 2 $input)
    end

    echo $input
end

set -x -g base_url "http://[::1]:8080"
set -x -g endpoint ""
set -x -g curl_args


if contains -- --auth $argv
    echo "Authenticating..." >&2
    set -x -g token $(auth $base_url)
end


if contains -- --endpoint $argv
    set index $(contains -i -- --endpoint $argv)
    set value_index (math $index + 1)
    set -x -g endpoint $argv[$value_index]
end

set -g endpoint (normalize_endpoint $endpoint)

echo "Endpoint: $endpoint" >&2

set url "$base_url/$endpoint"

if test $token
    set --append curl_args -H "Authorization: Bearer $token"
end

for arg in $argv
    set -l normalized_endpoint (normalize_endpoint $arg)

    if test $arg != --auth && test $arg != --endpoint && test $normalized_endpoint != $endpoint
        set --append curl_args $arg
    end
end

echo "Requesting $url" >&2

echo "ARGS: $curl_args" >&2
echo -e "\n" >&2

echo "RESPONSE:" >&2
curl $url -s $curl_args
