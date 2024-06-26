import { GraphQLScalarType } from 'graphql';
import { Kind, ValueNode } from 'graphql/language'; // tslint:disable-line

function jSONidentity(value: any) {
  return value;
}

function jSONparseLiteral(ast: any) {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT: {
      const value = Object.create(null);

      ast.fields.forEach((field: any) => {
        value[field.name.value] = jSONparseLiteral(field.value);
      });

      return value;
    }
    case Kind.LIST:
      return ast.values.map(jSONparseLiteral);
    default:
      return null;
  }
}

export default {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Datum vlastního skalárního typu',
    parseValue(value: any) {
      return new Date(value); // value from the client
    },
    serialize: (value: any) => {
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
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      // return null;
    },
  }),

  JSON: new GraphQLScalarType({
    name: 'JSON',
    description:
      'Skalární typ `jSON` představuje hodnoty jSON, jak je specifikováno v ' +
      '[ECMA-404](http://www.ecma-international.org/' +
      'publications/files/ECMA-ST/ECMA-404.pdf).',
    serialize: jSONidentity,
    parseValue: jSONidentity,
    parseLiteral: jSONparseLiteral,
  }),
};
