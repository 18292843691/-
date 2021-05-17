const core = require("@babel/core")
const fs = require('fs')
// const code = fs.readFileSync('./test.js')

const code = (() => {
  /** @jsx React.createElement */
  const dic = () => <div>123</div>
  // const dic = 123 + 123
  const css = 333
  console.log(dic,css)
})

const res = core.transform(code, {
  presets: ['@babel/preset-react'],
  // plugins: ["@babel/plugin-transform-react-jsx"],
});

console.log(res)