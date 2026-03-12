module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let hasChanges = false;
  let needsImport = false;
  
  // Use DESIGNER_CLASSNAME for files inside Designer directory, else UI_CLASSNAME
  const isDesigner = file.path.includes('Designer');
  const classNameVar = isDesigner ? 'DESIGNER_CLASSNAME' : 'UI_CLASSNAME';

  root.find(j.JSXElement).forEach(path => {
    let styleAttrIndex = -1;
    let classNameAttrIndex = -1;
    const attrs = path.node.openingElement.attributes || [];
    
    attrs.forEach((attr, idx) => {
      if (attr && attr.type === 'JSXAttribute') {
        if (attr.name && attr.name.name === 'style') styleAttrIndex = idx;
        if (attr.name && attr.name.name === 'className') classNameAttrIndex = idx;
      }
    });

    if (styleAttrIndex !== -1) {
      // Remove style attribute
      attrs.splice(styleAttrIndex, 1);
      hasChanges = true;
      needsImport = true;
      
      // Update classNameAttrIndex if it shifted
      if (classNameAttrIndex > styleAttrIndex) {
        classNameAttrIndex--;
      }

      let nodeName = 'element';
      if (path.node.openingElement.name.type === 'JSXIdentifier') {
        nodeName = path.node.openingElement.name.name;
      }
      
      const autoClassNameName = `${nodeName.toLowerCase()}-auto`;

      if (classNameAttrIndex === -1) {
        // Add className
        attrs.push(
          j.jsxAttribute(
            j.jsxIdentifier('className'),
            j.jsxExpressionContainer(
              j.binaryExpression(
                '+',
                j.identifier(classNameVar),
                j.literal(autoClassNameName)
              )
            )
          )
        );
      } else {
        // If it already has a className, convert to use the constant if it isn't already
        const classNameAttr = attrs[classNameAttrIndex];
        if (classNameAttr.value.type === 'StringLiteral') {
          const val = classNameAttr.value.value;
          classNameAttr.value = j.jsxExpressionContainer(
            j.binaryExpression(
              '+',
              j.identifier(classNameVar),
              j.literal(val)
            )
          );
        } else if (classNameAttr.value.type === 'JSXExpressionContainer') {
          const expr = classNameAttr.value.expression;
          let hasConstant = false;
          j(expr).find(j.Identifier).forEach(id => {
            if (id.node.name === classNameVar || id.node.name === 'UI_CLASSNAME' || id.node.name === 'DESIGNER_CLASSNAME') {
              hasConstant = true;
            }
          });
          
          if (!hasConstant) {
            classNameAttr.value = j.jsxExpressionContainer(
              j.binaryExpression(
                '+',
                j.identifier(classNameVar),
                j.binaryExpression(
                  '+',
                  j.literal('custom-'),
                  expr.type === 'StringLiteral' ? expr : j.callExpression(j.identifier('String'), [expr])
                )
              )
            );
          }
        }
      }
    }
  });

  if (needsImport) {
    const imports = root.find(j.ImportDeclaration);
    let found = false;
    imports.forEach(path => {
      if (path.node.source && typeof path.node.source.value === 'string' && path.node.source.value.includes('constants')) {
        const specs = path.node.specifiers || [];
        const hasSpec = specs.some(s => s.type === 'ImportSpecifier' && s.imported.name === classNameVar);
        if (!hasSpec) {
          specs.push(j.importSpecifier(j.identifier(classNameVar)));
          hasChanges = true;
        }
        found = true;
      }
    });

    if (!found) {
      let relativePath = '';
      if (file.path.includes('components/Designer/RightSidebar/DetailView') || file.path.includes('components/Designer/RightSidebar/ListView')) {
        relativePath = '../../../../constants.js';
      } else if (file.path.includes('components/Designer/RightSidebar') || file.path.includes('components/Designer/Canvas')) {
        relativePath = '../../../constants.js';
      } else if (file.path.includes('components/Designer')) {
        relativePath = '../../constants.js';
      } else if (file.path.includes('components/')) {
        relativePath = '../constants.js';
      } else {
        relativePath = './constants.js';
      }
      
      const newImport = j.importDeclaration(
        [j.importSpecifier(j.identifier(classNameVar))],
        j.literal(relativePath)
      );
      
      if (imports.length > 0) {
        j(imports.at(0).get()).insertBefore(newImport);
      } else {
        root.get().node.program.body.unshift(newImport);
      }
      hasChanges = true;
    }
  }

  return hasChanges ? root.toSource() : null;
}
