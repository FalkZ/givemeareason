module Gallery exposing (..)

import Array exposing (Array)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import ImageSlider
import Json.Decode as Json


main : Program Never Model Msg
main =
    program
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


type alias Image =
    { src : String
    , alt : String
    }


type alias Model =
    { images : List Image
    , slider : Maybe ImageSlider.State
    }


type Msg
    = OpenSlider
    | CloseSlider
    | SliderMsg ImageSlider.Msg


init : ( Model, Cmd Msg )
init =
    ( { images = exampleImages, slider = Nothing }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
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


view : Model -> Html Msg
view model =
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
                    [ img [ onClick <| OpenSlider, class "title-picture", src <| firstImage model.images ] []
                    ]
                ]
            , case model.slider of
                Just focusedSlide ->
                    div [ onEscape CloseSlider ]
                        [ ImageSlider.view sliderConf (Array.fromList model.images) focusedSlide |> Html.map SliderMsg
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
    [ { alt = "Alternativ Text"
      , src = "http://givemeareason-official.netlify.com/static/18672986_302050763573256_2992321066351487101_o-91e86ce4f17390cee9ae9f551174d6f0-d14e0.jpg"
      }
    , { alt = "alt 2"
      , src = "http://givemeareason-official.netlify.com/static/28378028_416887728756225_3617264513967785531_n-6cce4676f6bb54a95e5bb4c1723ddace-02605.jpg"
      }
    ]
