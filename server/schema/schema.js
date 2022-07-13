const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

const movies = [
	{ id: '1', name: 'Pulp Fiction', genre: 'Crime', directorId: '1', },
	{ id: '2', name: '1984', genre: 'Sci-Fi', directorId: '2', },
	{ id: '3', name: 'V for vendetta', genre: 'Sci-Fi-Triller', directorId: '3', },
	{ id: '4', name: 'Snatch', genre: 'Crime-Comedy', directorId: '4', },
	{ id: '5', name: 'Reservoir Dogs', genre: 'Crime', directorId: '1' },
	{ id: '6', name: 'The Hateful Eight', genre: 'Crime', directorId: '1' },
	{ id: '7', name: 'Inglourious Basterds', genre: 'Crime', directorId: '1' },
	{ id: '7', name: 'Lock, Stock and Two Smoking Barrels', genre: 'Crime-Comedy', directorId: '4' },
];

const directors = [
	{ id: '1', name: 'Quentin Tarantino', age: 55 },
	{ id: '2', name: 'Michael Radford', age: 72 },
	{ id: '3', name: 'James McTeigue', age: 51 },
	{ id: '4', name: 'Guy Ritchie', age: 50 },
];

const MovieType = new GraphQLObjectType({// схема запроса MovieType
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
		director: {//связь с табл directors по полю directorId
			type: DirectorType,
			resolve(parent, args) {//parent.id - aргумент из родительского запроса
				return directors.find(director => director.id === parent.id);
			}
		}
  }),
});

const DirectorType = new GraphQLObjectType({// схема запроса DirectorType
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    movies: { //для списка фильмов режиссёра
       type: new GraphQLList(MovieType),
       resolve(parent, args) {//parent.id - aргумент из родительского запроса
        return movies.filter(movie => movie.directorId === parent.id); //parent.id будет id корневого запроса по directors
       },
    },
  }),
});

const Query = new GraphQLObjectType({//корневой запрос
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return movies.find(movie => movie.id === args.id);
      },
    },
		director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return directors.find(director => director.id === args.id);
      },
    },
    movies: { //для списка всех фильмов
        type: new GraphQLList(MovieType),
        resolve(parent, args) {
         return movies;
        },
     },
     directors: { //для списка всех директоров
        type: new GraphQLList(DirectorType),
        resolve(parent, args) {
         return directors;
        },
     },
  }
});

module.exports = new GraphQLSchema({
  query: Query,
});