#!/usr/bin/env node
import path from "node:path";
import { parseArgs, hasFlag, readEnumArg, readStringArg, setExitCode } from "../lib/cli.js";
import { parseProgram } from "../lib/ast.js";
import { isSourceFile, readTextFile, walkFilesSync } from "../lib/files.js";
import { uniqueBy } from "../lib/collections.js";

const RANK = { low: 1, medium: 2, high: 3 };
const rawArgs = parseArgs(process.argv.slice(2));
const options = {
  root: readStringArg(rawArgs, "root", "src"),
  failOn: readEnumArg(rawArgs, "fail-on", ["low", "medium", "high", "none"], "high"),
  json: hasFlag(rawArgs, "json"),
  strictParse: hasFlag(rawArgs, "strict-parse"),
  includeTests: hasFlag(rawArgs, "include-tests"),
};
const findings = [];
const parseErrors = [];

/**
 * Símbolos verificados como frontera de composición intencionada.
 *
 * El marcador de fichero silencia el módulo entero, que es demasiado grueso:
 * un `wrapper-check: allow` en la cabecera de un módulo grande esconde también
 * los wrappers reales que aparezcan después. `wrapper-check: allow <símbolo>`
 * registra la verificación junto a la función concreta y deja el resto del
 * fichero bajo vigilancia.
 *
 * El propio informe pide «verify whether this is an intentional composition
 * boundary»; esto es dónde se anota esa verificación.
 */
const allowedSymbols = (source) =>
  new Set(
    [...source.matchAll(/wrapper-check:\s*(?:allow|ignore)\s+([A-Za-z_$][\w$]*)/gi)].map(
      (match) => match[1],
    ),
  );

for (const file of walkFilesSync(options.root).filter((item) =>
  isSourceFile(item, { includeTests: options.includeTests }),
)) {
  const source = readTextFile(file);
  if (/wrapper-check:\s*(allow|ignore)\s*$/im.test(source.slice(0, 1200))) continue;

  const program = parseProgram(file, source, { errors: parseErrors });
  if (!program) continue;

  const allowed = allowedSymbols(source);
  const fileFindings = [];
  const reexport = findReexport(file, program, source);
  if (reexport) fileFindings.push(reexport);
  fileFindings.push(...findReactWrappers(file, program));
  fileFindings.push(...findObjectReturnWrappers(file, program, source));
  findings.push(...fileFindings.filter((item) => !allowed.has(item.symbol)));
}

const results = uniqueBy(findings, (item) => `${item.file}:${item.category}:${item.symbol}:${item.target}`).sort(sortFindings);
print(results, parseErrors, options);

const threshold = options.failOn === "none" ? Infinity : RANK[options.failOn];
setExitCode(
  results.some((item) => RANK[item.severity] >= threshold) ||
    (options.strictParse && parseErrors.length > 0),
);

function findReexport(file, program, source) {
  const body = program.body.filter((node) => node.type !== "EmptyStatement");
  if (!body.length) return null;
  if (body.some((node) => node.type === "ImportDeclaration" && node.specifiers.length === 0)) return null;

  const imports = importedNames(body);
  const exports = body.filter((node) => node.type.startsWith("Export"));
  const other = body.filter((node) => node.type !== "ImportDeclaration" && !node.type.startsWith("Export"));
  if (!exports.length || other.length) return null;

  const sources = new Set();
  let count = 0;
  let passthrough = false;

  for (const node of exports) {
    if (node.type === "ExportAllDeclaration") {
      sources.add(node.source.value);
      count += 1;
      continue;
    }

    if (node.type === "ExportNamedDeclaration") {
      if (node.declaration) return null;
      if (node.source) {
        sources.add(node.source.value);
        count += Math.max(1, node.specifiers.length);
        continue;
      }
      for (const specifier of node.specifiers) {
        const local = identifier(specifier.local);
        if (!local || !imports.has(local)) return null;
        passthrough = true;
        sources.add(imports.get(local));
        count += 1;
      }
      continue;
    }

    if (node.type === "ExportDefaultDeclaration") {
      const local = identifier(node.declaration);
      if (!local || !imports.has(local)) return null;
      passthrough = true;
      sources.add(imports.get(local));
      count += 1;
      continue;
    }

    return null;
  }

  const isIndex = /^index\.[cm]?[jt]sx?$/.test(path.basename(file));
  const barrel = isIndex || count > 1 || sources.size > 1;
  return {
    file,
    line: exports[0]?.loc?.start?.line || 1,
    category: barrel ? "BARREL_MODULE" : passthrough ? "PASSTHROUGH_REEXPORT" : "DIRECT_REEXPORT",
    severity: barrel ? "low" : passthrough ? "high" : "medium",
    symbol: "<module>",
    target: [...sources].join(", "),
    reason: barrel
      ? "Only aggregates exports; confirm it is an intentional public boundary."
      : passthrough
        ? "Imports symbols only to export them again without behavior."
        : "Directly re-exports one dependency without behavior.",
    lines: source.split(/\r?\n/).length,
  };
}

function findReactWrappers(file, program) {
  const { imports, declarations, candidates } = getWrapperScanContext(program);
  const results = [];

  for (const candidate of candidates) {
    const resolved = unwrap(candidate.expression, declarations);
    if (!resolved) continue;

    const wrapper = analyzeFunction(resolved.fn, resolved.hocs);
    if (!wrapper || wrapper.target === candidate.name) continue;

    const importSource = importSourceForSymbol(imports, wrapper.target);
    const hasStaticProps = wrapper.staticProps.length > 0;
    const forwardRef = resolved.hocs.includes("forwardRef");
    const memo = resolved.hocs.includes("memo");

    let category = "PURE_PROPS_WRAPPER";
    let severity = importSource ? "high" : "medium";
    let reason = "Only renders another component and forwards the same props.";

    if (forwardRef) {
      category = "FORWARD_REF_WRAPPER";
      severity = "medium";
      reason = "Only forwards props and ref; verify that the component boundary is intentional.";
    } else if (hasStaticProps) {
      category = "CONFIGURED_WRAPPER";
      severity = "low";
      reason = "Only forwards props and adds static JSX attributes.";
    } else if (memo) {
      category = "MEMO_PROPS_WRAPPER";
      severity = "medium";
      reason = "Only forwards props and adds memoization.";
    }

    results.push({
      file,
      line: resolved.fn.loc?.start?.line || candidate.line,
      category,
      severity,
      symbol: candidate.name,
      target: wrapper.target,
      importSource,
      reason,
      details: {
        hocs: resolved.hocs,
        props: wrapper.props,
        ref: wrapper.ref || null,
        staticProps: wrapper.staticProps,
      },
    });
  }

  return results;
}


function findObjectReturnWrappers(file, program, source) {
  const { imports, declarations, candidates } = getWrapperScanContext(program);
  const results = [];

  for (const candidate of candidates) {
    const resolved = unwrap(candidate.expression, declarations);
    if (!resolved || resolved.hocs.length) continue;

    const wrapper = analyzeObjectReturnFunction(resolved.fn, source);
    if (!wrapper) continue;

    const importSources = new Set(
      wrapper.delegates
        .map((delegate) => importSourceForSymbol(imports, delegate))
        .filter(Boolean),
    );

    results.push({
      file,
      line: resolved.fn.loc?.start?.line || candidate.line,
      category: wrapper.category,
      severity: wrapper.severity,
      symbol: candidate.name,
      target: wrapper.delegates.length
        ? wrapper.delegates.join(", ")
        : wrapper.forwardedRoots.join(", ") || "<returned object>",
      importSource: [...importSources].join(", "),
      reason: wrapper.reason,
      details: {
        patternSignal: wrapper.patternSignal,
        delegates: wrapper.delegates,
        forwardedRoots: wrapper.forwardedRoots,
        returnedKeys: wrapper.returnedKeys,
        forwardedProperties: wrapper.forwardedProperties,
        staticProperties: wrapper.staticProperties,
        guardClauses: wrapper.guardClauses,
        statementCount: wrapper.statementCount,
        functionLines: wrapper.functionLines,
      },
    });
  }

  return results;
}

function getWrapperScanContext(program) {
  const imports = importedNames(program.body);
  const declarations = topLevelDeclarations(program.body);
  return {
    imports,
    declarations,
    candidates: exportedCandidates(program.body, declarations),
  };
}

function analyzeObjectReturnFunction(fn, source) {
  if (fn.body?.type !== "BlockStatement") return null;

  const statements = fn.body.body.filter(
    (node) => node.type !== "EmptyStatement" && !node.directive,
  );
  if (!statements.length || statements.length > 7) return null;

  const finalStatement = statements.at(-1);
  if (
    finalStatement?.type !== "ReturnStatement" ||
    finalStatement.argument?.type !== "ObjectExpression"
  ) {
    return null;
  }

  const functionLines =
    (fn.loc?.end?.line || 0) - (fn.loc?.start?.line || 0) + 1;
  if (functionLines > 45) return null;

  const parameterNames = new Set();
  for (const parameter of fn.params || []) {
    collectBindingNames(parameter, parameterNames);
  }

  const knownRoots = new Set(parameterNames);
  const delegateLocals = new Set();
  const delegates = new Set();
  let guardClauses = 0;

  for (const statement of statements.slice(0, -1)) {
    if (statement.type === "VariableDeclaration") {
      for (const declaration of statement.declarations || []) {
        const names = new Set();
        collectBindingNames(declaration.id, names);
        if (!names.size || !declaration.init) return null;

        const init = unwrapAwait(declaration.init);
        if (init?.type === "CallExpression" || init?.type === "OptionalCallExpression") {
          const delegate = expressionName(init.callee);
          if (!delegate) return null;
          delegates.add(delegate);
          for (const name of names) {
            knownRoots.add(name);
            delegateLocals.add(name);
          }
          continue;
        }

        if (!referencesOnlyKnownRoots(init, knownRoots)) return null;
        for (const name of names) knownRoots.add(name);
      }
      continue;
    }

    if (isSimpleGuardClause(statement)) {
      guardClauses += 1;
      continue;
    }

    return null;
  }

  let forwardedProperties = 0;
  let staticProperties = 0;
  const forwardedRoots = new Set();
  const returnedKeys = [];

  for (const property of finalStatement.argument.properties || []) {
    if (property.type === "SpreadElement") {
      const root = referenceRoot(property.argument);
      if (!root || !knownRoots.has(root)) return null;
      forwardedProperties += 1;
      forwardedRoots.add(root);
      returnedKeys.push(`...${root}`);
      continue;
    }

    if (
      property.type !== "ObjectProperty" ||
      property.computed ||
      property.method
    ) {
      return null;
    }

    const key = objectPropertyName(property.key);
    returnedKeys.push(key || "<computed>");

    if (isStaticExpression(property.value)) {
      staticProperties += 1;
      continue;
    }

    if (!referencesOnlyKnownRoots(property.value, knownRoots)) return null;
    const roots = collectReferenceRoots(property.value);
    if (!roots.size) return null;
    for (const root of roots) forwardedRoots.add(root);
    forwardedProperties += 1;
  }

  if (forwardedProperties === 0) return null;

  const functionSource =
    Number.isInteger(fn.start) && Number.isInteger(fn.end)
      ? source.slice(fn.start, fn.end)
      : "";
  const hasClosingBraceReturnObject = /}\s*return\s*{/m.test(functionSource);
  const delegateList = [...delegates];
  const hookDelegates = delegateList.filter((name) => /(^|\.)use[A-Z0-9_]/.test(name));
  const exposesDelegateResult = [...forwardedRoots].some((root) =>
    delegateLocals.has(root),
  );

  let category = "OBJECT_PASSTHROUGH_WRAPPER";
  let severity = "high";
  let reason = "Returns an object composed almost entirely from incoming parameters without adding behavior.";

  if (hookDelegates.length) {
    category = "HOOK_OBJECT_WRAPPER";
    severity = "low";
    reason = "Calls one or more hooks and mainly republishes their results in a returned object; verify whether this is an intentional composition boundary.";
  } else if (guardClauses > 0) {
    category = "GUARDED_OBJECT_WRAPPER";
    severity = "medium";
    reason = "Uses simple guard returns and then republishes parameters or delegated results in an object.";
  } else if (delegateList.length && exposesDelegateResult) {
    category = "DELEGATING_OBJECT_WRAPPER";
    severity = delegateList.length === 1 && statements.length <= 3 ? "high" : "medium";
    reason = "Delegates work to another function and mainly republishes the delegated result.";
  } else if (delegateList.length) {
    category = "OBJECT_COMPOSER_WRAPPER";
    severity = delegateList.length <= 2 && statements.length <= 4 ? "medium" : "low";
    reason = "Calls other functions and returns a thin object composed from their outputs.";
  }

  if (staticProperties > forwardedProperties || statements.length > 5) {
    severity = "low";
  }

  if (hasClosingBraceReturnObject) {
    reason += " It also matches the characteristic `}\\s*return\\s*{` signal.";
  }

  return {
    category,
    severity,
    reason,
    patternSignal: hasClosingBraceReturnObject ? "}\\s*return\\s*{" : null,
    delegates: delegateList,
    forwardedRoots: [...forwardedRoots],
    returnedKeys,
    forwardedProperties,
    staticProperties,
    guardClauses,
    statementCount: statements.length,
    functionLines,
  };
}

function collectBindingNames(node, out) {
  if (!node) return out;
  if (node.type === "Identifier") {
    out.add(node.name);
    return out;
  }
  if (node.type === "AssignmentPattern") {
    collectBindingNames(node.left, out);
    return out;
  }
  if (node.type === "RestElement") {
    collectBindingNames(node.argument, out);
    return out;
  }
  if (node.type === "ObjectPattern") {
    for (const property of node.properties || []) {
      if (property.type === "RestElement") collectBindingNames(property.argument, out);
      else collectBindingNames(property.value || property.argument, out);
    }
    return out;
  }
  if (node.type === "ArrayPattern") {
    for (const element of node.elements || []) collectBindingNames(element, out);
  }
  return out;
}

function unwrapAwait(node) {
  return node?.type === "AwaitExpression" ? node.argument : node;
}

function isSimpleGuardClause(statement) {
  if (statement?.type !== "IfStatement") return false;
  return branchOnlyReturns(statement.consequent) &&
    (!statement.alternate || branchOnlyReturns(statement.alternate));
}

function branchOnlyReturns(node) {
  if (!node) return false;
  if (node.type === "ReturnStatement") return true;
  if (node.type !== "BlockStatement") return false;
  const statements = node.body.filter(
    (statement) => statement.type !== "EmptyStatement" && !statement.directive,
  );
  return statements.length === 1 && statements[0].type === "ReturnStatement";
}

function referencesOnlyKnownRoots(node, knownRoots) {
  if (!node) return false;
  if (isStaticExpression(node)) return true;

  if (node.type === "Identifier") return knownRoots.has(node.name);

  if (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") {
    const root = referenceRoot(node);
    if (!root || !knownRoots.has(root)) return false;
    if (node.computed && !isStaticExpression(node.property)) return false;
    return true;
  }

  if (node.type === "ObjectExpression") {
    return (node.properties || []).every((property) => {
      if (property.type === "SpreadElement") {
        return referencesOnlyKnownRoots(property.argument, knownRoots);
      }
      return property.type === "ObjectProperty" &&
        !property.computed &&
        referencesOnlyKnownRoots(property.value, knownRoots);
    });
  }

  if (node.type === "ArrayExpression") {
    return (node.elements || []).every(
      (element) => !element || referencesOnlyKnownRoots(element, knownRoots),
    );
  }

  if (node.type === "TSAsExpression" || node.type === "TSTypeAssertion") {
    return referencesOnlyKnownRoots(node.expression, knownRoots);
  }

  return false;
}

function collectReferenceRoots(node, out = new Set()) {
  if (!node || isStaticExpression(node)) return out;
  if (node.type === "Identifier") {
    out.add(node.name);
    return out;
  }
  if (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") {
    const root = referenceRoot(node);
    if (root) out.add(root);
    return out;
  }
  if (node.type === "ObjectExpression") {
    for (const property of node.properties || []) {
      collectReferenceRoots(
        property.type === "SpreadElement" ? property.argument : property.value,
        out,
      );
    }
    return out;
  }
  if (node.type === "ArrayExpression") {
    for (const element of node.elements || []) collectReferenceRoots(element, out);
  }
  if (node.type === "TSAsExpression" || node.type === "TSTypeAssertion") {
    collectReferenceRoots(node.expression, out);
  }
  return out;
}

function referenceRoot(node) {
  let current = node;
  while (
    current?.type === "MemberExpression" ||
    current?.type === "OptionalMemberExpression"
  ) {
    current = current.object;
  }
  return current?.type === "Identifier" ? current.name : "";
}

function expressionName(node) {
  if (!node) return "";
  if (node.type === "Identifier") return node.name;
  if (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") {
    const object = expressionName(node.object);
    const property = node.computed
      ? node.property?.type === "StringLiteral"
        ? node.property.value
        : ""
      : expressionName(node.property);
    return object && property ? `${object}.${property}` : object || property;
  }
  return "";
}

function objectPropertyName(node) {
  if (!node) return "";
  if (node.type === "Identifier" || node.type === "StringLiteral" || node.type === "NumericLiteral") {
    return String(node.name ?? node.value ?? "");
  }
  return "";
}

function isStaticExpression(node) {
  if (!node) return false;
  if ([
    "BooleanLiteral",
    "NullLiteral",
    "NumericLiteral",
    "StringLiteral",
    "BigIntLiteral",
    "RegExpLiteral",
  ].includes(node.type)) {
    return true;
  }
  if (node.type === "TemplateLiteral") return node.expressions.length === 0;
  return false;
}

function analyzeFunction(fn, hocs) {
  if (fn.params?.[0]?.type !== "Identifier") return null;
  const props = fn.params[0].name;
  const ref = hocs.includes("forwardRef") && fn.params[1]?.type === "Identifier" ? fn.params[1].name : "";
  const expression = returnedExpression(fn);
  if (expression?.type !== "JSXElement") return null;
  if (hasChildren(expression.children || [])) return null;

  const opening = expression.openingElement;
  const target = jsxName(opening.name);
  if (!target || !/^[A-Z]/.test(target.split(".")[0])) return null;

  let spreadCount = 0;
  let refCount = 0;
  const staticProps = [];

  for (const attribute of opening.attributes || []) {
    if (attribute.type === "JSXSpreadAttribute") {
      if (attribute.argument?.type !== "Identifier" || attribute.argument.name !== props) return null;
      spreadCount += 1;
      continue;
    }

    const name = jsxName(attribute.name);
    const value = attribute.value;
    const forwardsRef =
      name === "ref" &&
      ref &&
      value?.type === "JSXExpressionContainer" &&
      value.expression?.type === "Identifier" &&
      value.expression.name === ref;
    if (forwardsRef) {
      refCount += 1;
      continue;
    }

    if (!isStaticAttribute(attribute)) return null;
    staticProps.push(name || "<unknown>");
  }

  if (spreadCount !== 1 || (ref && refCount !== 1)) return null;
  return { target, props, ref, staticProps };
}

function returnedExpression(fn) {
  if (fn.type === "ArrowFunctionExpression" && fn.body.type !== "BlockStatement") return fn.body;
  if (fn.body?.type !== "BlockStatement") return null;
  const statements = fn.body.body.filter((node) => node.type !== "EmptyStatement" && !node.directive);
  return statements.length === 1 && statements[0].type === "ReturnStatement" ? statements[0].argument : null;
}

function exportedCandidates(body, declarations) {
  const out = [];
  for (const node of body) {
    if (node.type === "ExportDefaultDeclaration") {
      const name = identifier(node.declaration);
      pushCandidate(
        out,
        name || node.declaration.id?.name || "<default>",
        name ? declarations.get(name) : node.declaration,
        node.loc?.start?.line || 1,
      );
      continue;
    }
    if (node.type !== "ExportNamedDeclaration") continue;
    if (node.declaration?.type === "FunctionDeclaration") {
      pushCandidate(
        out,
        node.declaration.id?.name || "<anonymous>",
        node.declaration,
        node.loc?.start?.line || 1,
      );
    } else if (node.declaration?.type === "VariableDeclaration") {
      for (const item of node.declaration.declarations) {
        if (item.id?.type === "Identifier" && item.init) {
          pushCandidate(out, item.id.name, item.init, item.loc?.start?.line || 1);
        }
      }
    } else {
      for (const specifier of node.specifiers || []) {
        const name = identifier(specifier.local);
        if (name && declarations.has(name)) {
          pushCandidate(out, name, declarations.get(name), specifier.loc?.start?.line || 1);
        }
      }
    }
  }
  return out.filter((item) => item.expression);
}

function pushCandidate(out, name, expression, line) {
  out.push({ name, expression, line });
}

function importSourceForSymbol(imports, symbolPath) {
  const root = symbolPath.split(".")[0];
  return imports.get(root) || "";
}

function unwrap(expression, declarations, hocs = [], seen = new Set()) {
  if (!expression) return null;
  if (expression.type === "Identifier") {
    if (seen.has(expression.name)) return null;
    seen.add(expression.name);
    return unwrap(declarations.get(expression.name), declarations, hocs, seen);
  }
  if (["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"].includes(expression.type)) {
    return { fn: expression, hocs };
  }
  if (expression.type === "CallExpression") {
    const name = expression.callee?.type === "Identifier"
      ? expression.callee.name
      : expression.callee?.property?.type === "Identifier"
        ? expression.callee.property.name
        : "";
    if (!["memo", "forwardRef"].includes(name)) return null;
    return unwrap(expression.arguments[0], declarations, [...hocs, name], seen);
  }
  return null;
}

function importedNames(body) {
  const out = new Map();
  for (const node of body) {
    if (node.type !== "ImportDeclaration") continue;
    for (const specifier of node.specifiers) {
      if (specifier.local?.name) out.set(specifier.local.name, node.source.value);
    }
  }
  return out;
}

function topLevelDeclarations(body) {
  const out = new Map();
  for (const outer of body) {
    const node = outer.type === "ExportNamedDeclaration" && outer.declaration ? outer.declaration : outer;
    if (node.type === "FunctionDeclaration" && node.id?.name) out.set(node.id.name, node);
    if (node.type === "VariableDeclaration") {
      for (const item of node.declarations) {
        if (item.id?.type === "Identifier" && item.init) out.set(item.id.name, item.init);
      }
    }
  }
  return out;
}

function isStaticAttribute(attribute) {
  if (!attribute.value) return true;
  if (attribute.value.type === "StringLiteral") return true;
  if (attribute.value.type !== "JSXExpressionContainer") return false;
  return ["BooleanLiteral", "NullLiteral", "NumericLiteral", "StringLiteral"].includes(attribute.value.expression?.type);
}

function hasChildren(children) {
  return children.some((child) =>
    child.type === "JSXText"
      ? child.value.trim().length > 0
      : child.type !== "JSXExpressionContainer" || child.expression?.type !== "JSXEmptyExpression",
  );
}

function jsxName(node) {
  if (!node) return "";
  if (node.type === "JSXIdentifier" || node.type === "Identifier") return node.name;
  if (node.type === "JSXMemberExpression") return `${jsxName(node.object)}.${jsxName(node.property)}`;
  return "";
}

function identifier(node) {
  return node?.type === "Identifier" ? node.name : "";
}

function sortFindings(a, b) {
  return RANK[b.severity] - RANK[a.severity] || a.file.localeCompare(b.file) || a.line - b.line;
}

function print(results, errors, currentOptions) {
  const summary = {
    total: results.length,
    high: results.filter((item) => item.severity === "high").length,
    medium: results.filter((item) => item.severity === "medium").length,
    low: results.filter((item) => item.severity === "low").length,
    parseErrors: errors.length,
    failOn: currentOptions.failOn,
  };

  if (currentOptions.json) {
    console.log(JSON.stringify({ summary, findings: results, parseErrors: errors }, null, 2));
    return;
  }

  console.log(`Wrapper/re-export suspects: ${summary.total} (high=${summary.high}, medium=${summary.medium}, low=${summary.low})`);
  for (const item of results) {
    const source = item.importSource ? ` from ${item.importSource}` : "";
    console.log(`\n[${item.severity.toUpperCase()}] ${item.category}`);
    console.log(`  ${item.file}:${item.line}`);
    console.log(`  ${item.symbol} -> ${item.target}${source}`);
    console.log(`  ${item.reason}`);
    if (item.details?.patternSignal) {
      console.log(`  Pattern: ${item.details.patternSignal}`);
    }
    if (item.details?.returnedKeys?.length) {
      console.log(`  Returns: ${item.details.returnedKeys.join(", ")}`);
    }
  }
  if (errors.length) {
    console.error(`\nParse errors: ${errors.length}`);
    for (const error of errors) console.error(`  ${error.file}: ${error.message}`);
  }
  console.log(`\nExit threshold: ${currentOptions.failOn}`);
}
