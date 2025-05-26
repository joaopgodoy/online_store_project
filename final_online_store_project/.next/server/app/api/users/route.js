/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/users/route";
exports.ids = ["app/api/users/route"];
exports.modules = {

/***/ "(rsc)/./app/api/users/route.ts":
/*!********************************!*\
  !*** ./app/api/users/route.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_mongoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/mongoose */ \"(rsc)/./lib/mongoose.ts\");\n/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/models/User */ \"(rsc)/./models/User.ts\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n\n\n\n\n// GET endpoint to fetch all users\nasync function GET() {\n    try {\n        await (0,_lib_mongoose__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n        // Buscar todos os usuários, excluindo a senha\n        const users = await _models_User__WEBPACK_IMPORTED_MODULE_2__[\"default\"].find({}, {\n            password: 0\n        }).sort({\n            createdAt: -1\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(users);\n    } catch (error) {\n        console.error('Erro ao buscar usuários:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: 'Erro interno do servidor'\n        }, {\n            status: 500\n        });\n    }\n}\n// POST endpoint to create a new user\nasync function POST(req) {\n    try {\n        await (0,_lib_mongoose__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n        const { name, email, apartment, password, admin = false } = await req.json();\n        // Verificar se o usuário já existe\n        const existingUser = await _models_User__WEBPACK_IMPORTED_MODULE_2__[\"default\"].findOne({\n            email\n        });\n        if (existingUser) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: \"Email já está sendo usado\"\n            }, {\n                status: 400\n            });\n        }\n        // Hash da senha\n        const hashedPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_3__[\"default\"].hash(password, 12);\n        // Criar o usuário\n        const user = await _models_User__WEBPACK_IMPORTED_MODULE_2__[\"default\"].create({\n            name,\n            email,\n            apartment,\n            password: hashedPassword,\n            admin,\n            paymentMethod: null,\n            order: []\n        });\n        // Remover a senha antes de retornar\n        const userObj = user.toObject();\n        delete userObj.password;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Usuário criado com sucesso\",\n            user: userObj\n        }, {\n            status: 201\n        });\n    } catch (error) {\n        console.error('Erro ao criar usuário:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Erro interno do servidor\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3VzZXJzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUEwQztBQUNKO0FBQ047QUFDSDtBQUU3QixrQ0FBa0M7QUFDM0IsZUFBZUk7SUFDcEIsSUFBSTtRQUNGLE1BQU1ILHlEQUFTQTtRQUVmLDhDQUE4QztRQUM5QyxNQUFNSSxRQUFRLE1BQU1ILG9EQUFJQSxDQUFDSSxJQUFJLENBQUMsQ0FBQyxHQUFHO1lBQUVDLFVBQVU7UUFBRSxHQUFHQyxJQUFJLENBQUM7WUFBRUMsV0FBVyxDQUFDO1FBQUU7UUFFeEUsT0FBT1QscURBQVlBLENBQUNVLElBQUksQ0FBQ0w7SUFDM0IsRUFBRSxPQUFPTSxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQyw0QkFBNEJBO1FBQzFDLE9BQU9YLHFEQUFZQSxDQUFDVSxJQUFJLENBQ3RCO1lBQUVHLFNBQVM7UUFBMkIsR0FDdEM7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0Y7QUFFQSxxQ0FBcUM7QUFDOUIsZUFBZUMsS0FBS0MsR0FBWTtJQUNyQyxJQUFJO1FBQ0YsTUFBTWYseURBQVNBO1FBQ2YsTUFBTSxFQUFFZ0IsSUFBSSxFQUFFQyxLQUFLLEVBQUVDLFNBQVMsRUFBRVosUUFBUSxFQUFFYSxRQUFRLEtBQUssRUFBRSxHQUFHLE1BQU1KLElBQUlOLElBQUk7UUFFMUUsbUNBQW1DO1FBQ25DLE1BQU1XLGVBQWUsTUFBTW5CLG9EQUFJQSxDQUFDb0IsT0FBTyxDQUFDO1lBQUVKO1FBQU07UUFDaEQsSUFBSUcsY0FBYztZQUNoQixPQUFPckIscURBQVlBLENBQUNVLElBQUksQ0FDdEI7Z0JBQUVHLFNBQVM7WUFBNEIsR0FDdkM7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLGdCQUFnQjtRQUNoQixNQUFNUyxpQkFBaUIsTUFBTXBCLHFEQUFXLENBQUNJLFVBQVU7UUFFbkQsa0JBQWtCO1FBQ2xCLE1BQU1rQixPQUFPLE1BQU12QixvREFBSUEsQ0FBQ3dCLE1BQU0sQ0FBQztZQUM3QlQ7WUFDQUM7WUFDQUM7WUFDQVosVUFBVWdCO1lBQ1ZIO1lBQ0FPLGVBQWU7WUFDZkMsT0FBTyxFQUFFO1FBQ1g7UUFFQSxvQ0FBb0M7UUFDcEMsTUFBTUMsVUFBVUosS0FBS0ssUUFBUTtRQUM3QixPQUFPRCxRQUFRdEIsUUFBUTtRQUV2QixPQUFPUCxxREFBWUEsQ0FBQ1UsSUFBSSxDQUN0QjtZQUFFRyxTQUFTO1lBQThCWSxNQUFNSTtRQUFRLEdBQ3ZEO1lBQUVmLFFBQVE7UUFBSTtJQUVsQixFQUFFLE9BQU9ILE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLDBCQUEwQkE7UUFDeEMsT0FBT1gscURBQVlBLENBQUNVLElBQUksQ0FDdEI7WUFBRUcsU0FBUztRQUEyQixHQUN0QztZQUFFQyxRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsiL2hvbWUvcGVsb3JvL0Rlc2t0b3AvQ29uZG9taW5pby9vbmxpbmVfc3RvcmVfcHJvamVjdC9maW5hbF9vbmxpbmVfc3RvcmVfcHJvamVjdC9hcHAvYXBpL3VzZXJzL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJ1xuaW1wb3J0IGNvbm5lY3REQiBmcm9tICdAL2xpYi9tb25nb29zZSdcbmltcG9ydCBVc2VyIGZyb20gJ0AvbW9kZWxzL1VzZXInXG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdGpzJ1xuXG4vLyBHRVQgZW5kcG9pbnQgdG8gZmV0Y2ggYWxsIHVzZXJzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xuICB0cnkge1xuICAgIGF3YWl0IGNvbm5lY3REQigpXG4gICAgXG4gICAgLy8gQnVzY2FyIHRvZG9zIG9zIHVzdcOhcmlvcywgZXhjbHVpbmRvIGEgc2VuaGFcbiAgICBjb25zdCB1c2VycyA9IGF3YWl0IFVzZXIuZmluZCh7fSwgeyBwYXNzd29yZDogMCB9KS5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KVxuICAgIFxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih1c2VycylcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvIGFvIGJ1c2NhciB1c3XDoXJpb3M6JywgZXJyb3IpXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBtZXNzYWdlOiAnRXJybyBpbnRlcm5vIGRvIHNlcnZpZG9yJyB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKVxuICB9XG59XG5cbi8vIFBPU1QgZW5kcG9pbnQgdG8gY3JlYXRlIGEgbmV3IHVzZXJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIGF3YWl0IGNvbm5lY3REQigpXG4gICAgY29uc3QgeyBuYW1lLCBlbWFpbCwgYXBhcnRtZW50LCBwYXNzd29yZCwgYWRtaW4gPSBmYWxzZSB9ID0gYXdhaXQgcmVxLmpzb24oKVxuXG4gICAgLy8gVmVyaWZpY2FyIHNlIG8gdXN1w6FyaW8gasOhIGV4aXN0ZVxuICAgIGNvbnN0IGV4aXN0aW5nVXNlciA9IGF3YWl0IFVzZXIuZmluZE9uZSh7IGVtYWlsIH0pXG4gICAgaWYgKGV4aXN0aW5nVXNlcikge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IG1lc3NhZ2U6IFwiRW1haWwgasOhIGVzdMOhIHNlbmRvIHVzYWRvXCIgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApXG4gICAgfVxuXG4gICAgLy8gSGFzaCBkYSBzZW5oYVxuICAgIGNvbnN0IGhhc2hlZFBhc3N3b3JkID0gYXdhaXQgYmNyeXB0Lmhhc2gocGFzc3dvcmQsIDEyKVxuXG4gICAgLy8gQ3JpYXIgbyB1c3XDoXJpb1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLmNyZWF0ZSh7XG4gICAgICBuYW1lLFxuICAgICAgZW1haWwsXG4gICAgICBhcGFydG1lbnQsXG4gICAgICBwYXNzd29yZDogaGFzaGVkUGFzc3dvcmQsXG4gICAgICBhZG1pbixcbiAgICAgIHBheW1lbnRNZXRob2Q6IG51bGwsXG4gICAgICBvcmRlcjogW11cbiAgICB9KVxuXG4gICAgLy8gUmVtb3ZlciBhIHNlbmhhIGFudGVzIGRlIHJldG9ybmFyXG4gICAgY29uc3QgdXNlck9iaiA9IHVzZXIudG9PYmplY3QoKVxuICAgIGRlbGV0ZSB1c2VyT2JqLnBhc3N3b3JkXG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IG1lc3NhZ2U6IFwiVXN1w6FyaW8gY3JpYWRvIGNvbSBzdWNlc3NvXCIsIHVzZXI6IHVzZXJPYmogfSxcbiAgICAgIHsgc3RhdHVzOiAyMDEgfVxuICAgIClcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvIGFvIGNyaWFyIHVzdcOhcmlvOicsIGVycm9yKVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgbWVzc2FnZTogXCJFcnJvIGludGVybm8gZG8gc2Vydmlkb3JcIiB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKVxuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiY29ubmVjdERCIiwiVXNlciIsImJjcnlwdCIsIkdFVCIsInVzZXJzIiwiZmluZCIsInBhc3N3b3JkIiwic29ydCIsImNyZWF0ZWRBdCIsImpzb24iLCJlcnJvciIsImNvbnNvbGUiLCJtZXNzYWdlIiwic3RhdHVzIiwiUE9TVCIsInJlcSIsIm5hbWUiLCJlbWFpbCIsImFwYXJ0bWVudCIsImFkbWluIiwiZXhpc3RpbmdVc2VyIiwiZmluZE9uZSIsImhhc2hlZFBhc3N3b3JkIiwiaGFzaCIsInVzZXIiLCJjcmVhdGUiLCJwYXltZW50TWV0aG9kIiwib3JkZXIiLCJ1c2VyT2JqIiwidG9PYmplY3QiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/users/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/mongoose.ts":
/*!*************************!*\
  !*** ./lib/mongoose.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst MONGODB_URI = process.env.MONGODB_URI;\nif (!MONGODB_URI) {\n    throw new Error('❌ MONGODB_URI não está definida no .env');\n}\n// cache para evitar reconexões no dev\nlet cached = global.mongoose || {\n    conn: null,\n    promise: null\n};\nasync function connectDB() {\n    if (cached.conn) return cached.conn;\n    if (!cached.promise) {\n        cached.promise = mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(MONGODB_URI, {\n            bufferCommands: false\n        });\n    }\n    cached.conn = await cached.promise;\n    return cached.conn;\n}\nglobal.mongoose = cached;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (connectDB);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbW9uZ29vc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQStCO0FBRS9CLE1BQU1DLGNBQWNDLFFBQVFDLEdBQUcsQ0FBQ0YsV0FBVztBQUUzQyxJQUFJLENBQUNBLGFBQWE7SUFDaEIsTUFBTSxJQUFJRyxNQUFNO0FBQ2xCO0FBRUEsc0NBQXNDO0FBQ3RDLElBQUlDLFNBQVNDLE9BQU9OLFFBQVEsSUFBSTtJQUFFTyxNQUFNO0lBQU1DLFNBQVM7QUFBSztBQUU1RCxlQUFlQztJQUNiLElBQUlKLE9BQU9FLElBQUksRUFBRSxPQUFPRixPQUFPRSxJQUFJO0lBRW5DLElBQUksQ0FBQ0YsT0FBT0csT0FBTyxFQUFFO1FBQ25CSCxPQUFPRyxPQUFPLEdBQUdSLHVEQUFnQixDQUFDQyxhQUFhO1lBQzdDVSxnQkFBZ0I7UUFDbEI7SUFDRjtJQUVBTixPQUFPRSxJQUFJLEdBQUcsTUFBTUYsT0FBT0csT0FBTztJQUNsQyxPQUFPSCxPQUFPRSxJQUFJO0FBQ3BCO0FBUUFELE9BQU9OLFFBQVEsR0FBR0s7QUFFbEIsaUVBQWVJLFNBQVNBLEVBQUEiLCJzb3VyY2VzIjpbIi9ob21lL3BlbG9yby9EZXNrdG9wL0NvbmRvbWluaW8vb25saW5lX3N0b3JlX3Byb2plY3QvZmluYWxfb25saW5lX3N0b3JlX3Byb2plY3QvbGliL21vbmdvb3NlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSdcblxuY29uc3QgTU9OR09EQl9VUkkgPSBwcm9jZXNzLmVudi5NT05HT0RCX1VSSSBhcyBzdHJpbmdcblxuaWYgKCFNT05HT0RCX1VSSSkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ+KdjCBNT05HT0RCX1VSSSBuw6NvIGVzdMOhIGRlZmluaWRhIG5vIC5lbnYnKVxufVxuXG4vLyBjYWNoZSBwYXJhIGV2aXRhciByZWNvbmV4w7VlcyBubyBkZXZcbmxldCBjYWNoZWQgPSBnbG9iYWwubW9uZ29vc2UgfHwgeyBjb25uOiBudWxsLCBwcm9taXNlOiBudWxsIH1cblxuYXN5bmMgZnVuY3Rpb24gY29ubmVjdERCKCkge1xuICBpZiAoY2FjaGVkLmNvbm4pIHJldHVybiBjYWNoZWQuY29ublxuXG4gIGlmICghY2FjaGVkLnByb21pc2UpIHtcbiAgICBjYWNoZWQucHJvbWlzZSA9IG1vbmdvb3NlLmNvbm5lY3QoTU9OR09EQl9VUkksIHtcbiAgICAgIGJ1ZmZlckNvbW1hbmRzOiBmYWxzZSxcbiAgICB9KVxuICB9XG5cbiAgY2FjaGVkLmNvbm4gPSBhd2FpdCBjYWNoZWQucHJvbWlzZVxuICByZXR1cm4gY2FjaGVkLmNvbm5cbn1cblxuLy8gZGVmaW5pw6fDo28gZ2xvYmFsIHByYSBuw6NvIHJlY3JpYXIgbm8gaG90IHJlbG9hZFxuZGVjbGFyZSBnbG9iYWwge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdmFyXG4gIHZhciBtb25nb29zZTogYW55XG59XG5cbmdsb2JhbC5tb25nb29zZSA9IGNhY2hlZFxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0REIiXSwibmFtZXMiOlsibW9uZ29vc2UiLCJNT05HT0RCX1VSSSIsInByb2Nlc3MiLCJlbnYiLCJFcnJvciIsImNhY2hlZCIsImdsb2JhbCIsImNvbm4iLCJwcm9taXNlIiwiY29ubmVjdERCIiwiY29ubmVjdCIsImJ1ZmZlckNvbW1hbmRzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/mongoose.ts\n");

/***/ }),

/***/ "(rsc)/./models/User.ts":
/*!************************!*\
  !*** ./models/User.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst UserSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({\n    name: {\n        type: String,\n        required: true\n    },\n    email: {\n        type: String,\n        required: true,\n        unique: true\n    },\n    apartment: {\n        type: String,\n        required: true\n    },\n    password: {\n        type: String,\n        required: true\n    },\n    admin: {\n        type: Boolean,\n        default: false\n    },\n    paymentMethod: {\n        type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,\n        ref: 'PaymentMethod',\n        default: null\n    },\n    orders: [\n        {\n            type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,\n            ref: 'Order'\n        }\n    ],\n    cartItems: [\n        {\n            type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,\n            ref: 'CartItem'\n        }\n    ]\n}, {\n    timestamps: true\n});\n// evita redefinir o model no hot-reload do Next.js\nconst User = mongoose__WEBPACK_IMPORTED_MODULE_0__.models.User || (0,mongoose__WEBPACK_IMPORTED_MODULE_0__.model)('User', UserSchema);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (User);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9tb2RlbHMvVXNlci50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMEQ7QUFFMUQsTUFBTUcsYUFBYSxJQUFJSCw0Q0FBTUEsQ0FBQztJQUM1QkksTUFBTTtRQUNKQyxNQUFNQztRQUNOQyxVQUFVO0lBQ1o7SUFDQUMsT0FBTztRQUNMSCxNQUFNQztRQUNOQyxVQUFVO1FBQ1ZFLFFBQVE7SUFDVjtJQUNBQyxXQUFXO1FBQ1RMLE1BQU1DO1FBQ05DLFVBQVU7SUFDWjtJQUNBSSxVQUFVO1FBQ1JOLE1BQU1DO1FBQ05DLFVBQVU7SUFDWjtJQUNBSyxPQUFPO1FBQ0xQLE1BQU1RO1FBQ05DLFNBQVM7SUFDWDtJQUNBQyxlQUFlO1FBQ2JWLE1BQU1MLDRDQUFNQSxDQUFDZ0IsS0FBSyxDQUFDQyxRQUFRO1FBQzNCQyxLQUFLO1FBQ0xKLFNBQVM7SUFDWDtJQUNBSyxRQUFRO1FBQUM7WUFDUGQsTUFBTUwsNENBQU1BLENBQUNnQixLQUFLLENBQUNDLFFBQVE7WUFDM0JDLEtBQUs7UUFDUDtLQUFFO0lBQ0ZFLFdBQVc7UUFBQztZQUNWZixNQUFNTCw0Q0FBTUEsQ0FBQ2dCLEtBQUssQ0FBQ0MsUUFBUTtZQUMzQkMsS0FBSztRQUNQO0tBQUU7QUFDSixHQUFHO0lBQ0RHLFlBQVk7QUFDZDtBQUVBLG1EQUFtRDtBQUNuRCxNQUFNQyxPQUFPcEIsNENBQU1BLENBQUNvQixJQUFJLElBQUlyQiwrQ0FBS0EsQ0FBQyxRQUFRRTtBQUMxQyxpRUFBZW1CLElBQUlBLEVBQUEiLCJzb3VyY2VzIjpbIi9ob21lL3BlbG9yby9EZXNrdG9wL0NvbmRvbWluaW8vb25saW5lX3N0b3JlX3Byb2plY3QvZmluYWxfb25saW5lX3N0b3JlX3Byb2plY3QvbW9kZWxzL1VzZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlLCB7IFNjaGVtYSwgbW9kZWwsIG1vZGVscyB9IGZyb20gJ21vbmdvb3NlJ1xuXG5jb25zdCBVc2VyU2NoZW1hID0gbmV3IFNjaGVtYSh7XG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVxdWlyZWQ6IHRydWVcbiAgfSxcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgdW5pcXVlOiB0cnVlXG4gIH0sXG4gIGFwYXJ0bWVudDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZXF1aXJlZDogdHJ1ZVxuICB9LFxuICBwYXNzd29yZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZXF1aXJlZDogdHJ1ZVxuICB9LFxuICBhZG1pbjoge1xuICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfSxcbiAgcGF5bWVudE1ldGhvZDoge1xuICAgIHR5cGU6IFNjaGVtYS5UeXBlcy5PYmplY3RJZCxcbiAgICByZWY6ICdQYXltZW50TWV0aG9kJyxcbiAgICBkZWZhdWx0OiBudWxsXG4gIH0sXG4gIG9yZGVyczogW3tcbiAgICB0eXBlOiBTY2hlbWEuVHlwZXMuT2JqZWN0SWQsXG4gICAgcmVmOiAnT3JkZXInXG4gIH1dLFxuICBjYXJ0SXRlbXM6IFt7XG4gICAgdHlwZTogU2NoZW1hLlR5cGVzLk9iamVjdElkLFxuICAgIHJlZjogJ0NhcnRJdGVtJ1xuICB9XVxufSwge1xuICB0aW1lc3RhbXBzOiB0cnVlXG59KVxuXG4vLyBldml0YSByZWRlZmluaXIgbyBtb2RlbCBubyBob3QtcmVsb2FkIGRvIE5leHQuanNcbmNvbnN0IFVzZXIgPSBtb2RlbHMuVXNlciB8fCBtb2RlbCgnVXNlcicsIFVzZXJTY2hlbWEpXG5leHBvcnQgZGVmYXVsdCBVc2VyIl0sIm5hbWVzIjpbIlNjaGVtYSIsIm1vZGVsIiwibW9kZWxzIiwiVXNlclNjaGVtYSIsIm5hbWUiLCJ0eXBlIiwiU3RyaW5nIiwicmVxdWlyZWQiLCJlbWFpbCIsInVuaXF1ZSIsImFwYXJ0bWVudCIsInBhc3N3b3JkIiwiYWRtaW4iLCJCb29sZWFuIiwiZGVmYXVsdCIsInBheW1lbnRNZXRob2QiLCJUeXBlcyIsIk9iamVjdElkIiwicmVmIiwib3JkZXJzIiwiY2FydEl0ZW1zIiwidGltZXN0YW1wcyIsIlVzZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./models/User.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fusers%2Froute&page=%2Fapi%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fusers%2Froute.ts&appDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fusers%2Froute&page=%2Fapi%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fusers%2Froute.ts&appDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_peloro_Desktop_Condominio_online_store_project_final_online_store_project_app_api_users_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/users/route.ts */ \"(rsc)/./app/api/users/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/users/route\",\n        pathname: \"/api/users\",\n        filename: \"route\",\n        bundlePath: \"app/api/users/route\"\n    },\n    resolvedPagePath: \"/home/peloro/Desktop/Condominio/online_store_project/final_online_store_project/app/api/users/route.ts\",\n    nextConfigOutput,\n    userland: _home_peloro_Desktop_Condominio_online_store_project_final_online_store_project_app_api_users_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ1c2VycyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGdXNlcnMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZ1c2VycyUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGcGVsb3JvJTJGRGVza3RvcCUyRkNvbmRvbWluaW8lMkZvbmxpbmVfc3RvcmVfcHJvamVjdCUyRmZpbmFsX29ubGluZV9zdG9yZV9wcm9qZWN0JTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGcGVsb3JvJTJGRGVza3RvcCUyRkNvbmRvbWluaW8lMkZvbmxpbmVfc3RvcmVfcHJvamVjdCUyRmZpbmFsX29ubGluZV9zdG9yZV9wcm9qZWN0JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNzRDtBQUNuSTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL2hvbWUvcGVsb3JvL0Rlc2t0b3AvQ29uZG9taW5pby9vbmxpbmVfc3RvcmVfcHJvamVjdC9maW5hbF9vbmxpbmVfc3RvcmVfcHJvamVjdC9hcHAvYXBpL3VzZXJzL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS91c2Vycy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3VzZXJzXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS91c2Vycy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9ob21lL3BlbG9yby9EZXNrdG9wL0NvbmRvbWluaW8vb25saW5lX3N0b3JlX3Byb2plY3QvZmluYWxfb25saW5lX3N0b3JlX3Byb2plY3QvYXBwL2FwaS91c2Vycy9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fusers%2Froute&page=%2Fapi%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fusers%2Froute.ts&appDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/bcryptjs"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fusers%2Froute&page=%2Fapi%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fusers%2Froute.ts&appDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fpeloro%2FDesktop%2FCondominio%2Fonline_store_project%2Ffinal_online_store_project&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();