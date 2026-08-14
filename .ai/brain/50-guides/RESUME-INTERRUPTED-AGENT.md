# Guide — resume interrupted agent

If an agent disappears because of quota/session limit:

1. do not trust its Todo list;
2. inspect `git status --short`;
3. inspect active claim;
4. inspect task evidence;
5. run focal tests if safe;
6. classify:
   - complete + evidenced;
   - partial;
   - abandoned;
   - conflicting.

A partial file is not automatically reassigned.
The next writer explicitly takes over the claim after reading the diff.
