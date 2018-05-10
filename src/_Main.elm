port module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import String

---- FUNCTIONS ----

replace toReplace replacement string =
    string
    |> String.split toReplace
    |> String.join replacement

remove toRemove string =
    replace toRemove "" string


u utilityClasses =
    utilityClasses
    |> toString
    |> replace " = \""  "U"
    |> replace " = "  "U"
    |> remove "$"
    |> remove ","
    |> remove "{"
    |> remove "}"
    |> remove "\""
    |> String.trim
    |> Debug.log "string"



main =
  Html.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


-- MODEL

type alias Model =
  { word : String
  , suggestions : Content
  }

init : (Model, Cmd Msg)
init =
  (Model ""  { about = ""
  , contact = ""
  , news = ""
  }, Cmd.none)


-- UPDATE

type Msg
  = Change String
  | Check
  | Suggest (Content)


port check : String -> Cmd msg

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    Change newWord ->
      ( Model newWord { about = ""
  , contact = ""
  , news = ""
  }, Cmd.none )

    Check ->
      ( model, check model.word )

    Suggest newSuggestions ->
      ( Model model.word newSuggestions, Cmd.none )


-- SUBSCRIPTIONS

type alias Content =
  { about : String
  , contact : String
  , news : String
  }


port suggestions : (Content -> msg) -> Sub msg

subscriptions : Model -> Sub Msg
subscriptions model =
  suggestions Suggest


-- VIEW

view : Model -> Html Msg
view model =
  div []
    [ input [ onInput Change ] []
    , button [ onClick Check ] [ text "Check" ]
    , div [] [ text (toString model.suggestions) ]
    ]