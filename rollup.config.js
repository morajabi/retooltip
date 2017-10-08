import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import gzip from 'rollup-plugin-gzip'

const prod = process.env.PRODUCTION

let config = {
  input: 'src/index.js',
  sourcemap: true,
  exports: 'named',
  external: ['react'],
  globals: { 'react': 'React' }
}

let plugins = [
  resolve(),
  commonjs(),
  babel(),
  gzip(),
]

if (prod) plugins.push(uglify())

if (process.env.BROWSER) {
  config = Object.assign(config, {
    output: {
      file: 'dist/retooltip.umd.js',
      format: 'umd',
    },
    name: 'retooltip',
    sourcemap: true,
    exports: 'named',
    plugins,
  })

} else if (process.env.COMMON) {
  config = Object.assign(config, {
    plugins: [
      resolve(),
      commonjs(),
      babel(),
    ],
    output: {
      file: 'dist/retooltip.common.js',
      format: 'cjs',
    }
  })

} else if (process.env.ES) {
  config = Object.assign(config, {
    plugins: [
      resolve(),
      commonjs(),
      babel(),
    ],
    output: {
      file: 'dist/retooltip.es.js',
      format: 'es',
    }
  })
}

export default config
