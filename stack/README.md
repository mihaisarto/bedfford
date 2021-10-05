## 
## The problem
### Python Stack Trace Interpretation
See the "Python Stack Traces" attachment which lists several python stack traces. Your task is
to examine the stack traces and provide a brief response for each one that summarizes what
the problem or likely problem is, and the first line of code you would jump to in your code editor
given the trace.

### In general
In general I read the stack trace bottom to top, with most interest on the last lines of the stack.
I jump on the 1st line on a file that belongs to my project/code - while reading bottom to top.
Sometimes, gut feeling plays some role too :)

### In particular:
```
Traceback Problem 1
===================
Traceback (most recent call last):
  File "stack_traces.py", line 36, in run_trace
    f()
  File "stack_traces.py", line 45, in <lambda>
    run_trace(1, lambda: perform_calculation(add, '1', 3))
  File "stack_traces.py", line 8, in perform_calculation
    calc(x, y)
  File "stack_traces.py", line 12, in add
    return x + y
TypeError: can only concatenate str (not "int") to str
```
 - tries to add an int (y) to a string (x),
from `perform_calculation(add, '1', 3)` might be a '1'+3
 - Common mistake when mixing python with java/scala/javascript on the same day.
 - I will fix with whatever I was thinking `1+3=4` or `'1'+'3'='13'`. Thinking like in modern languages 1st parameter is the expected type... 

```
Traceback Problem 2
===================
Traceback (most recent call last):
  File "stack_traces.py", line 36, in run_trace
    f()
  File "stack_traces.py", line 46, in <lambda>
    run_trace(2, lambda: perform_calculation(add, 7, '3'))
  File "stack_traces.py", line 8, in perform_calculation
    calc(x, y)
  File "stack_traces.py", line 12, in add
    return x + y
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```
 - tries to add a str (y) to an int (x),
from perform_calculation(add, 7, '3')) might be a '7'+3
 - same as above

```
Traceback Problem 3
===================
Traceback (most recent call last):
  File "stack_traces.py", line 36, in run_trace
    f()
  File "stack_traces.py", line 47, in <lambda>
    run_trace(3, lambda: perform_calculation(mult, '3', '3'))
  File "stack_traces.py", line 8, in perform_calculation
    calc(x, y)
  File "stack_traces.py", line 15, in mult
    return x * y
TypeError: can't multiply sequence by non-int of type 'str'
```
 - tries to multiply a str (x) with something (y),
from perform_calculation(mult, '3', '3')) might be a '3'*'3'

```
Traceback Problem 4
===================
Traceback (most recent call last):
  File "stack_traces.py", line 36, in run_trace
    f()
  File "stack_traces.py", line 48, in <lambda>
    run_trace(4, lambda: perform_calculation(mult, [4], [3]))
  File "stack_traces.py", line 8, in perform_calculation
    calc(x, y)
  File "stack_traces.py", line 15, in mult
    return x * y
TypeError: can't multiply sequence by non-int of type 'list'
```
- same as above with list

```
Traceback Problem 5
===================
Traceback (most recent call last):
  File "stack_traces.py", line 36, in run_trace
    f()
  File "stack_traces.py", line 49, in <lambda>
    run_trace(5, lambda: perform_calculation(innoc, '1', 3))
  File "stack_traces.py", line 8, in perform_calculation
    calc(x, y)
  File "stack_traces.py", line 22, in innoc
    spelunk()
  File "stack_traces.py", line 21, in spelunk
    raise ValueError('Invalid')
ValueError: Invalid
```
- looks like on purpose throw/raise of an exception (try block). 
More: the throw is at line 21 but the method call is after, on line 22, so might be a lambda
I would go on stack_traces.py, line 21. 

```
Traceback Problem 6
===================
Traceback (most recent call last):
  File "stack_traces.py", line 36, in run_trace
    f()
  File "stack_traces.py", line 50, in <lambda>
    run_trace(6, lambda: comp_calc([1, 2, 3], 1, add))
  File "stack_traces.py", line 30, in comp_calc
    return [perform_calculation(calc, x_i, y_i) for x_i, y_i in zip(x, y)]
TypeError: zip argument #2 must support iteration
```
- y argument is not iterable so it can not be zip, I would guess that is 1 (parameter).
[1] instead should do fine. If I would wrote the code I would go to line 50 if not I would check first on line 30

```
Traceback Problem 7
===================
Traceback (most recent call last):
  File "stack_traces.py", line 36, in run_trace
    f()
  File "stack_traces.py", line 51, in <lambda>
    run_trace(7, lambda: comp_calc([1, 2, [3]], [4, 5, 6], add))
  File "stack_traces.py", line 30, in comp_calc
    return [perform_calculation(calc, x_i, y_i) for x_i, y_i in zip(x, y)]
  File "stack_traces.py", line 30, in <listcomp>
    return [perform_calculation(calc, x_i, y_i) for x_i, y_i in zip(x, y)]
  File "stack_traces.py", line 8, in perform_calculation
    calc(x, y)
  File "stack_traces.py", line 12, in add
    return x + y
TypeError: can only concatenate list (not "int") to list
```
- looks like zipping [3] and 6. So like above, I would go to 51 if my code, or else bottom up

```
Traceback Problem 8
===================
Traceback (most recent call last):
  File "stack_traces.py", line 36, in run_trace
    f()
  File "stack_traces.py", line 52, in <lambda>
    run_trace(8, lambda: calc_dict({'one': 1, 'two': '2'}, 'one', 'two', add))
  File "stack_traces.py", line 26, in calc_dict
    return perform_calculation(calc, d[k1], d[k2])
  File "stack_traces.py", line 8, in perform_calculation
    calc(x, y)
  File "stack_traces.py", line 12, in add
    return x + y
TypeError: unsupported operand type(s) for +: 'int' and 'str'
```
- looks like a `1 + '2'` from the dictionary. 
I'll change line 52 if my code with whatever I was thinking here (maybe `'two': 2`), or else bottom up to doublecheck.

```
Traceback Problem 9
===================
Traceback (most recent call last):
  File "stack_traces.py", line 36, in run_trace
    f()
  File "stack_traces.py", line 53, in <lambda>
    run_trace(9, lambda: calc_dict({}, 'one', 'two', add))
  File "stack_traces.py", line 26, in calc_dict
    return perform_calculation(calc, d[k1], d[k2])
KeyError: 'one'
```
- It looks for key 'one' in the dictionary and it is not there.
I guess d is `{}` and k1 or k2 is `'one'`. I'll try to figure out what was the intention here