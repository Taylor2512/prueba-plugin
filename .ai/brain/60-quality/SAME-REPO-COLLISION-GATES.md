# Same-repo collision gates

Fail if:
- two write claims overlap;
- two agents hold `integrator`;
- evidence was generated while a conflicting writer was modifying dependencies;
- a provider uses blanket restore/stash;
- a commit contains unexplained paths outside the completed claims;
- an agent marks another agent's dirty file as its own;
- claims are broad enough to serialize the entire project without justification.
