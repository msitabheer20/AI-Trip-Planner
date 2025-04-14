module.exports = {
    extends: "next/core-web-vitals",
    rules: {
        // Temporarily disable these rules if needed
        "@next/next/no-img-element": "warn", // Downgrade from error to warning
        "react/no-unescaped-entities": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            },
        ],
    },
}
