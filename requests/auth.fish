function auth
    set -l base_url $argv[1]
    set -l endpoint /auth/authenticate
    set -l headers "Content-Type: application/json"
    set -l body '{"username": "test","password": "12345678"}'
    set -l url $base_url$endpoint

    echo "Requesting token from $endpoint" >&2

    set response $(curl -s --fail-with-body -X POST $url -H $headers --data $body)

    if test $status -ne 0
        echo $response
        exit 1
    end

    set token $(echo $response | jq .token | tr -d '"')

    echo $token
end
