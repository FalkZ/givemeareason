module Icons
    exposing
        ( arrowUpRight
        , facebook
        , instagram
        , link
        , mail
        , mapPin
        , youtube
        )

import Html exposing (Html)
import Svg exposing (Svg, svg)
import Svg.Attributes exposing (..)


svgFeatherIcon : String -> List (Svg msg) -> Html msg
svgFeatherIcon className =
    svg
        [ class <| "feather feather-" ++ className
        , fill "none"
        , height "24"
        , stroke "currentColor"
        , strokeLinecap "round"
        , strokeLinejoin "round"
        , strokeWidth "2"
        , viewBox "0 0 24 24"
        , width "24"
        ]


arrowUpRight : Html msg
arrowUpRight =
    svgFeatherIcon "arrow-up-right"
        [ Svg.line [ x1 "7", y1 "17", x2 "17", y2 "7" ] []
        , Svg.polyline [ points "7 7 17 7 17 17" ] []
        ]


facebook : Html msg
facebook =
    svgFeatherIcon "facebook"
        [ Svg.path [ d "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" ] []
        ]


instagram : Html msg
instagram =
    svgFeatherIcon "instagram"
        [ Svg.rect [ Svg.Attributes.x "2", y "2", width "20", height "20", rx "5", ry "5" ] []
        , Svg.path [ d "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" ] []
        , Svg.line [ x1 "17.5", y1 "6.5", x2 "17.5", y2 "6.5" ] []
        ]


link : Html msg
link =
    svgFeatherIcon "link"
        [ Svg.path [ d "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" ] []
        , Svg.path [ d "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" ] []
        ]


mail : Html msg
mail =
    svgFeatherIcon "mail"
        [ Svg.path [ d "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" ] []
        , Svg.polyline [ points "22,6 12,13 2,6" ] []
        ]


mapPin : Html msg
mapPin =
    svgFeatherIcon "map-pin"
        [ Svg.path [ d "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" ] []
        , Svg.circle [ cx "12", cy "10", r "3" ] []
        ]


youtube : Html msg
youtube =
    svgFeatherIcon "youtube"
        [ Svg.path [ d "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" ] []
        , Svg.polygon [ points "9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" ] []
        ]
