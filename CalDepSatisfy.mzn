include "globals.mzn";

% Parámetros
int: n;
array[1..n, 1..n] of int: D;
int: Min;
int: Max;

set of int: fechas = 1..2*(n-1);
set of int: equipos = 1..n;

% Variables
array[fechas, equipos] of var -n..n diff {0}: Cal;

% Restricción 1
constraint forall(i in fechas, j in equipos) (
  (Cal[i, j] > 0) -> (Cal[i, Cal[i, j]] = -j) /\ 
  (Cal[i, j] < 0) -> (Cal[i, abs(Cal[i, j])] = j)
);

% Restricción 3
constraint forall(i in 1..(2*(n-1)-1), j in equipos) (
  Cal[i, j] != -Cal[i+1, j]
);

% Restricción 4
% constraint forall(i in 1..n) (
%   let {
%     array[int] of var opt int: local = [ k | k in 1..2*(n-1) where Cal[k, i] > 0 ],
%     array[int] of var opt int: local_inicio = [ k | k in index_set(local) where k == 1 \/ local[k] - local[k - 1] > 1 ],
%     array[int] of var opt int: local_fin = [ k | k in index_set(local) where k == length(local) \/ local[k + 1] - local[k] > 1 ]
%   } in (
%     forall(k in index_set(local_inicio)) (
%       (local_fin[k] - local_inicio[k] + 1) >= 1 /\ (local_fin[k] - local_inicio[k] + 1) <= 6
%     )
%   )
% );

% Restricción 5
constraint forall(j in equipos) (
  alldifferent([ Cal[i,j] | i in fechas])
);

% Restricción 6
constraint forall(i in fechas) (
  alldifferent([ abs(Cal[i,j]) | j in equipos])
);

% Restricción 7
constraint forall(i in fechas, j in equipos) (
  Cal[i, j] != j /\ Cal[i, j] != -j
);

% Restricción 8
constraint Cal[1,1] >= reverse([Cal[i,1] | i in fechas])[1];

% - - - - - - - - - - - - - - - - - - - - - - - - -

function var int: fin(var int: i, int: j) = 
  if i > 0 /\ i < 2*(n-1) then
    if Cal[i + 1, j] < 0 then
      fin(i + 1, j)
    else i endif
  else i endif;

% Función para calcular el costo de la gira de un equipo
function var int: calc_costo_gira(int: j) =
  let {
    array[fechas] of var 0..2*(n-1): inicio = [i * bool2int(Cal[i, j] < 0 /\ (i == 1 \/ Cal[i-1, j] > 0)) | i in fechas];
  } in
    sum(i in fechas where inicio[i]>0) (
      D[j, abs(Cal[inicio[i], j])] +
      sum(k in inicio[i]..fin(inicio[i], j) - 1 where k > 0 /\ k < 2*(n-1)) (
         D[abs(Cal[k, j]), abs(Cal[k+1, j])]
      ) + D[abs(Cal[fin(inicio[i], j), j]), j]
    );

var int: costo_giras = sum(j in equipos)(calc_costo_gira(j));

solve 
%      :: int_search(Cal, input_order, indomain_max)
%      :: int_search(Cal, input_order, indomain_random)
%      :: int_search(Cal, first_fail, indomain_max)
%      :: int_search(Cal, anti_first_fail, indomain_split)
%      minimize costo_giras;
satisfy;

output [show(Cal[i,j]) ++ if j == n then "\n" else " " endif | i in 1..2*(n-1), j in equipos] ++ [show(costo_giras)];
