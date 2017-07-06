port module BrushSize exposing (..)

import Html exposing (program, div, button, text, span)
import Html.Events exposing (onClick)
import Html.Attributes exposing (style, class)


port brushChange : Int -> Cmd msg


main : Program Never Int Msg
main =
    program
        { init = ( 3, Cmd.none )
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


subscriptions : Int -> Sub Msg
subscriptions model =
    Sub.none


view : a -> Html.Html Msg
view model =
    div [ class "brushsize" ]
        [ span [] [ text "Brush size" ]
        , button [ onClick Decrement ] [ text "-" ]
        , span [] [ text (toString model) ]
        , button [ onClick Increment ] [ text "+" ]
        , span
            [ style
                [ ( "width", toString model ++ "px" )
                , ( "height", toString model ++ "px" )
                , ( "background-color", "black" )
                , ( "display", "inline-block" )
                , ( "border-radius", "50%" )
                ]
            ]
            [ text "" ]
        ]


type Msg
    = Increment
    | Decrement


update : Msg -> Int -> ( Int, Cmd msg )
update msg model =
    case msg of
        Increment ->
            ( model + 1, brushChange (model + 1) )

        Decrement ->
            ( model - 1, brushChange (model - 1) )
