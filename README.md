# A Simple Deque Visualization
This visualization supports basic operations of a deque (double-ended queue), including push/pop front/back. 

# Motivation
The deque presented here is inspired by the C++ STL. However, the code simulates allocating pointers (fixed-size arrays) 
dynamically by preallocate a constant number of arrays to achieve the desired animation result and ease of control over 
arrays elements and index.

To reiterate, this is not an appropriate way to implement an actual deque. A circular buffer 
would probably fit wtih Javascript better, but not as cool in my opinion.

# Resources
It is created based on [Prof. David Galles'](https://www.cs.usfca.edu/~galles/) source code and animation library. 

He has made many more cool visualizations for numerous alogrithms and data structures:\
https://www.cs.usfca.edu/~galles/visualization/Algorithms.html \
Source code page:\
https://www.cs.usfca.edu/~galles/visualization/source.html

Other readings:\
[wikipedia-deque](https://en.wikipedia.org/wiki/Double-ended_queue)\
[cppreference-deque](https://en.cppreference.com/w/cpp/container/deque)\
[An-In-Depth-Study-of-the-STL-Deque-Container](https://www.codeproject.com/Articles/5425/An-In-Depth-Study-of-the-STL-Deque-Container)\
[what-really-is-a-deque-in-stl](https://stackoverflow.com/questions/6292332/what-really-is-a-deque-in-stl)
