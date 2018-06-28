-- Read more about this program in the official Elm guide:
-- https://guide.elm-lang.org/architecture/effects/http.html


module Types exposing (..)


import ImageSlider
import Calendar exposing(Events)
import Http


type alias Url =
    { de : String
    , en : String
    }

type alias Image =
    { src : String
    , alt : String
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
    , events : Maybe (Events)
    , about : String
    , contact : String
    , logo : String
    , now : String 
    , images: List Image
    }


type alias Model =
    { content : Content
    , language : String
    , slider : Maybe ImageSlider.State  
    }


type Msg
    = ToggleLanguage
    | NewContent Content
    | OpenSlider
    | CloseSlider
    | SliderMsg ImageSlider.Msg


type alias MarkdownOptions =
    { githubFlavored : Maybe { tables : Bool, breaks : Bool }
    , defaultHighlighting : Maybe String
    , sanitize : Bool
    , smartypants : Bool
    }
