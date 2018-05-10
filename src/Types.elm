-- Read more about this program in the official Elm guide:
-- https://guide.elm-lang.org/architecture/effects/http.html


module Types exposing (..)

import Http


type alias Url =
    { de : String
    , en : String
    }


type alias MaybeUrl =
    { name : String
    , url : Maybe String
    }


type alias Event =
    { date : String
    , event : MaybeUrl
    , location : MaybeUrl
    }


type alias Content =
    { news : String
    , events : Maybe (List Event)
    , about : String
    , contact : String
    }


type alias Model =
    { content : Content
    , language : String
    }


type Msg
    = ToggleLanguage
    | NewContent Content


type alias MarkdownOptions =
    { githubFlavored : Maybe { tables : Bool, breaks : Bool }
    , defaultHighlighting : Maybe String
    , sanitize : Bool
    , smartypants : Bool
    }
