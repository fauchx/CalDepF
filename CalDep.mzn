include "globals.mzn";

% Declaración de parámetros
int: n;
array[1..n, 1..n] of int: D;
int: Min;
int: Max;

set of int: fechas = 1..2*(n-1);

% Declaración de variables
array[fechas, 1..n] of var -n..n: Cal;

% Restricción 1
constraint forall(i in 1..2*(n-1), j in 1..n) (
  (Cal[i, j] > 0) -> (Cal[i, Cal[i, j]] = -j) /\ 
  (Cal[i, j] < 0) -> (Cal[i, abs(Cal[i, j])] = j)
);

% La restricción 2 se parte en estás dos restricciones:

% Los elementos dentro de cada columna deben ser diferentes
% -> un equipo debe enfrentarse a los otros
constraint forall(j in 1..n) (
  alldifferent([ Cal[i,j] | i in 1..2*(n-1)])
);
% Dentro de la columna j no puede estar el valor j ni -j
% -> un equipo no puede jugar contra el mismo
constraint forall(i in 1..2*(n-1), j in 1..n) (
  Cal[i, j] != j /\ Cal[i, j] != -j
);

% Restricción 3
constraint forall(i in 1..(2*(n-1)-1), j in 1..n) (
  Cal[i, j] != -Cal[i+1, j]
);

% Restricción 4
constraint forall(i in 1..n) (
  let {
    array[int] of var opt int: local = [ k | k in 1..2*(n-1) where Cal[k, i] > 0 ],
    array[int] of var opt int: local_inicio = [ k | k in index_set(local) where k == 1 \/ local[k] - local[k - 1] > 1 ],
    array[int] of var opt int: local_fin = [ k | k in index_set(local) where k == length(local) \/ local[k + 1] - local[k] > 1 ]
  } in (
    forall(k in index_set(local_inicio)) (
      (local_fin[k] - local_inicio[k] + 1) >= 1 /\ (local_fin[k] - local_inicio[k] + 1) <= 6
    )
  )
);

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

var int: costo_gira = sum(j in 1..n)(calc_costo_gira(j));

solve minimize costo_gira;

output [show(Cal[i,j]) ++ if j == n then "\n" else " " endif | i in 1..2*(n-1), j in 1..n] ++ [show(costo_gira)];
