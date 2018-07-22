module Calendar exposing (calendar, Events)

import Html exposing (Html, table, tbody, tr, td, a, p, node, text)
import Html.Attributes exposing (class, href, colspan)
import Set
import Array
import Date
import Icons exposing (link, mapPin)


type alias Event =
    { date : String
    , eventName : String
    , eventUrl : String
    , locationName : String
    , locationUrl : String
    }


type alias Events =
    List Event


linkOrParagraph name url icon =
    case String.trim url of
        "" ->
            p [] [ text name ]

        _ ->
            a [ href url ] [ text name, icon ]


texta a =
    text <| toString a


dateParagraph string =
    case Date.fromString string of
        Result.Ok date ->
            p [] [ text (toString (Date.day date) ++ ". " ++ toString (Date.month date)) ]

        Result.Err err ->
            p [] []


titleRow element title =
    tr [] [ td [ class "colspan3", colspan 3 ] [ node element [] [ text title ] ] ]


rows settings list =
    tr []
        (case List.length list of
            1 ->
                [ titleRow "h3" <| String.left 4 <| headOrEmpty <| list ]

            _ ->
                let
                    array =
                        getOrEmpty <| Array.fromList list
                in
                    [ td [] [ dateParagraph (array 0) ]
                    , td [] [ linkOrParagraph (array 1) (array 2) settings.icons.event ]
                    , td [] [ linkOrParagraph (array 3) (array 4) settings.icons.location ]
                    ]
        )


encode list obj =
    list
        |> List.map (\i -> i obj)


getOrEmpty array index =
    Maybe.withDefault "" <| Array.get index array


headOrEmpty list =
    Maybe.withDefault "" <| List.head list


createComparable =
    encode
        [ .date
        , .eventName
        , .eventUrl
        , .locationName
        , .locationUrl
        ]


defaultSettings =
    { icons =
        { event = link
        , location = mapPin
        }
    , text =
        { noUpcoming = titleRow "h3" "no upcoming events"
        }
    }


calendar now altText events =
    let
        headOrEmpty list =
            Maybe.withDefault "" <| List.head list

        yearString upcomming =
            if upcomming then
                "-00-00-Year"
            else
                "-Year"

        year upcomming event =
            [ (String.left 4 <| headOrEmpty event) ++ yearString upcomming ]

        upcomingAndPast =
            List.partition (\event -> event.date >= now) events

        upcoming =
            let
                temp =
                    Tuple.first <| upcomingAndPast
            in
                case List.isEmpty temp of
                    True ->
                        [ defaultSettings.text.noUpcoming ]

                    False ->
                        process temp True

        past =
            Tuple.second <| upcomingAndPast

        listPrepend fun list =
            list
                |> List.map (\item -> [ item, (fun item) ])
                |> List.concat

        reverseOld upcomming =
            if upcomming then
                \a -> a
            else
                List.reverse

        process data upcomming =
            data
                |> List.map createComparable
                |> listPrepend (year upcomming)
                |> Set.fromList
                |> Set.toList
                |> reverseOld upcomming
                |> List.map (rows defaultSettings)
    in
        table []
            [ tbody []
                (List.concat
                    [ [ titleRow "h2" "upcoming" ]
                    , upcoming
                    , [ titleRow "h2" "past" ]
                    , process past False
                    ]
                )
            ]
