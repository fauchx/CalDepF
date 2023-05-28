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
constraint forall(j in equipos)
  (let {
    array[fechas] of var 0..2*(n-1): inicio = [i * bool2int(Cal[i, j] < 0 /\ (i == 1 \/ Cal[i-1, j] > 0)) | i in fechas];
    } in
      forall(i in fechas where inicio[i]>0)
        ( let { var int: size = fin(inicio[i], j, 1) - inicio[i] + 1 } in size >= Min /\ size <= Max)
  );

constraint forall(j in equipos)
  (let {
    array[fechas] of var 0..2*(n-1): inicio = [i * bool2int(Cal[i, j] > 0 /\ (i == 1 \/ Cal[i-1, j] < 0)) | i in fechas];
    } in
      forall(i in fechas where inicio[i]>0)
        ( let { var int: size = fin(inicio[i], j, -1) - inicio[i] + 1 } in size >= Min /\ size <= Max)
  );

% Restricción 5
constraint forall(j in equipos) (
  alldifferent([ Cal[i,j] | i in fechas])
);

% Restricción 6
constraint forall(i in fechas, j in equipos) (
  Cal[i, j] != j /\ Cal[i, j] != -j
);

% - - - - - - - - - - - - - - - - - - - - - - - - -

function var int: fin(var int: i, int: j, int: up) = 
  if i > 0 /\ i < 2*(n-1) /\ if up > 0 then Cal[i + 1, j] < 0 else Cal[i + 1, j] > 0 endif then
    fin(i + 1, j, up)
  else i endif;

% Función para calcular el costo de la gira de un equipo
function var int: calc_costo_gira(int: j) =
  let {
    array[fechas] of var 0..2*(n-1): inicio = [i * bool2int(Cal[i, j] < 0 /\ (i == 1 \/ Cal[i-1, j] > 0)) | i in fechas];
  } in
    sum(i in fechas where inicio[i]>0) (
      D[j, abs(Cal[inicio[i], j])] +
      sum(k in inicio[i]..fin(inicio[i], j, 1) - 1 where k > 0 /\ k < 2*(n-1)) (
         D[abs(Cal[k, j]), abs(Cal[k+1, j])]
      ) + D[abs(Cal[fin(inicio[i], j, 1), j]), j]
    );

var int: costo_giras = sum(j in equipos)(calc_costo_gira(j));

solve 
%      :: int_search(Cal, input_order, indomain_min)
      :: int_search(Cal, input_order, indomain_random)
%      :: int_search(Cal, first_fail, indomain_max)
%      :: int_search(Cal, anti_first_fail, indomain_split)
      minimize costo_giras;
%satisfy;

output [show(Cal[i,j]) ++ if j == n then "\n" else " " endif | i in 1..2*(n-1), j in equipos] ++ [show(costo_giras)];
