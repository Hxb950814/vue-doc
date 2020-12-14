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
        semi: [2, 'always'], // 必须使用分号结尾
        indent: [0, 4], // 不校验缩进风格
        'no-console': 0, // 可以使用console
        'no-debugger': 0, // 可以使用debugger
        'no-return-await': 0, // 可以返回await出的对象
        'require-await': 0, // 可以返回await出的对象
        'space-before-function-paren': [0, 'never'], // 关闭函数括号前的空格校验
        'prefer-promise-reject-errors': 'off',
        'no-unused-vars': 0, // 关闭不使用变量校验
        camelcase: 0,

        '@typescript-eslint/no-explicit-any': 'off', // 可以使用any
        '@typescript-eslint/no-unused-vars': 'off', // 未使用变量不校验
        '@typescript-eslint/camelcase': 'off', // 不校验变量是否是camelCase
        '@typescript-eslint/no-empty-function': 'off', // 允许空函数
        '@typescript-eslint/ban-ts-ignore': 'off', // 可以使用@ts-ignore
        '@typescript-eslint/no-var-requires': 'off', // 可以使用require


        /* about vue */
        'vue/max-attributes-per-line': 0,
        'vue/html-indent': [1, 4],
        'vue/no-v-html': 0
    }
};
