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
import Json.Decode as Json

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
    , images = exampleImages
    }



initModel =
    { content = initContent
    , language = "de"
    , slider = Maybe.Nothing
   
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ToggleLanguage ->
            ( toggleLanguage model, Cmd.none )

        NewContent content ->
            ( { model | content = content }, Cmd.none )

        OpenSlider ->
            let
                ( sliderModel, cmd ) =
                    ImageSlider.init 0
            in
                ( { model | slider = Just sliderModel }, Cmd.map SliderMsg cmd )

        SliderMsg sliderMsg ->
            case model.slider of
                Just focusedSlide ->
                    ( { model | slider = Just (ImageSlider.update sliderMsg focusedSlide) }, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        CloseSlider ->
            ( { model | slider = Nothing }, Cmd.none )


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
    

gallery model =
    let
        sliderConf =
            { originalUrl = .src
            , thumbnailUrl = .src
            , alt = .alt
            , caption =
                \i ->
                    span
                        [ class "image-slider-image-caption" ]
                        [ text i.alt ]
            }
    in
        div []
            [ div [ class "image-gallery" ]
                [ div [ class "title-picture-wrapper" ]
                    [ img [ onClick <| OpenSlider, class "title-picture", src <| firstImage model.content.images ] []
                    ]
                ]
            , case model.slider of
                Just focusedSlide ->
                    div [ onEscape CloseSlider ]
                        [ ImageSlider.view sliderConf (Array.fromList model.content.images) focusedSlide |> Html.map SliderMsg
                        , i [ class "image-slider-button image-slider-quit-button fa fa-remove", onClick CloseSlider ] []
                        ]

                Nothing ->
                    text ""
            ]


onEscape : msg -> Attribute msg
onEscape msg =
    let
        handle keyCode =
            if keyCode == 27 then
                Json.succeed msg
            else
                Json.fail <| "Unexpected keyCode " ++ toString keyCode
    in
        on "keydown" <| Json.andThen handle keyCode


firstImage images =
    images
        |> List.head
        |> Maybe.withDefault (Image "" "")
        |> .src


exampleImages : List Image
exampleImages =
    [ { alt = ""
      , src = "http://givemeareason-official.com/static/media/title.850341b1.jpg"
      }
    , { alt = "alt 2"
      , src = "http://givemeareason-official.netlify.com/static/28378028_416887728756225_3617264513967785531_n-6cce4676f6bb54a95e5bb4c1723ddace-02605.jpg"
      }
    ]




concerts : String -> Maybe (Events) -> Html Msg
concerts now events =
    case events of
        Just ev ->
            div []
                [ h1 [ id "concerts" ] [ text "concerts" ]
                ,calendar now "" ev
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
        , img [ id "background", src model.content.logo ] []
        , main_ [ id "top" ]
            [ gallery model
            , blockquote [] [ h2[][ text "Melodic Punk Rock"]]
            , socialMedia
            , Markdown.toHtml [] model.content.news          
            , concerts model.content.now model.content.events
            , toMarkdown model.content.about
            , Markdown.toHtml [] model.content.contact
            ]
        ]
