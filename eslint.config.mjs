import nx from "@nx/eslint-plugin";

export default [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    {
        ignores: [
            "**/dist",
            "**/out-tsc"
        ]
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: [
                        "^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"
                    ],
                    depConstraints: [
                        {
                            sourceTag: "type:model",
                            onlyDependOnLibsWithTags: ["type:model"]
                        },
                        {
                            sourceTag: "type:util",
                            onlyDependOnLibsWithTags: ["type:model", "type:util"]
                        },
                        {
                            sourceTag: "type:domain",
                            onlyDependOnLibsWithTags: [
                                "type:domain",
                                "type:model",
                                "type:util"
                            ]
                        },
                        {
                            sourceTag: "type:data-access",
                            onlyDependOnLibsWithTags: [
                                "type:data-access",
                                "type:domain",
                                "type:model",
                                "type:util"
                            ]
                        },
                        {
                            sourceTag: "type:feature",
                            onlyDependOnLibsWithTags: [
                                "type:feature",
                                "type:data-access",
                                "type:domain",
                                "type:model",
                                "type:ui",
                                "type:util"
                            ]
                        },
                        {
                            sourceTag: "type:ui",
                            onlyDependOnLibsWithTags: [
                                "type:model",
                                "type:ui",
                                "type:util"
                            ]
                        },
                        {
                            sourceTag: "type:core",
                            onlyDependOnLibsWithTags: [
                                "type:core",
                                "type:model",
                                "type:util"
                            ]
                        },
                        {
                            sourceTag: "type:app",
                            onlyDependOnLibsWithTags: [
                                "type:core",
                                "type:data-access",
                                "type:domain",
                                "type:feature",
                                "type:model",
                                "type:ui",
                                "type:util"
                            ]
                        }
                    ]
                }
            ]
        }
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs"
        ],
        // Override or add rules here
        rules: {}
    }
];
