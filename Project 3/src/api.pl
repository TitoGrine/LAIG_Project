
:- ensure_loaded('board_generation.pl').
:- ensure_loaded('points_calculation.pl').


%! initialize_board(+Rows, +Columns, -InitializedBoard)
% With the help of @see initialize_empty_board, initializes an empty board with the desired dimensions.
% Then it @see generate_pieces (generates the random order of the pieces) and
% @see generate_board (places the generated pieces in the board), this function initializes
% a previously EmptyBoard and returns it via the InitializedBoard argument
initialize_board(Rows, Columns, FinalBoard):-
	initialize_empty_board(Rows, Columns, EmptyBoard),
	NPieces is (Rows + Columns - 4) * 2,
    generate_pieces([], Pieces, NPieces),
	generate_board(EmptyBoard, FinalBoard, Pieces).

%! pontuation(+Board, +Player, -Points)
% Calculate the number of points of the given Player.
% Is true when given points are the maximum calculatable in the Board.
% Uses @see value to calculate the biggest isle of a certain disc color
% @param Board must be a list of lists
pontuation(Board, Player, Points) :-
	select_piece(Player, Disc),
	value(Visited, Disc, MaxPoints).

%! hasMoves(+Board, +Player, -Ret)
% Determines if the Player has any moves left
% Return true by the Ret parameter if there is any Moves left, false otherwise
hasMoves(Board, Player, Ret) :-
	(valid_moves(Board, Player, []),
	Ret = false) ;
	Ret = true.



