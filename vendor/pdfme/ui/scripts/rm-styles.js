module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let uiClassImports = false;

  const isDesigner = file.path.includes('Designer');
  const classNameVar = isDesigner ? 'DESIGNER_CLASSNAME' : 'UI_CLASSNAME';
  
  root.find(j.JSXElement).forEach(path => {
    let hasStyle = false;
    let hasClass = false;

    // Filter attributes, remove `style`
    const newAttributes = [];
    (path.node.openingElement.attributes || []).forEach(attr => {
      if (attr.type === 'JSXAttribute') {
        if (attr.name.name === 'style') {
          hasStyle = true;
        } else if (attr.name.name === 'className') {
          hasClass = true;
          // check if using concatenation?
          newAttributes.push(attr);
        } else {
          newAttributes.push(attr);
        }
      } else {
        newAttributes.push(attr); // JSXSpreadAttribute
      }
    });

    if (hasStyle) {
      // If we removed style, we should ensure there's a className
      if (!hasClass) {
        // give it a simple auto-generated name
        const nodeName = path.node.openingElement.name.name || 'div';
        const classNameStr = `${nodeName.toLowerCase()}`;
        
        // build AST for `{ UI_CLASSNAME + 'string' }`
        const newClassAttr = j.jsxAttribute(
          j.jsxIdentifier('className'),
          j.jsxExpressionContainer(
            j.binaryExpression(
              '+',
              j.identifier(classNameVar),
              j.literal(classNameStr)
            )
          )
        );
        newAttributes.push(newClassAttr);
        uiClassImports = true;
      } else {
        // they already have classname, but is it using the constant?
        // if user wants to make sure each has classname using concatenation...
        // Let's assume the existing ones are okay or we can also wrap them.
      }
      
      path.node.openingElement.attributes = newAttributes;
    }
  });

  // also transform any object spread if we missed styles? We only check JSXAttributes.

  if (uiClassImports) {
    // Add import { UI_CLASSNAME or DESIGNER_CLASSNAME } if missing
    const imports = root.find(j.ImportDeclaration);
    let found = false;
    imports.forEach(i => {
      if (i.node.source.value.includes('constants')) {
        const specifiers = i.node.specifiers || [];
        const hasSpec = specifiers.some(s => s.imported && s.imported.name === classNameVar);
        if (!hasSpec) {
          specifiers.push(j.importSpecifier(j.identifier(classNameVar)));
        }
        found = true;
      }
    });

    if (!found) {
      // Create import statement
      const depth = file.path.split('src/components/')[1]?.split('/').length - 1 || 0;
      const relativePath = depth > 0 ? '../'.repeat(depth) + 'constants.js' : '../constants.js';
      
      const newImport = j.importDeclaration(
        [j.importSpecifier(j.identifier(classNameVar))],
        j.literal(relativePath)
      );
      if (imports.length > 0) {
        j(imports.at(0).get()).insertBefore(newImport);
      } else {
        root.get().node.program.body.unshift(newImport);
      }
    }
  }

  return root.toSource();
}
