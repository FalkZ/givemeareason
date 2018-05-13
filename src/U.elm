module U exposing (..)


replace : String -> String -> String -> String
replace toReplace replacement string =
    string
        |> String.split toReplace
        |> String.join replacement


remove : String -> String -> String
remove toRemove string =
    replace toRemove "" string


u : record -> String
u utilityClasses =
    utilityClasses
        |> toString
        |> replace " = \"" "U"
        |> replace " = " "U"
        |> remove "$"
        |> remove ","
        |> remove "{"
        |> remove "}"
        |> remove "\""
        |> String.trim
        |> Debug.log "string"
