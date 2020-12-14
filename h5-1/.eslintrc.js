module.exports = {
    root: true,
    env: {
        node: true
    },
    parserOptions: {
        ecmaVersion: 2020
    },
    extends: [
        '@nuxtjs/eslint-config-typescript',
        'plugin:nuxt/recommended'
    ],
    // add your custom rules here
    rules: {
        'semi': [2, 'always'], // 必须使用分号结尾
        'indent': 0, // 不校验缩进风格
        'no-console': 0,// 可以使用console
        'no-debugger': 0,// 可以使用debugger
        'object-curly-spacing': [0, 'never'],
        'space-before-function-paren': [0, 'never'], //关闭函数括号前的空格校验
        'nuxt/no-cjs-in-config': 'off',
        'camelcase': 'off',

        'no-return-await': 0,

        '@typescript-eslint/no-unused-vars': 0,
        'no-unused-vars': 0,

        /* about vue */
        'vue/max-attributes-per-line': 0,
        'vue/html-indent': [1, 4],
        'vue/no-v-html': 0
    }
};
