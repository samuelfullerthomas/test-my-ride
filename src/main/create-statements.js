export const createImportStatements = filenames => {
  return filenames.map((file, i) => `import * as importFns${i} from '${file}';`)
    .join(`
`);
};

export const createMockFileStatements = filenames => {
  return filenames.map((st, i) => `mockFile(importFns${i});`).join(`
`);
};

export const createAssignMockStatements = (importFiles, fns) => {
  return importFiles.map((importFile, i) => {
    const defaultImport = fns.importedFns.find(
      fn => fn.location === importFile && fn.isDefault
    );
    const namedImports = fns.importedFns.filter(
      fn => fn.location === importFile && !fn.isDefault
    );

    const defaultStatement =
      defaultImport && `const ${defaultImport.name} = importFns${i}.default;`;

    const namedImportNames = namedImports
      .map(im => im.name)
      .join(',')
      .replace(',', ', ');

    const namedStatement = `const { ${namedImportNames} } = importFns${i};`;

    const ret = `${defaultStatement || ''}${
      namedImports.length
        ? `
${namedStatement}`
        : ''
    }`;
    return ret;
  }).join(`
`);
};

export const createDescribes = fns => {
  return `${
    fns.defaultFn
      ? `describe('defaultExport', () => {
  ${createIt('default', fns.defaultFn)}
});
`
      : ''
  }
${Object.keys(fns.namedFns).map(namedFn => {
  return `describe('${namedFn}', () => {
  ${createIt(namedFn, fns.namedFns[namedFn])}
});`;
}).join(`

`)}`;
};

export const createIt = (name, fns) => {
  return `it('returns true when ${fns.join(', ')} is true', () => {
    ${
      fns.length
        ? fns.map(fn => `mockFunction(${fn}, true);`).join(`
`) +
          `

    `
        : ''
    }expect(subjectUnderTest.${name}()).toEqual(true);
  });`;
};

export const createSubjectUnderTestStatement = filename => {
  return `import * as subjectUnderTest from '${filename}';`;
};
