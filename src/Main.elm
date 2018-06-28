-- Read more about this program in the official Elm guide:
-- https://guide.elm-lang.org/architecture/effects/http.html


port module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Markdown
import Array
import ImageSlider
import Types exposing (..)
import U exposing (u)
import Icons
import Calendar exposing(calendar, Events)


--import Date exposing (now)

import Time.Date exposing (Date, date)


-- import Json.Decode as Decode


main =
    Html.program
        { init = ( initModel, Cmd.none )
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


initContent =
    { news = "# LOADING"
    , events = Maybe.Nothing
    , about = ""
    , contact = ""
    , logo = ""
    , now = ""
    }


initModel =
    { content = initContent
    , language = "de"
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ToggleLanguage ->
            ( toggleLanguage model, Cmd.none )

        NewContent content ->
            ( { model | content = content }, Cmd.none )


toggleLanguage : Model -> Model
toggleLanguage model =
    case model.language of
        "en" ->
            { model | language = "de" }

        _ ->
            { model | language = "en" }


defaultOptions : MarkdownOptions
defaultOptions =
    { githubFlavored = Just { tables = False, breaks = False }
    , defaultHighlighting = Nothing
    , sanitize = False
    , smartypants = False
    }


options : MarkdownOptions
options =
    { defaultOptions | githubFlavored = Just { tables = True, breaks = False } }


toMarkdown : String -> Html msg
toMarkdown userInput =
    Markdown.toHtmlWith options [] userInput


port content : (Content -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    content NewContent




concerts : String -> Maybe (Events) -> Html Msg
concerts now events =
    case events of
        Just ev ->
            calendar now "" ev

        Nothing ->
            div []
                [ h1 [ id "concerts" ] [ text "concerts" ]
                , p [] [ text "no concerts available" ]
                ]


socialMedia : Html Msg
socialMedia =
    blockquote [ class "socialMedia" ]
        [ a [ href "https://www.facebook.com/GiveMeAReasonOfficial" ] [ Icons.facebook ]
        , a [ href "https://www.youtube.com/channel/UCCMwf_diPCwrFHMdAhFVBWg" ] [ Icons.youtube ]
        , a [ href "https://www.instagram.com/givemeareason_official/" ] [ Icons.instagram ]
        ]


view : Model -> Html Msg
view model =
    span []
        [ header []
            [ a [ href "#top" ]
                [ h1 [] [ text "GIVE ME A REASON" ]
                , img [ class <| U.u { filter = "invert", height = "1", align = "inline" }, src model.content.logo ] []
                ]
            , nav []
                [ a [ href "#concerts" ] [ text "concerts" ]
                , a [ href "#about" ] [ text "about" ]
                , a [ href "#contact-booking" ] [ text "contact / booking" ]
                ]
            ]
        , img [ id "background", src model.content.logo ] []
        , main_ [ id "top" ]
            [ Markdown.toHtml [] model.content.news
            , socialMedia
            , concerts model.content.now model.content.events
            , toMarkdown model.content.about
            , Markdown.toHtml [] model.content.contact
            ]
        ]
