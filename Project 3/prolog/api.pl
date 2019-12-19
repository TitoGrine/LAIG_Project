
:- ensure_loaded('board_generation.pl').
:- ensure_loaded('points_calculation.pl').
:- ensure_loaded('move.pl').


%! initialize_board(+Rows, +Columns, -InitializedBoard)
% With the help of @see initialize_empty_board, initializes an empty board with the desired dimensions.
% Then it @see generate_pieces (generates the random order of the pieces) and
% @see generate_board (places the generated pieces in the board), this function initializes
% a previously EmptyBoard and returns it via the InitializedBoard argument
initialize_board(Rows, Columns, FinalBoard):-
	initialize_empty_board(Rows, Columns, EmptyBoard),
	NPieces is (Rows + Columns) * 2,
    generate_pieces([], Pieces, NPieces),
				write(Pieces), nl,

	generate_board(EmptyBoard, FinalBoard, Pieces).

%! pontuation(+Board, +Player, -Points)
% Calculate the number of points of the given Player.
% Is true when given points are the maximum calculatable in the Board.
% Uses @see value to calculate the biggest isle of a certain disc color
% @param Board must be a list of lists
% Player: 0 or 1
pontuation(Board, Player, Points) :-
	select_piece(Player, Disc),
	value(Board, Disc, Points).

%! hasMoves(+Board, +Player, -Ret)
% Determines if the Player has any moves left
% Player: 0 or 1
% Return true by the Ret parameter if there is any Moves left, false otherwise
hasMoves(Board, Player, Ret) :-
	(valid_moves(Board, Player, []),
	Ret = false) ;
	Ret = true.

%! getPlayerMoves(+Board, +Player, -Moves)
% Gets all the valid player moves 
% Uses @see valid_moves
% Player: 0 or 1
getPlayerMoves(Board, Player, Moves) :-
	valid_moves(Board, Player, Moves).

%! playerMove(+Board, +Player, +Move, -NewBoard)
% Gets Board after player move
% Uses @see move
% Move format: [IC, IR, FC, FR]
% Player: 0 or 1
playerMove(Board, Player, Move, NewBoard) :-
	move(Board, Move, NewBoard, Player).

%! botMove(+Board, +Player, +Difficulty, -NewBoard)
% Gets Board after bot move
% Uses @see choose_move (to choose move automatically) and @see move
% Player: 0 or 1
% Difficulty: 0 .. 4
botMove(Board, Player, Difficulty, NewBoard) :-
	choose_move(Board, [Player, bot], NewMove, Difficulty - _),
	move(Board, NewMove, NewBoard, Player).

