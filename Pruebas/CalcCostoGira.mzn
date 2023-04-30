int: n = 4;
int: j = 4;
array[1..n, 1..n] of int: D = [|
0,745,665,929|
745,0,80,337|
665,80,0,380|
929,337,380,0|];
array[int] of var int: Cal = [-2,-3,-1,2,3,1];

array[int] of var int: inicio = [i * bool2int(Cal[i] < 0 /\ (i == 1 \/ Cal[i-1] >= 0)) | i in 1..2*(n-1)];
array[int] of var int: fin2 = [fin(inicio[i]) | i in 1..2*(n-1)];

function var int: fin(var int: inicio) = 
  if inicio > 0 /\ inicio < 2*(n-1) then
    let {
      var int: j = inicio + 1
    } in 
    if Cal[j] < 0 then
      fin(j)
    else
      inicio
    endif
  else
    inicio
  endif;

var int: costo_gira = 
  sum(i in 1..2*(n-1) where inicio[i]>0) (
      D[j, abs(Cal[inicio[i]])] +
      sum(k in inicio[i]..fin(inicio[i]) - 1) (
         D[abs(Cal[k]), abs(Cal[k+1])]
      ) + D[abs(Cal[fin(inicio[i])]), j]
    );

output [show(inicio) ++ "\n" ++ show(fin2) ++ "\n" ++  show(costo_gira)]