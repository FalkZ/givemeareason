module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Debug 


import Html.Events exposing (..)
import Http
import Json.Decode as Decode


-- GET A STRING

getWarAndPeace : Http.Request String
getWarAndPeace =
  Http.getString "https://example.com/books/war-and-peace"



getLast string = string
        |> String.split " "
        |> List.drop 1 
        |> List.head
        |> Maybe.withDefault "}"

filterSideEffects string = string
    |> List.filter ((/=) "}")

keys record =
   record
   |> toString 
   |> String.split " = \""
   |> List.map getLast
   |> filterSideEffects
   |> Debug.log "keys"


value key record = 
    toString key ++ toString record

add f record = 
    f record

u utilityRecord =
    keys utilityRecord
    |> toString

---- MODEL ----


type alias Model =
    {about: String
    ,topic: String
    }


init : ( Model, Cmd Msg )
init =
    ( {about = "", topic = "dogs"}, getRandomGif "dogs" )



decodeGifUrl : Decode.Decoder String
decodeGifUrl =
  Decode.at ["data", "image_url"] Decode.string

getRandomGif : String -> Cmd Msg
getRandomGif topic =
  let
    url =
      "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=" ++ topic
  in
    Http.send NewGif (Http.get url decodeGifUrl)

---- UPDATE ----


type Msg
  = NewGif (Result Http.Error String)



update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of

    NewGif (Ok newUrl) ->
      (Model model.topic newUrl, Cmd.none)

    NewGif (Err _) ->
      (model, Cmd.none)


---- VIEW ----


view : Model -> Html Msg
view model =
    div []
        [ header [] 
            [ span [class "title"][text "GIVE ME A REASON"]
            , a [ href "#concerts"] [ text "concerts" ]
            , a [ href "#about" ] [ text "about" ]
            , a [ href "#contact/booking" ] [ text "contact/booking" ]
            ]
          
        , header [] [
         img [ src "/logo.svg" ] [ ]
        , h1 [] [ text "concerts" ]
        , h1 [] [ text "about" ]
        , h1 [] [ text "contact/booking" ]
        , p [] [ text model.about ]
        ]
        ]





---- PROGRAM ----


main : Program Never Model Msg
main =
    Html.program
        { view = view
        , init = init
        , update = update
        , subscriptions = always Sub.none
        }
