#!/usr/bin/env fish

# upload todo list
fish ./scripts/requests.fish --auth -X POST --endpoint /todos/files/import -F "todoListFile=@./todo.csv"


