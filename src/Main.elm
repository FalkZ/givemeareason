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


maybeLink { name, url } icon =
    case url of
        Just link ->
            a [ href link ] (List.concat [ [ text name ], icon ])

        Nothing ->
            text name


parseDate : String -> Date
parseDate d =
    case Time.Date.fromISO8601 d of
        Ok value ->
            value

        Err msg ->
            date 0 0 0


months : List String
months =
    [ "Jan", "Feb", "März", "Apr", "Mai", "Juni", "July", "Aug", "Sept", "Okt", "Nov", "Dez" ]


monthName : Int -> String
monthName index =
    Array.fromList months
        |> Array.get (index - 1)
        |> Maybe.withDefault ""


rowH2 title =
    tr [ class "colspan3" ] [ td [ class "colspan3", colspan 3 ] [ h2 [] [ text title ] ] ]


row a =
    let
        dat =
            parseDate a.date
    in
        tr []
            [ td [] [ text ((toString <| Time.Date.day dat) ++ ". " ++ (monthName <| Time.Date.month dat)) ]
            , td [] [ maybeLink a.event [ Icons.arrowUpRight ] ]
            , td [] [ maybeLink a.location [ Icons.mapPin ] ]
            ]


compareDate d =
    case Time.Date.compare (date 1993 2 28) (parseDate d.date) of
        GT ->
            False

        EQ ->
            True

        LT ->
            True


concerts : Maybe (List Event) -> Html Msg
concerts events =
    case events of
        Just ev ->
            div []
                [ h1 [ id "concerts" ] [ text "concerts" ]
                , table []
                    [ let
                        sortedEvents =
                            ev
                                |> List.sortBy .date
                                |> List.reverse
                                |> List.partition compareDate

                        upcoming =
                            List.map row (Tuple.first sortedEvents)

                        past =
                            List.map row (Tuple.second sortedEvents)
                      in
                        tbody [] (List.concat [ [ rowH2 "upcoming", text "2018" ], upcoming, [ rowH2 "past" ], past ])
                    ]
                ]

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
        , main_ [ id "top" ]
            [ Markdown.toHtml [] model.content.news
            , socialMedia
            , concerts model.content.events
            , toMarkdown model.content.about
            , Markdown.toHtml [] model.content.contact
            ]
        ]
