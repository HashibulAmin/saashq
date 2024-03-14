"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const language_1 = require("graphql/language"); // tslint:disable-line
function jSONidentity(value) {
    return value;
}
function jSONparseLiteral(ast) {
    switch (ast.kind) {
        case language_1.Kind.STRING:
        case language_1.Kind.BOOLEAN:
            return ast.value;
        case language_1.Kind.INT:
        case language_1.Kind.FLOAT:
            return parseFloat(ast.value);
        case language_1.Kind.OBJECT: {
            const value = Object.create(null);
            ast.fields.forEach((field) => {
                value[field.name.value] = jSONparseLiteral(field.value);
            });
            return value;
        }
        case language_1.Kind.LIST:
            return ast.values.map(jSONparseLiteral);
        default:
            return null;
    }
}
exports.default = {
    Date: new graphql_1.GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize: (value) => {
            if (value instanceof Date) {
                return value.toISOString();
            }
            if (value.toISOString) {
                return value.toISOString();
            }
            return new Date(value).toISOString();
        },
        // @ts-ignore
        parseLiteral(ast) {
            if (ast.kind === language_1.Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            // return null;
        }
    }),
    JSON: new graphql_1.GraphQLScalarType({
        name: 'JSON',
        description: 'The `jSON` scalar type represents jSON values as specified by ' +
            '[ECMA-404](http://www.ecma-international.org/' +
            'publications/files/ECMA-ST/ECMA-404.pdf).',
        serialize: jSONidentity,
        parseValue: jSONidentity,
        parseLiteral: jSONparseLiteral
    })
};
