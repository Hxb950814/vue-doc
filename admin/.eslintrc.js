module.exports = {
    root: true,
    env: {
        node: true
    },
    parserOptions: {
        ecmaVersion: 2020
    },
    extends: [
        // 'plugin:vue/essential',
        // '@vue/standard',
        '@nuxtjs/eslint-config-typescript',
        'plugin:nuxt/recommended'
    ],
    rules: {
        semi: [2, 'always'], // 必须使用分号结尾
        indent: [0, 4], // 不校验缩进风格
        'no-console': 0, // 可以使用console
        'no-debugger': 0, // 可以使用debugger
        'object-curly-spacing': [0, 'never'],
        'no-prototype-builtins': 'off',
        'no-return-await': 'off', // 可以返回await出的对象
        'require-await': 0, // 可以返回await出的对象
        'space-before-function-paren': [0, 'never'], // 关闭函数括号前的空格校验
        'prefer-promise-reject-errors': 'off',
        'no-unused-vars': 0, // 关闭不使用变量校验
        camelcase: 0, // 关闭驼峰校验

        '@typescript-eslint/no-explicit-any': 'off', // 可以使用any
        '@typescript-eslint/no-unused-vars': 'off', // 未使用变量不校验
        '@typescript-eslint/camelcase': 'off', // 不校验变量是否是camelCase
        '@typescript-eslint/no-empty-function': 'off', // 允许空函数
        '@typescript-eslint/ban-ts-ignore': 'off', // 可以使用@ts-ignore
        '@typescript-eslint/no-var-requires': 'off', // 可以使用require

        'standard/no-callback-literal': 'off',

        //
        /* about vue */
        'vue/no-unused-vars': 'off',
        // 'no-console': 'error',
        'vue/html-indent': [1, 4]
    }
};
