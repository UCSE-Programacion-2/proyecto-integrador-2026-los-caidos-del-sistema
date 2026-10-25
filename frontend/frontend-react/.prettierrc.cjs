module.exports = {
  // Agrega punto y coma al final de cada línea (ej: const x = 5;)
  semi: true,

  // Usa 2 espacios para la indentación (en lugar de tabs)
  tabWidth: 2,

  // Longitud máxima de una línea antes de hacer un salto de línea automático
  printWidth: 100,

  // Usa comillas simples en lugar de dobles (ej: 'texto' en lugar de "texto")
  singleQuote: true,

  // Agrega comas al final en arrays y objetos multilínea (útil para Git diffs más limpios)
  trailingComma: 'all',

  // Agrega espacios dentro de los brackets de objetos (ej: { foo: bar } en lugar de {foo:bar})
  bracketSpacing: true,

  // Usa comillas simples en atributos JSX (ej: <div className='container'> en lugar de className="container")
  jsxSingleQuote: true,

  // Omite paréntesis en arrow functions con un solo parámetro (ej: x => x + 1 en lugar de (x) => x + 1)
  arrowParens: 'avoid',
};
